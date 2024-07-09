import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";
import { sleep } from "./suno";
import { ViggleTask, viggleStore } from "./viggleStore";

function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }
    if(!gptServerStore.myData.VIGGLE_KEY){
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.VIGGLE_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}

export const  getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    
    const pro_prefix= '';//url.indexOf('/pro')>-1?'/pro':'';//homeStore.myData.is_luma_pro?'/pro':''
   // url= url.replaceAll('/pro','')
    if(gptServerStore.myData.VIGGLE_SERVER){
        if(gptServerStore.myData.VIGGLE_SERVER.indexOf('/pro')>0){
            return `${ gptServerStore.myData.VIGGLE_SERVER}/viggle${url}`;
        }
        return `${ gptServerStore.myData.VIGGLE_SERVER}${pro_prefix}/viggle${url}`;
    }
    return `${pro_prefix}/viggle${url}`;
}

export interface tagInfo {
    id: string;
    name: string;
    sort: number;
}
export interface ViggleTemplate {
    id: string;
    processedURL: string;
    processedHdURL: string;
    processedCoverURL: string;
    command?: string;
    webCommand?: string;
    description: string;
    webStatus?: number;
    dcStatus?: number;
    appStatus?: number;
    bgURL?: string;
    bgCoverURL?: string;
    displayURL?: string;
    displayHdURL?: string;
    displayCoverURL?: string;
    gifURL?: string;
    webPURL?: string;
    source?: string;
    sort?: number;
    width?: number;
    height?: number;
}
 
export const viggleFetch=(url:string,data?:any,opt2?:any )=>{
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

export  async function FeedViggleTask(id:string){  
    const ss = new viggleStore()
    for(let i=0; i<500;i++){
        const d= await viggleFetch('/video-task/by-ids',{ids:[id]})
        mlog('FeedViggleTask', d )
       
        if(d.data && d.data.length>0){
            let task= d.data[0] as ViggleTask;
            task.last_feed=new Date().getTime()
            ss.save( task )
            homeStore.setMyData({act:'FeedViggleTask'})
            if ( d.data[0].status==0) return
        }
        await sleep(2000)
    }

}