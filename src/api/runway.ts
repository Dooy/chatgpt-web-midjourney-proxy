import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";

function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }
    if(!gptServerStore.myData.RUNWAY_KEY){ 
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.RUNWAY_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}

export const  getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    
    const pro_prefix= url.indexOf('/pro')>-1?'/pro':'';//homeStore.myData.is_luma_pro?'/pro':''
    url= url.replaceAll('/pro','')
    if(gptServerStore.myData.RUNWAY_SERVER  ){
        if(gptServerStore.myData.RUNWAY_SERVER.indexOf('/pro')>0){
            return `${ gptServerStore.myData.RUNWAY_SERVER}/runway${url}`;
        }
        return `${ gptServerStore.myData.RUNWAY_SERVER}${pro_prefix}/runway${url}`;
    }
    return `${pro_prefix}/runway${url}`;
}


export const runwayFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('viggleFetch', url  );
    let headers= opt2?.upFile?{}: {'Content-Type':'application/json'}
     
    if(opt2 && opt2.headers ) headers= opt2.headers;

    headers={...headers,...getHeaderAuthorization()}
   
    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET'};
       
        opt.headers= headers ;
        if(opt2?.upFile ){
             opt.method='POST';
             opt.body=data as FormData ;
        }
        else if(data) {
            opt.body= JSON.stringify(data) ;
            opt.method='POST';
        }
        fetch(getUrl(url),  opt )
        .then( async (d) =>{
            if (!d.ok) { 
                let msg = '发生错误: '+ d.status
                try{ 
                  let bjson:any  = await d.json();
                  msg = '('+ d.status+')发生错误: '+(bjson?.error?.message??'' ) 
                }catch( e ){ 
                }
                homeStore.myData.ms &&  homeStore.myData.ms.error(msg )
                throw new Error( msg );
            }
     
            d.json().then(d=> resolve(d)).catch(e=>{ 
            
                homeStore.myData.ms &&  homeStore.myData.ms.error('发生错误'+ e )
                reject(e) 
            }
        )})
        .catch(e=>{ 
            if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                homeStore.myData.ms &&  homeStore.myData.ms.error('跨域|CORS error'  )
            }
            else homeStore.myData.ms &&  homeStore.myData.ms.error('发生错误:'+e )
            mlog('e', e.stat )
            reject(e)
        })
    })

}


export const runwayUpload= async (file:any , type :string)=>{
     let obj={
            "filename": file.name,
            "numberOfParts": 1,
            type //"DATASET_PREVIEW"
        }
    const  d:any = await runwayFetch('/uploads',obj)
    mlog("runwayUpload",d)

    const response= await fetch( d.uploadUrls[0], {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': d.uploadHeaders["Content-Type"],
            'Accept': '/',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Connection': 'keep-alive'
        }
    }) ;
    //const djson:any = await response.json();
    if (response.status!=200){
      throw "upload file faile"
    }
    //mlog("runwayUpload2", djson)
    // return djson uploads/0e01608a-89f8-4cb8-920a-669813fb224f/complete
    let obj2={"parts":[{"PartNumber":1,"ETag":"ca3b00c313b6fd9a5c48889ad16f7d5e"}]}
    const  d2:any = await runwayFetch(`/uploads/${d.id}/complete`, obj2 )
    mlog("runwayUpload2", d2)
    return d2;
}
