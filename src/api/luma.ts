import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";
import { LumaMedia, lumaStore } from "./lumaStore";
import { sleep } from "./suno";




function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }
    if(!gptServerStore.myData.LUMA_KEY){
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.LUMA_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}

const getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    if(gptServerStore.myData.LUMA_SERVER){
        return `${ gptServerStore.myData.LUMA_SERVER}/luma${url}`;
    }
    return `/luma${url}`;
}

export const lumaFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('sunoFetch', url  );
    let headers= {'Content-Type':'application/json'}
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

export const FeedLumaTask= async(id:string)=>{
    if(id=='')return '';
    const lumaS = new lumaStore();
    for(let i=0; i<120;i++){
        let d:LumaMedia = await lumaFetch('/generations/'+id );
        if(d.id){
            d.last_feed = new Date().getTime()
            lumaS.save(d);
            homeStore.setMyData({act:'FeedLumaTask'});
            if( d.state=='completed' && d.video && d.video?.download_url  ){ //有的时候  completed 但是 没链接
                break;
            }
        }
        await sleep(5*1000);
    }
}