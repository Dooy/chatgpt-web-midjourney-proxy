import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";
import { sleep } from "./suno";
import { RunwayMlStore, RunwayMlTask } from "./runwaymlStore";

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
        return `${ gptServerStore.myData.RUNWAY_SERVER}${pro_prefix}/runwayml${url}`;
    }
    return `${pro_prefix}/runwayml${url}`;
}


export const runwayMlFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('runwayFetch', url  );
    let headers= opt2?.upFile?{}: {'Content-Type':'application/json'}
     
    if(opt2 && opt2.headers ) headers= opt2.headers;

    const otherHeader ={ 'X-Runway-Version': '2024-11-06'}

    headers={...headers,...getHeaderAuthorization()} //,...otherHeader
   
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

export interface RunwayMlInput {
    model:string
    promptText:string
}

export const runwayMlFeed= async(id:string, input:RunwayMlInput)=>{
    const sunoS = new RunwayMlStore();
    for(let i=0; i<1200; i++){
        let d= await runwayMlFetch(`/v1/tasks/${id}`)
        let task:RunwayMlTask={...d,...input} as RunwayMlTask
        task.last_feed=new Date().getTime()
        sunoS.save( task )
        homeStore.setMyData({act:'runwayml.feed'})
        if(task.status=='SUCCEEDED' || 'FAILED'== task.status ){
            break;
        }
        //mlog('ddd>>',d )
        await sleep(5800)
    }
}

export const runwayMlFeedById= async(id:string)=>{
     const sunoS = new RunwayMlStore();
     const obj= sunoS.getOneById(id)
     if (!obj) return ;
     runwayMlFeed(id,{ model:obj.model,promptText:obj.promptText})
}


export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
