import { gptServerStore, homeStore, useAuthStore } from "@/store";
import { mlog } from "./mjapi";
//import { seedanceStore, SeedanceTask } from "./seedanceStore";
import { sleep } from "./suno";
import { minimaxStore, MinimaxTask } from "./minimaxStore";

function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }
    if(!gptServerStore.myData.MINIMAX_KEY){ 
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.MINIMAX_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}

export const  getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    
    const pro_prefix= '';//homeStore.myData.is_luma_pro?'/pro':''
    //url= url.replaceAll('/pro','')
    if(gptServerStore.myData.MINIMAX_SERVER  ){
      
        return `${ gptServerStore.myData.MINIMAX_SERVER}${pro_prefix}/minimax${url}`;
    }
    return `${pro_prefix}/minimax${url}`;
}

export const minimaxFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('runwayFetch', url  );
    let headers= opt2?.upFile?{}: {'Content-Type':'application/json'}
     
    if(opt2 && opt2.headers ) headers= opt2.headers;

    headers={...headers,...getHeaderAuthorization()}
   
    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET' };
       
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

export const MinimaxFeed= async(id:string,prompt:string)=>{
     const sunoS = new minimaxStore();
    const  url='/v2/query/video_generation/'+id;
    for(let i=0; i<200;i++){
            try{
                
                let a= await minimaxFetch( url )
                const task :MinimaxTask={
                    last_feed:new Date().getTime()
                    ,id
                    ,status:'submitted'
                };
                
                if(prompt){
                  task.prompt= prompt
                }
                if(a.task.status){
                    task.status= a.task.status
                }
                if(a.task?.content?.url){
                    task.url= a.task.content?.url
                }
                sunoS.save( task )
                homeStore.setMyData({act:'MinimaxFeed'});
                if( task.status =='failed' || 'succeeded'== task.status ||  task.url ){
                    break;
                }
            }catch(e){
                break;
            }
            await sleep(5200)
        }
}