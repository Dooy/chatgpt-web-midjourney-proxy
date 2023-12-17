<script setup lang='ts'> 
import { computed,   ref,watch  } from 'vue' 
import { useRoute } from 'vue-router'
import { useChat } from '../chat/hooks/useChat' 
import { gptConfigStore, homeStore, useChatStore } from '@/store'
import { getInitChat, mlog, subModel,getSystemMessage , localSaveAny, canVisionModel } from '@/api'
import { isNumber } from '@/utils/is'
 

const emit = defineEmits(['finished']);
const { addChat , updateChatSome } = useChat() 
const chatStore = useChatStore()
const st=ref({uuid:'1002', index:-1 });
const controller = ref<AbortController>( );;// new AbortController();
const dataSources = computed(() => chatStore.getChatByUuid(+st.value.uuid))

const textRz= ref<string[]>([]);
const goFinish= (  )=>{
    //let dindex = st.value.index>=0? st.value.index : dataSources.value.length - 1;
    //return ;
    updateChatSome( +st.value.uuid,  st.value.index , { dateTime: new Date().toLocaleString(),loading: false })
    //scrollToBottom();
    emit('finished');
  
    homeStore.setMyData({act:'scrollToBottomIfAtBottom'});
    mlog('🐞 goFinish2',st.value.uuid);
    // setTimeout(() => {
        
    //    if(textRz.value.length>0 )  textRz.value = [];
    // }, 200 ); 
}

