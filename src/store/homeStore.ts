import { gptsType, mlog } from '@/api';
import { reactive } from 'vue'
import { ss } from '@/utils/storage'

export const homeStore = reactive({
    myData:{
        act:'',//动作
        act2:'',//动作
        actData:{} //动作类别 
        ,local:'' //当前所处的版本
        ,session:{} as any
        ,isLoader:false
        ,vtoken:'' //turnstile token
        ,ctoken:'' //cookie
        ,isClient: typeof window !== 'undefined' && window.__TAURI__
        ,ms:{} as any
        ,is_luma_pro:false
        ,is_viggle_pro:false
       
    }
    
    ,setMyData( v:object){
        this.myData={...this.myData,...v}; 
        if( Object.keys(v).indexOf('act')>-1){ 
            setTimeout(()=> {
                this.myData.act=''
                this.myData.actData=''
            }, 2000 );
        }
        if( Object.keys(v).indexOf('act2')>-1){ 
            setTimeout(()=> {
                this.myData.act2=''
                this.myData.actData=''
            }, 500 );
        }
    }
 
})

export interface gptConfigType{
    model:string
    max_tokens:number
    userModel?:string //自定义
    talkCount:number //联系对话
    systemMessage:string //自定义系统提示语
    gpts?:gptsType
    uuid?:number
    temperature?:number // 随机性 : 值越大，回复越随机
    top_p?:number // 核采样 : 与随机性类似，但不要和随机性一起更改
    frequency_penalty?:number
    presence_penalty?:number
    tts_voice?:string //TTS 人物
    model_max_tokens:number // 模型支持最大tokens
}
const getGptInt= ():gptConfigType =>{
    let v:gptConfigType=getDefault();
    let str = localStorage.getItem('gptConfigStore');
    if(str){
        let old = JSON.parse(str);
        if(old) v={...v,...old};
    }
    return v;
}

const  getDefault=()=>{
const amodel = homeStore.myData.session.amodel??'gpt-3.5-turbo'
let v:gptConfigType={
        model: amodel,
        max_tokens:1024,
        userModel:'',
        talkCount:10,
        systemMessage:'',
        temperature:0.5,
        top_p:1,
        presence_penalty:0,
        frequency_penalty:0,
        tts_voice:"alloy",
        model_max_tokens:8192
    }
    return v ;
}
export const gptConfigStore= reactive({
    myData:getGptInt(),
    setMyData(v: Partial<gptConfigType>){

         this.myData={...this.myData,...v}; 
         //mlog('gptConfigStore', v )
         if(v.model && !v.gpts) this.myData.gpts=undefined;

         localStorage.setItem('gptConfigStore', JSON.stringify( this.myData));
    }
    ,setInit(){
        this.setMyData(getDefault());
    }
})


export interface gptServerType{
    OPENAI_API_KEY:string
    OPENAI_API_BASE_URL:string
    MJ_SERVER:string
    MJ_API_SECRET:string
    UPLOADER_URL:string
    MJ_CDN_WSRV?:boolean //wsrv.nl
    SUNO_SERVER:string
    SUNO_KEY:string
    LUMA_SERVER:string
    LUMA_KEY:string
    VIGGLE_SERVER:string
    VIGGLE_KEY:string
    RUNWAY_SERVER:string
    RUNWAY_KEY:string
    IDEO_SERVER:string
    IDEO_KEY:string
    KLING_SERVER:string
    KLING_KEY:string
    PIKA_SERVER:string
    PIKA_KEY:string
    UDIO_SERVER:string
    UDIO_KEY:string
    PIXVERSE_SERVER:string
    PIXVERSE_KEY:string
    IS_SET_SYNC?:boolean
    GPTS_GX?:boolean
    IS_LUMA_PRO?:boolean
    RRUNWAY_VERSION?:string
    DRAW_TYPE?:string
    IS_VIGGLE_PRO?:boolean
    TAB_VIDEO?:string
    TTS_VOICE?:string
    REALTIME_SYSMSG?:string
    REALTIME_MODEL?:string
    REALTIME_IS_WHISPER?:boolean 
    TAB_MUSIC?:string

}

const  getServerDefault=()=>{
let v:gptServerType={
        OPENAI_API_KEY:'',
        OPENAI_API_BASE_URL:'',
        MJ_SERVER:'',
        UPLOADER_URL:'',
        MJ_API_SECRET:'',
        SUNO_KEY:'',
        SUNO_SERVER:'',
        MJ_CDN_WSRV:false
        ,IS_SET_SYNC:true,
        LUMA_SERVER:'',
        LUMA_KEY:'',
        VIGGLE_SERVER:'',
        VIGGLE_KEY:'',
        TAB_VIDEO:'luma',
        RUNWAY_SERVER:'',
        RUNWAY_KEY:'',
        IDEO_SERVER:'',
        IDEO_KEY:'',
        KLING_SERVER:'',
        KLING_KEY:'',
        PIKA_SERVER:'',
        PIKA_KEY:'',
        TTS_VOICE:'alloy',
        UDIO_SERVER:'',
        UDIO_KEY:'',
        PIXVERSE_SERVER:'',
        PIXVERSE_KEY:''
    }
    return v ;
}
const getServerInit= ():gptServerType =>{
    let v:gptServerType=getServerDefault();
    let str = localStorage.getItem('gptServerStore');
    if(str){
        let old = JSON.parse(str);
        if(old) v={...v,...old};
    }
    return v;
}

export const gptServerStore= reactive({
    myData:getServerInit(),
    setMyData(v: Partial<gptServerType>){
         this.myData={...this.myData,...v}; 
         localStorage.setItem('gptServerStore', JSON.stringify( this.myData));
    }
    ,setInit(){
        this.setMyData(getServerDefault());
    }
})


const gptsUlistInit= ():gptsType[]=>{
    const lk= ss.get('gpts-use-list');
    if( !lk) return [];
    return lk as gptsType[]; 
}

//使用gtps列表
export const gptsUlistStore= reactive({
    myData:gptsUlistInit(),
    setMyData( v: gptsType){
        this.myData= this.myData.filter( v2=> v2.gid!=v.gid );
        this.myData.unshift(v);
        ss.set('gpts-use-list', this.myData );
        return this;
    }
});