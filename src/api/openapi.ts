
import { gptConfigStore, gptServerStore, homeStore } from "@/store";
import { mlog,myTrim } from "./mjapi";
import { fetchSSE } from "./sse/fetchsse";
import axios from 'axios';
import { localGet, localSaveAny } from "./mjsave";
import { isNumber, isObject } from "@/utils/is";
import { t } from "@/locales";
import { ChatMessage } from "gpt-tokenizer/esm/GptEncoding";
//import {encode,  encodeChat}  from "gpt-tokenizer"
//import {encode,  encodeChat} from "gpt-tokenizer/cjs/encoding/cl100k_base.js";
//import { get_encoding } from '@dqbd/tiktoken'
//import FormData from 'form-data';

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
    let headers=   {'Content-Type': 'multipart/form-data' }
    // 
    
    
     
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

export interface ttsType{ 
        model: string,
        input: string ,
        voice?: string,
     
}
export const subTTS = async (tts:ttsType )=>{
    if(!tts.voice) tts.voice='alloy';
    let url= getUrl('/v1/audio/speech');
    let headers=  {
        'Content-Type': 'application/json' 
      }
     headers={...headers,...getHeaderAuthorization()}
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(tts),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    } 
    const audioData = await response.arrayBuffer();
    const blob = new Blob([audioData], { type: 'audio/mp3' });
    mlog('blob', blob);
    const saveID = await localSaveAny( blob );
    const pp= await bolbObj(blob );
    return { blob,saveID ,...pp };

}

export const bolbObj= ( blob:Blob )=>{
    return new Promise<{player:HTMLAudioElement,duration:number }>((resolve, reject) => {
        const player = new window.Audio(); 
        player.src = URL.createObjectURL(blob);
        
        player.addEventListener('loadedmetadata', () => {
            mlog('时长', player.duration);
            resolve({player,duration: player.duration });
        });
        player.addEventListener('error',(e )=>{
            reject(e )
        })
        player.load(); 
    })
    
}

function formatDate(): string[] {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const lastDay = new Date(year, month, 0)
  const formattedFirstDay = `${year}-${month.toString().padStart(2, '0')}-01`
  const formattedLastDay = `${year}-${month.toString().padStart(2, '0')}-${lastDay.getDate().toString().padStart(2, '0')}`
  return [formattedFirstDay, formattedLastDay]
}

//  

export const  gptUsage=async ()=>{

    // fetch(getUrl(url),  opt )
    //     .then(d=>d.json().then(d=> resolve(d))
    //     .catch(e=>reject(e)))
    //     .catch(e=>reject(e))
    const [startDate, endDate] = formatDate();
    const urlUsage = `/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`
    const usageData = await gptFetch(urlUsage);
    const billData = await gptFetch('/v1/dashboard/billing/subscription');
   
    const usage = Math.round(usageData.total_usage) / 100
     mlog('gpt', usage , billData  );
     //remaining = subscriptionData.system_hard_limit_usd - totalUsage;
     return {usage,remaining:Math.round( (billData.hard_limit??billData.hard_limit_usd*100) - usageData.total_usage ) / 100 ,hard_limit_usd:billData.hard_limit_usd } ;

}

export const openaiSetting= ( q:any )=>{
    //mlog()
    mlog('setting', q )
    if(isObject(q)){ 
        mlog('setting2', q )
        gptServerStore.setMyData(  q ) 
        //gptServerStore.setMyData( gptServerStore.myData );
        blurClean();
        gptServerStore.setMyData( gptServerStore.myData );

    }
    
}
export const blurClean= ()=>{
  mlog('blurClean');
  gptServerStore.myData.OPENAI_API_BASE_URL =myTrim( myTrim(gptServerStore.myData.OPENAI_API_BASE_URL.trim(),'/'), '\\' );
  gptServerStore.myData.OPENAI_API_KEY = gptServerStore.myData.OPENAI_API_KEY.trim();
  gptServerStore.myData.MJ_SERVER =myTrim( myTrim( gptServerStore.myData.MJ_SERVER.trim(),'/'),'\\');
  gptServerStore.myData.MJ_API_SECRET = gptServerStore.myData.MJ_API_SECRET.trim();
  gptServerStore.myData.UPLOADER_URL=  myTrim( myTrim( gptServerStore.myData.UPLOADER_URL.trim(),'/'),'\\');
}

