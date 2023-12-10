
import { gptConfigStore, gptServerStore, homeStore } from "@/store";
import { mlog } from "./mjapi";
import { fetchSSE } from "./sse/fetchsse";
import axios from 'axios';

export const KnowledgeCutOffDate: Record<string, string> = {
  default: "2021-09",
  "gpt-4-1106-preview": "2023-04",
  "gpt-4-vision-preview": "2023-04",
};

const getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    if(gptServerStore.myData.OPENAI_API_BASE_URL){
        return `${ gptServerStore.myData.OPENAI_API_BASE_URL}${url}`;
    }
    return `/openapi${url}`;
}
export const gptGetUrl = getUrl 
export const gptFetch=(url:string,data?:any,opt2?:any )=>{
    mlog('gptFetch', url  );
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
        .then(d=>d.json().then(d=> resolve(d))
        .catch(e=>reject(e)))
        .catch(e=>reject(e))
    })
     
}

export const GptUploader =   ( url:string, FormData:FormData )=>{
    // if(gptServerStore.myData.OPENAI_API_BASE_URL){
    //     return `${ gptServerStore.myData.OPENAI_API_BASE_URL}${url}`;
    // }
    url= gptServerStore.myData.UPLOADER_URL? gptServerStore.myData.UPLOADER_URL :  gptGetUrl( url );
    let headers=  {'Content-Type': 'multipart/form-data'}
     
    if(gptServerStore.myData.OPENAI_API_BASE_URL && url.indexOf(gptServerStore.myData.OPENAI_API_BASE_URL)>-1  ) headers={...headers,...getHeaderAuthorization()}
    return new Promise<any>((resolve, reject) => {
            axios.post( url , FormData, {
            headers 
        }).then(response =>  resolve(response.data ) 
        ).catch(error =>reject(error)  );
    })
    
}

export const subGPT= async (data:any, chat:Chat.Chat )=>{
   let d:any;
   let action= data.action;
   //chat.myid=  `${Date.now()}`;
   if(  action=='gpt.dall-e-3' ){ //执行变化
       // chat.model= 'dall-e-3';

       let d= await gptFetch('/v1/images/generations', data.data);
       try{
            const rz : any= d.data[0];
            chat.text= rz.revised_prompt??`图片已完成`;
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
    model?:string
}
function getHeaderAuthorization(){
    if(!gptServerStore.myData.OPENAI_API_KEY){
        return {}
    }
    return {
        'Authorization': 'Bearer ' +gptServerStore.myData.OPENAI_API_KEY
    }
}

export const getSystemMessage = ()=>{
    //KnowledgeCutOffDate
    if( gptConfigStore.myData.systemMessage) return  gptConfigStore.myData.systemMessage
    let model= gptConfigStore.myData.model?gptConfigStore.myData.model: "gpt-3.5-turbo";
      const DEFAULT_SYSTEM_TEMPLATE = `You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: ${KnowledgeCutOffDate[model]}
Current model: ${model}
Current time: ${ new Date().toLocaleString()}
Latex inline: $x^2$ 
Latex block: $$e=mc^2$$`;   
return DEFAULT_SYSTEM_TEMPLATE;

}
export const subModel= async (opt: subModelType)=>{
    //
    const model= opt.model?? ( gptConfigStore.myData.model?gptConfigStore.myData.model: "gpt-3.5-turbo");
    let max_tokens= gptConfigStore.myData.max_tokens;
    if(model=='gpt-4-vision-preview' && max_tokens>2048) max_tokens=2048; 
    let body ={
            max_tokens ,
            model ,
            "temperature": 0.5,
            "top_p": 1,
            "presence_penalty":0,
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
