import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";
import { pixverseRep, pixverseStore, pixverseTask } from "./pixverseStore";
import { sleep } from "./suno";
import { riffAudio, riffStore, riffTask } from "./riffStore";
// import { KlingTask, klingStore } from "./klingStore";
// import { sleep } from "./suno";



function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }
    if(!gptServerStore.myData.RIFF_KEY){ 
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.RIFF_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}

export const  getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    
    const pro_prefix= '';//homeStore.myData.is_luma_pro?'/pro':''
    url= url.replaceAll('/pro','')
    if(gptServerStore.myData.RIFF_SERVER  ){
      
        return `${ gptServerStore.myData.RIFF_SERVER}${pro_prefix}/riffusion${url}`;
    }
    return `${pro_prefix}/riffusion${url}`;
}


export const riffFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('riffFetch', url  );
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

export const riffFeed= async( ids:string)=>{
    const sunoS = new riffStore();
    let url= `/feed/${ids}`;
    for(let i=0; i<200;i++){
         try{
            
            let a= await riffFetch( url )
             mlog('riffFetch', a )
            if(a.generations && a.generations.length >0){
                for(let o of a.generations){
                    mlog('riffFetch-one', o )
                    let d:riffAudio= o as riffAudio
                    const   task:riffTask={ id:d.id,last_feed:new Date().getTime(),riff:d,status: a.status } 
                    sunoS.save( task )
                }
                if(a.status=='success'){
                    homeStore.setMyData({act:'RiffFeed'});
                    break;
                }
            }else{
                let arr= ids.split(',')
                for(let id of arr){
                    const task:riffTask={ id,last_feed:new Date().getTime(), status: 'submitted' } 
                    sunoS.save( task )
                }
            }
            homeStore.setMyData({act:'RiffFeed'});


            
         }catch(e){
         }
        await sleep(5200)
    }


}
