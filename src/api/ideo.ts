import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";
import { sleep } from "./suno";


export interface IdeoImageData {
  is_image_safe: boolean;
  prompt: string;
  resolution: string;
  seed: number;
  url: string;
}
function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }
    if(!gptServerStore.myData.IDEO_KEY){
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.IDEO_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}

export const  getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    
    const pro_prefix= '';//homeStore.myData.is_luma_pro?'/pro':''
    url= url.replaceAll('/pro','')
    if(gptServerStore.myData.IDEO_SERVER){
        
        return `${ gptServerStore.myData.IDEO_SERVER}${pro_prefix}/ideogram${url}`;
    }
    return `${pro_prefix}/ideogram${url}`;
}
 

export const ideoSubmit= async( data:any ):Promise<IdeoImageData[]>=>{
    let rz:IdeoImageData[]
    let rzdata:any={image_request:data.image_request}
    if(data.file) { 
        //mlog('文件上传', data.file  ); 
        const formData = new FormData(); 
        formData.append('image_file',   data.file )
        formData.append('image_request',  JSON.stringify(data.image_request) )
    
        let d:any = await ideoFetch( '/remix', formData,{upFile:true})
        //mlog(' 文件上传 back', d ); 
        rz= d.data as IdeoImageData[]
    }else{
        let  d:any = await ideoFetch('/generate ' ,rzdata ) 
        //mlog('back', d ); 
        rz= d.data as IdeoImageData[]
    }
    return rz;

}
export const ideoFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('ideoFetch', url  );
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

// export  async function FeedViggleTask(id:string){  
//     const ss = new viggleStore()
//     const hk= new lumaHkStore();
//     const hkObj= hk.getOneById(id)
//     for(let i=0; i<500;i++){
//         let url= '/video-task/by-ids';
//         if(hkObj && hkObj.isHK ) url= '/pro/video-task/by-ids';
//         const d= await viggleFetch(url,{ids:[id]})
//         mlog('FeedViggleTask', d )
       
//         if(d.data && d.data.length>0){
//             let task= d.data[0] as ViggleTask;
//             task.last_feed=new Date().getTime()
//             ss.save( task )
//             homeStore.setMyData({act:'FeedViggleTask'})
//             if ( d.data[0].status==0) return
//         }
//         await sleep(2000)
//     }

// }