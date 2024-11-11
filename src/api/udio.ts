import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";
//import { KlingTask, klingStore } from "./klingStore";
import { sleep } from "./suno";
import { udioStore, udioTask } from "./udioStore";



function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }
    if(!gptServerStore.myData.UDIO_KEY){ 
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.UDIO_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}


export const  getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url; 
    const pro_prefix= ''; 
    url= url.replaceAll('/pro','')
    if(gptServerStore.myData.UDIO_SERVER  ){
      
        return `${ gptServerStore.myData.UDIO_SERVER}${pro_prefix}${url}`;
    }
    return `${pro_prefix}${url}`;
}


export const udioFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('udioFetch', url  );
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

export const udioFeedTask= async(id:string)=>{
    mlog('god >>',id ) 
    const sunoS = new udioStore();
    for(let i=0;i<50;i++ ){
        let d= await udioFetch('/udio/fetch/'+id )
        // .then(d=>{
        //     mlog('fetch',d , d.data.status )
        //     if(d.data && d.data.status=='SUCCESS'){
        //         return
        //     }
        // }).catch((e)=>mlog('error ',e  ))
        if(d.data  ){
            //mlog('ddd> ' ,  d.data.data );
            if( d.data.data && d.data.data.songs){
                for(let ab of d.data.data.songs ){
                    let song= ab as udioTask
                    song.status= d.data.status
                    song.taskId= d.data.task_id
                    song.failReason= d.data.fail_reason
                    song.last_feed=new Date().getTime()
                    sunoS.save( song)
                    //mlog('d', song )
                    homeStore.setMyData({act:'udio.feed'});
                }

            }
            if(d.data.status=='SUCCESS' ) return
        }
        await sleep(5000)
    }
}
