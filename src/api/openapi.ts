
import { gptConfigStore, gptServerStore, homeStore } from "@/store";
import { mlog } from "./mjapi";
import { fetchSSE } from "./sse/fetchsse";

const getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    if(gptServerStore.myData.OPENAI_API_BASE_URL){
        return `${ gptServerStore.myData.OPENAI_API_BASE_URL}${url}`;
    }
    return `/openapi${url}`;
}
export const gptGetUrl = getUrl 
export const gptFetch=(url:string,data?:any)=>{
    mlog('gptFetch', url  );
    let headers= {'Content-Type':'application/json'}
     
    headers={...headers,...getHeaderAuthorization()}
    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET'}; 
        opt.headers= headers ;
        if(data) {
            opt.body= JSON.stringify(data) ;
             opt.method='POST';
        }
        fetch(getUrl(url),  opt )
        .then(d=>d.json().then(d=> resolve(d))
        .catch(e=>reject(e)))
        .catch(e=>reject(e))
    })
     
}

export const subGPT= async (data:any, chat:Chat.Chat )=>{
   let d:any;
   let action= data.action;
   //chat.myid=  `${Date.now()}`;
   if(  action=='gpt.dall-e-3' ){ //执行变化
        chat.model= 'dall-e-3';

       let d= await gptFetch('/v1/images/generations', data.data);
       try{
            const rz : any= d.data[0];
            chat.text= rz.revised_prompt;
            chat.opt={imageUrl:rz.url } ;
            chat.loading = false;
            homeStore.setMyData({act:'updateChat', actData:chat });
       }catch(e){
            chat.text='失败！'+"\n```json\n"+JSON.stringify(d, null, 2)+"\n```\n";
            chat.loading=false;
            homeStore.setMyData({act:'updateChat', actData:chat });
       }

   }

}

interface subModelType{
    message:any[]
    onMessage:(d:{text:string,isFinish:boolean})=>void
    onError?:(d?:any)=>void
    signal?:AbortSignal
}
function getHeaderAuthorization(){
    if(!gptServerStore.myData.OPENAI_API_KEY){
        return {}
    }
    return {
        'Authorization': 'Bearer ' +gptServerStore.myData.OPENAI_API_KEY
    }
}
export const subModel= async (opt: subModelType)=>{
    let body ={
            "max_tokens": gptConfigStore.myData.max_tokens ,
            "model": gptConfigStore.myData.model?gptConfigStore.myData.model: "gpt-3.5-turbo",
            "temperature": 0.8,
            "top_p": 1,
            "presence_penalty": 1,
            "messages": opt.message
           ,stream:true 
        }
        // 

        let  headers ={
                'Content-Type': 'application/json'
                //,'Authorization': 'Bearer ' +gptServerStore.myData.OPENAI_API_KEY
                ,'Accept': 'text/event-stream ' 
        }
        headers={...headers,...getHeaderAuthorization()}
         
        try { 
         await fetchSSE( gptGetUrl('/v1/chat/completions'),{
            method: 'POST',
            headers: headers,
            signal:opt.signal,
            onMessage: async (data:string)=> {
                 //mlog('🐞测试'  ,  data )  ;
                 if(data=='[DONE]') opt.onMessage({text:'',isFinish:true})
                 else {
                    const obj= JSON.parse(data );
                    opt.onMessage({text:obj.choices[0].delta?.content??'' ,isFinish:obj.choices[0].finish_reason!=null })
                 }
            },
            onError(e ){
                //console.log('eee>>', e )
                mlog('❌未错误',e    )
                opt.onError && opt.onError(e)
            },
            body:JSON.stringify(body)
        });
     } catch (error ) {
        mlog('❌未错误2',error  )
        opt.onError && opt.onError(error)
     }
}

export const getInitChat = (txt:string )=>{
    let promptMsg: Chat.Chat= {
        dateTime: new Date().toLocaleString(),
        text:  txt ,
        inversion: true,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt:txt, options: null },
        }
        return promptMsg;
}