const getMessage= (start=1000)=>{
    let i=0;
    let rz = [];
    let istart = (isNumber( start)&& start>=0 )? Math.min(start  ,   dataSources.value.length - 3):  dataSources.value.length - 3;
    mlog('istart',istart, start); 
    for( let ii=  istart  ; ii>=0 ; ii-- ){ //let o of dataSources.value
        if(i>=gptConfigStore.myData.talkCount) break;
        i++;

        let o = dataSources.value[ii];

        //mlog('d',gptConfigStore.myData.talkCount ,i ,o.inversion , o.text);
        rz.push({content:o.text, role: !o.inversion ? 'assistant' : 'user'});
    }
    rz.reverse();
    mlog('rz',rz);
    return rz ;
}
watch( ()=>textRz.value, (n)=>{
    //mlog('🐞 textRz',n);
    if(n.length==0) return ;
    updateChatSome( +st.value.uuid, st.value.index , { dateTime: new Date().toLocaleString(),text: n.join('') })
    //scrollToBottom();
    homeStore.setMyData({act:'scrollToBottomIfAtBottom'})
    //homeStore.setMyData({act:'scrollToBottom'})
},{deep:true}) 
const { uuid } = useRoute().params as { uuid: string }
watch(()=>homeStore.myData.act, async (n)=>{
    if(n=='gpt.submit'){
        const dd:any = homeStore.myData.actData;
        mlog('gpt.submit', dd , dd.uuid) ;
        let  uuid2 =  dd.uuid?? uuid;
        st.value.uuid =  uuid2 ;
        let model = gptConfigStore.myData.model
        
        let promptMsg = getInitChat(dd.prompt );
        if( dd.fileBase64 && dd.fileBase64.length>0 ){ 
            if( !canVisionModel(model)  ) model='gpt-4-vision-preview';
        
            try{
                    let images= await localSaveAny( JSON.stringify( dd.fileBase64)  ) ;
                    mlog('key', images );
                    promptMsg.opt= {images:[images]}
            }catch(e){
                mlog('localSaveAny error',e);
            }
        }
        addChat(  +uuid2, promptMsg );
        homeStore.setMyData({act:'scrollToBottom'});
       


       
        let outMsg: Chat.Chat={
            dateTime: new Date().toLocaleString(),
            text:  '思考中...',
            loading: true,
            inversion: false,
            error: false,
            conversationOptions: null,
            requestOptions: { prompt: dd.prompt, options: {  } },
            uuid:+uuid2,
            model ,
            myid: `${Date.now()}` 
        }
        if(gptConfigStore.myData.gpts){
            outMsg.logo= gptConfigStore.myData.gpts.logo ;
        }
        addChat(  +uuid2, outMsg  )
        st.value.index= dataSources.value.length - 1;
        if(textRz.value.length>=0) textRz.value = [ ];

        homeStore.setMyData({act:'scrollToBottom'})
        let historyMesg=  getMessage();
        let message= [ {  "role": "system", "content": getSystemMessage() },
                ...historyMesg ];
        if( dd.fileBase64 && dd.fileBase64.length>0 ){
            if(  model=='gpt-4-vision-preview' ){
                let obj={
                        "role": "user",
                        "content": [] as any
                }
                // //"Generate code for a web page that looks exactly like this."
                obj.content.push({ "type": "text",      "text": dd.prompt  });
                dd.fileBase64.forEach((f:any)=>{
                    obj.content.push({ "type": "image_url",  "image_url": f  });
                });
                message.push(obj); 
            }else{
                let cc= dd.prompt;
                let arr = dd.fileBase64.filter( (ff:string)=>ff.indexOf('http')>-1);
                if(arr.length>0) cc = arr.join(' ')+' '+ cc ;
                message.push({  "role": "user",  "content": cc })
            }
        }else{
            message.push({  "role": "user",  "content": dd.prompt })
        }

        controller.value = new AbortController();
        //controller.signal
        subModel( {message,model
        ,onMessage:(d)=>{
            mlog('🐞消息',d);
            textRz.value.push(d.text);
        }
        ,onError:(e:any)=>{
            mlog('onError',e)
            let  emsg =   (JSON.stringify(  e.reason? JSON.parse( e.reason ):e,null,2));
            //if(emsg=='{}' ) emsg= JSON.stringify(e );

            if(e.message!='canceled' && emsg.indexOf('aborted')==-1 ) textRz.value.push("\n错误:\n```\n"+emsg+"\n```\n");
             goFinish();
        }
        ,signal:controller.value.signal,
        }).then(()=>goFinish() ).catch(e=>{
            if(e.message!='canceled')  textRz.value.push("\n错误:\n```\n"+(e.reason??JSON.stringify(e,null,2)) +"\n```\n")
            goFinish();
        });
 
    }else if(n=='abort'){
       controller.value && controller.value.abort();
    }else if(n=='gpt.resubmit'){
        const dd:any = homeStore.myData.actData;
        let  uuid2 =  dd.uuid?? uuid;
        st.value.uuid =  uuid2 ;
        st.value.index = +dd.index
        mlog('gpt.resubmit', dd  ) ;
        let historyMesg=  getMessage( (+dd.index)-1 ); //
        mlog('gpt.resubmit historyMesg', historyMesg );
        let nobj = dataSources.value[ dd.index ];
        //mlog('gpt.resubmit model', nobj.model  );
        let model = nobj.model
        //return ;

        controller.value = new AbortController();
        let message= [ {  "role": "system", "content": getSystemMessage() },
                ...historyMesg ]; 
        textRz.value=[];
       
        subModel( {message,model
        ,onMessage:(d)=>{
            mlog('🐞消息2',d);
            textRz.value.push(d.text);
        }
        ,onError:(e:any)=>{
            mlog('onError',e)
            const emsg =   (JSON.stringify(  e.reason? JSON.parse( e.reason ):e,null,2));
            if(e.message!='canceled' && emsg.indexOf('aborted')==-1 ) textRz.value.push("\n错误:\n```\n"+emsg+"\n```\n");
             goFinish();
        }
        ,signal:controller.value.signal,
        }).then(()=>goFinish() ).catch(e=>{
            if(e.message!='canceled')  textRz.value.push("\n错误:\n```\n"+(e.reason??JSON.stringify(e,null,2)) +"\n```\n")
            goFinish();
        });

    }
    
})

homeStore.setMyData({isLoader:false});
</script>
<template>
 
</template>