import { gptServerStore,homeStore,useAuthStore } from "@/store";
import { mlog } from "./mjapi";
import { sunoStore,SunoMedia } from "./sunoStore";  

const getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    if(gptServerStore.myData.SUNO_SERVER){
        if( gptServerStore.myData.SUNO_SERVER.indexOf('suno')>0 ) return `${ gptServerStore.myData.SUNO_SERVER}${url}`;

        return `${ gptServerStore.myData.SUNO_SERVER}/suno${url}`;
    }
    return `/sunoapi${url}`;
}
function getHeaderAuthorization(){
    let headers={}
    if( homeStore.myData.vtoken ){
        const  vtokenh={ 'x-vtoken':  homeStore.myData.vtoken ,'x-ctoken':  homeStore.myData.ctoken};
        headers= {...headers, ...vtokenh}
    }
    if(!gptServerStore.myData.SUNO_KEY){
        const authStore = useAuthStore()
        if( authStore.token ) {
            const bmi= { 'x-ptoken':  authStore.token };
            headers= {...headers, ...bmi }
            return headers;
        }
        return headers
    }
    const bmi={
        'Authorization': 'Bearer ' +gptServerStore.myData.SUNO_KEY
    }
    headers= {...headers, ...bmi }
    return headers
}
export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
export const lyricsFetch= async ( lid:string)=>{
    for(let i=0;i<50;i++){
        let dt:any = await sunoFetch(`/lyrics/${lid}`);
        mlog("ddd",dt )
        let time= (i+1)
        if(time>20) time=20;
        if(dt.status=='complete') return dt ;
        await sleep( time*1000 )
        
    }
    return null;
   
}

export function randStyle(): string {
    const s: string[] = ["acoustic", "aggressive", "anthemic", "atmospheric", "bouncy", "chill", "dark", "dreamy", "electronic", "emotional", "epic", "experimental", "futuristic", "groovy", "heartfelt", "infectious", "melodic", "mellow", "powerful", "psychedelic", "romantic", "smooth", "syncopated", "uplifting", ""];
    const l: string[] = ["afrobeat", "anime", "ballad", "bedroom pop", "bluegrass", "blues", "classical", "country", "cumbia", "dance", "dancepop", "delta blues", "electropop", "disco", "dream pop", "drum and bass", "edm", "emo", "folk", "funk", "future bass", "gospel", "grunge", "grime", "hip hop", "house", "indie", "j-pop", "jazz", "k-pop", "kids music", "metal", "new jack swing", "new wave", "opera", "pop", "punk", "raga", "rap", "reggae", "reggaeton", "rock", "rumba", "salsa", "samba", "sertanejo", "soul", "synthpop", "swing", "synthwave", "techno", "trap", "uk garage"];
    
    const randomS: string = s[Math.floor(Math.random() * s.length)];
    const randomL: string = l[Math.floor(Math.random() * l.length)];
    // const randomS2: string = s[Math.floor(Math.random() * s.length)];
    // const randomL2: string = l[Math.floor(Math.random() * l.length)];

    return randomS + " " + randomL ;
}

export const FeedTask= async (ids:string[])=>{
    const sunoS = new sunoStore();
    if(ids.length<=0) return;
    
    let d:any[] = await sunoFetch('/feed/'+ ids.join(','));
    mlog('FeedTask',d )
    d.forEach( (item:SunoMedia) =>{
         sunoS.save( item)
        if(item.status== "complete" || item.status== "error" ){
            ids= ids.filter(v=>v!=item.id )
        }
    });
    homeStore.setMyData({act:'FeedTask'});
    await sleep(5*1000 );
    FeedTask(ids)

}


export const sunoFetch=(url:string,data?:any,opt2?:any )=>{
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
