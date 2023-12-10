import { gptsType, mlog } from '@/api';
import { reactive } from 'vue'
export const homeStore = reactive({
    myData:{
        act:'',//动作
        actData:{} //动作类别 
        ,local:'' //当前所处的版本
        ,session:{} as any
       
    }
    
    ,setMyData( v:object){
        this.myData={...this.myData,...v}; 
        if( Object.keys(v).indexOf('act')>-1){ 
            setTimeout(()=> {
                this.myData.act=''
                this.myData.actData=''
            }, 2000 );
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
let v:gptConfigType={
        model:'gpt-3.5-turbo',
        max_tokens:1024,
        userModel:'',
        talkCount:10,
        systemMessage:''
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

}

const  getServerDefault=()=>{
let v:gptServerType={
        OPENAI_API_KEY:'',
        OPENAI_API_BASE_URL:'',
        MJ_SERVER:'',
        UPLOADER_URL:'',
        MJ_API_SECRET:''
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