export const countTokens= async ( dataSources:Chat.Chat[], input:string )=>{
    let rz={system:0,input:0 ,history:0,remain:330,modelTokens:'4k',planOuter: gptConfigStore.myData.max_tokens  }
    const model = gptConfigStore.myData.model;
    const max= getModelMax(model );
    rz.modelTokens= `${max}k`
    //cl100k_base.encode(input)
    
    const encode= await encodeAsync();
    rz.input = encode(input).length;
    rz.system = encode(getSystemMessage() ).length; 
    const encodeChat = await encodeChatAsync(); 
    const msg= await getHistoryMessage(  dataSources,1 ) ;
    rz.history= msg.length==0?0: encodeChat(msg, model.indexOf('gpt-4')>-1? 'gpt-4':'gpt-3.5-turbo').length 
    //
    rz.remain = 1024*max- rz.history- rz.planOuter- rz.input- rz.system; 

    return rz ;
}
const getModelMax=( model:string )=>{
    let max=4;
    model= model.toLowerCase();
    if( model.indexOf('8k')>-1  ){
        return 8;
    }else if( model.indexOf('16k')>-1 || model=='gpt-3.5-turbo-1106' ){
        return 16;
    }else if( model.indexOf('32k')>-1  ){
        return 32;
    }else if( model.indexOf('64k')>-1  ){
        return 64;
    }else if( model.indexOf('128k')>-1 || model=='gpt-4-1106-preview' ){
        return 128; 
    }else if( model.indexOf('gpt-4')>-1  ){  
        max=8;
    }

    return max;
}

export const encodeAsync = async ( ) => {
  const { encode } = await import('gpt-tokenizer');

  return encode;//(str).length;
};
export const encodeChatAsync = async ( ) => {
  const { encodeChat } = await import('gpt-tokenizer');

  return encodeChat;//(obj,model ).length;
};


export const getHistoryMessage= async (dataSources:Chat.Chat[],loadingCnt=1 ,start=1000)=>{
    let i=0;
    let rz: ChatMessage[] = [];
    //const loadingCnt= 1;// 1就是没有loading，3 就是有loading
    let istart = (isNumber( start)&& start>=0 )? Math.min(start  ,   dataSources.length - loadingCnt ):  dataSources.length- loadingCnt  ;
    mlog('istart',istart, start); 
    for( let ii=  istart  ; ii>=0 ; ii-- ){ //let o of dataSources.value
        if(i>=gptConfigStore.myData.talkCount) break;
        i++;

        let o = dataSources[ii];
        //mlog('o',ii ,o);
        let content= o.text;
        if( o.inversion && o.opt?.images && o.opt.images.length>0 ){
            //获取附件信息 比如 图片 文件等
            try{
               let str =  await localGet(  o.opt.images[0]) as string;
               let fileBase64= JSON.parse(str) as string[];
               let arr =  fileBase64.filter( (ff:string)=>ff.indexOf('http')>-1);
               if(arr.length>0) content = arr.join(' ')+' '+ content ;

               mlog(t('mjchat.attr') ,o.opt.images[0] , content );
            }catch(ee){
            }
        }

        //mlog('d',gptConfigStore.myData.talkCount ,i ,o.inversion , o.text);
        rz.push({content , role: !o.inversion ? 'assistant' : 'user'});
    }
    rz.reverse();
    mlog('rz',rz);
    return rz ;
}