<script setup lang='ts'> 
import { computed, onMounted, onUnmounted, ref,watch ,nextTick } from 'vue'
import { useRoute } from 'vue-router' 
import {    useMessage } from 'naive-ui'
 
import { useScroll } from '../chat/hooks/useScroll'
import { useChat } from '../chat/hooks/useChat'
import { useUsingContext } from '../chat/hooks/useUsingContext' 
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { gptConfigStore, homeStore, useChatStore, usePromptStore } from '@/store'
import { getInitChat, mlog, subModel} from '@/api'

const emit = defineEmits(['finished']);
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat() 
const chatStore = useChatStore()
const st=ref({uuid:'1002'});
const controller = ref<AbortController>( );;// new AbortController();
const dataSources = computed(() => chatStore.getChatByUuid(+st.value.uuid))

const textRz= ref<string[]>([]);
const goFinish= ()=>{
    //return ;
    updateChatSome( +st.value.uuid, dataSources.value.length - 1, { dateTime: new Date().toLocaleString(),loading: false })
    //scrollToBottom();
    emit('finished');
  
    homeStore.setMyData({act:'scrollToBottomIfAtBottom'});
    mlog('🐞 goFinish2',st.value.uuid);
    // setTimeout(() => {
        
    //    if(textRz.value.length>0 )  textRz.value = [];
    // }, 200 ); 
}

const getMessage= ()=>{
    let i=0;
    let rz = [];
    for( let ii=dataSources.value.length-3 ; ii>=0 ; ii-- ){ //let o of dataSources.value
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
    updateChatSome( +st.value.uuid, dataSources.value.length - 1, { dateTime: new Date().toLocaleString(),text: n.join('') })
    //scrollToBottom();
    homeStore.setMyData({act:'scrollToBottomIfAtBottom'})
    //homeStore.setMyData({act:'scrollToBottom'})
},{deep:true}) 

watch(()=>homeStore.myData.act, async (n)=>{
    if(n=='gpt.submit'){
        const dd:any = homeStore.myData.actData;
        mlog('gpt.submit', dd) ;
        const uuid = dd.uuid;
        st.value.uuid = uuid;
        
        let promptMsg = getInitChat(dd.prompt );
         addChat(  +uuid, promptMsg );
        homeStore.setMyData({act:'scrollToBottom'})

       
        let outMsg: Chat.Chat={
            dateTime: new Date().toLocaleString(),
            text:  '思考中...',
            loading: true,
            inversion: false,
            error: false,
            conversationOptions: null,
            requestOptions: { prompt: dd.prompt, options: {  } },
            uuid:+uuid,
            model:gptConfigStore.myData.model,
            myid: `${Date.now()}` 
        }
        addChat(  +uuid, outMsg  )

        if(textRz.value.length>=0) textRz.value = [ ];

        homeStore.setMyData({act:'scrollToBottom'})
        let historyMesg=  getMessage();
        let message= [
                {
                    "role": "system",
                    "content": gptConfigStore.myData.systemMessage? gptConfigStore.myData.systemMessage:'You are ChatGPT, a large language model trained by OpenAI. Follow the user\'s instructions carefully. Respond using markdown.'
                },
                ...historyMesg,
                {
                    "role": "user",
                    "content": dd.prompt
                }
            ];

        controller.value = new AbortController();
        //controller.signal
        subModel( {message
        ,onMessage:(d)=>{
            mlog('🐞消息',d);
            textRz.value.push(d.text);
        }
        ,onError:(e:any)=>{
            mlog('onError',e)
            const emsg = (e.reason??JSON.stringify(e,null,2));
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
    }
    
})
</script>
<template>
 
</template>