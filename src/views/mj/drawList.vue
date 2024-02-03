<script setup lang='ts'> 
import { computed, onMounted, onUnmounted, ref,watch } from 'vue'
import { useRoute } from 'vue-router' 
import {   useDialog, useMessage } from 'naive-ui'
 
import { useScroll } from '../chat/hooks/useScroll'
import { useChat } from '../chat/hooks/useChat'
import { useUsingContext } from '../chat/hooks/useUsingContext' 
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { homeStore, useChatStore, usePromptStore } from '@/store'
import {   mlog,subTask,localSaveAny, subGPT } from '@/api'
import { t } from '@/locales'

let controller = new AbortController()

//const openLongReply = import.meta.env.VITE_GLOB_OPEN_LONG_REPLY === 'true'

const route = useRoute()
const dialog = useDialog()
const ms = useMessage()

const chatStore = useChatStore()

const { isMobile } = useBasicLayout()
const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll()
const { usingContext, toggleUsingContext } = useUsingContext()

const { uuid } = route.params as { uuid: string } // || chatStore.$state.active || '1003'
//if(!uuid) uuid= chatStore.$state.active ;
mlog('uuid', uuid, chatStore.$state.active) ;
const dataSources = computed(() => chatStore.getChatByUuid(+uuid))
const conversationList = computed(() => dataSources.value.filter(item => (!item.inversion && !!item.conversationOptions)))

const prompt = ref<any>(null)
const loading = ref<boolean>(false)
 
// 未知原因刷新页面，loading 状态不会重置，手动重置
dataSources.value.forEach((item, index) => {
  if (item.loading)
    updateChatSome(+uuid, index, { loading: false })
})

function handleSubmit() {
  onConversation()
}
const getInitChat = (txt:string)=>{
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
async function onConversation() {
  let message = prompt.value

  if (loading.value)
    return
  if( !message.drawText && dataSources.value.length==0){
      message.drawText=  t('mjset.sysname');//'AI绘图';
  }
//   if (!message || message.trim() === '')
//     return

  controller = new AbortController()
  if( message.action && message.action=='face' ){
    let promptMsg: Chat.Chat= getInitChat( t('mjchat.face')); //'换脸'
    try{
          let images= await localSaveAny( JSON.stringify( [message.data.sourceBase64,message.data.targetBase64 ] )  ) ;
          mlog('key', images );
          promptMsg.opt= {images:[images]}
     }catch(e){
         mlog('localSaveAny error',e);
     }
     addChat(  +uuid, promptMsg );
     //return ;

  }else if( message.action && message.action=='blend' ){
     // promptMsg.opt={  images: message.fileBase64 }
     let promptMsg: Chat.Chat= getInitChat(t('mjchat.blend') );//'混图'
     try{
          let images= await localSaveAny( JSON.stringify( message.data.base64Array )  ) ;
          mlog('key', images );
          promptMsg.opt= {images:[images]}
     }catch(e){
         mlog('localSaveAny error',e);
     }
     addChat(  +uuid, promptMsg );

    
  }else if( message.action && ['gpt.dall-e-3','shorten'].indexOf(message.action) >-1   ){ //gpt.dall-e-3 //subTas
    let promptMsg: Chat.Chat= getInitChat( message.data.prompt ); 
     addChat(  +uuid, promptMsg );
  }else if( message.drawText){
    let promptMsg: Chat.Chat= getInitChat(message.drawText)
    
    if( message.fileBase64 && message.fileBase64.length>0 ){
       // promptMsg.opt={  images: message.fileBase64 }
       try{
            let images= await localSaveAny( JSON.stringify( message.fileBase64)  ) ;
            mlog('key', images );
            promptMsg.opt= {images:[images]}
       }catch(e){
           mlog('localSaveAny error',e);
       }
    }
    addChat(  +uuid, promptMsg ); 
  } 
  


  scrollToBottom()

  loading.value = true
  //prompt.value = ''

  let options: Chat.ConversationRequest = {}
  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions

  if (lastContext && usingContext.value)
    options = { ...lastContext }
  let outMsg: Chat.Chat={
      dateTime: new Date().toLocaleString(),
      text: message.action=='gpt.dall-e-3'? t('mjchat.wait3'): t('mjchat.submiting'),
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt:  t('mjchat.submiting'), options: { ...options } },
      uuid:+uuid,
      myid: `${Date.now()}`
      ,model:message.action=='gpt.dall-e-3'? message.data.model :'midjourney'
     
    }
  //mlog('outMsg model',outMsg.model );
  addChat(  +uuid, outMsg  )
  outMsg.index=  dataSources.value.length - 1;
  scrollToBottom()

  try { 
     if( message.action && message.action.indexOf('gpt.')==0 ){ 
        await subGPT(message, outMsg );
     }
     else await subTask(message, outMsg );
     return ;
  }
  catch (error: any) {
    const errorMessage = error?.message ?? t('common.wrong')

    if (error.message === 'canceled') {
      updateChatSome(
        +uuid,
        dataSources.value.length - 1,
        {
          loading: false,
        },
      )
      scrollToBottomIfAtBottom()
      return
    }

    const currentChat = getChatByUuidAndIndex(+uuid, dataSources.value.length - 1)

    if (currentChat?.text && currentChat.text !== '') {
      updateChatSome(
        +uuid,
        dataSources.value.length - 1,
        {
          text: `${currentChat.text}\n[${errorMessage}]`,
          error: false,
          loading: false,
        },
      )
      return
    }

    updateChat(
      +uuid,
      dataSources.value.length - 1,
      {
        dateTime: new Date().toLocaleString(),
        text: errorMessage,
        inversion: false,
        error: true,
        loading: false,
        conversationOptions: null,
        requestOptions: { prompt: "", options: { ...options } },
      },
    )
    scrollToBottomIfAtBottom()
  }
  finally {
    loading.value = false
  }
}
 
onUnmounted(() => {
  if (loading.value)
    controller.abort()
})

watch(()=>homeStore.myData.act,(n)=>{
    if(n=='draw') {
        prompt.value=homeStore.myData.actData;
        mlog('draw', homeStore.myData.actData.drawText );
        handleSubmit();
    }
    if(n=='updateChat'){
        let dchat= homeStore.myData.actData as Chat.Chat;
        mlog("动作更新",'updateChat' ,  dchat.uuid,dchat.index );
        if(  dchat.uuid && dchat.index ) {
            dchat.dateTime= new Date().toLocaleString();
            updateChat( +dchat.uuid, +dchat.index, dchat );
            mlog('updateChat 动作更新',dchat.model , dchat.opt?.progress, dchat.opt?.imageUrl  );
            if( dchat.opt?.progress&& dchat.opt?.progress=='100%' && dchat.opt?.imageUrl ){
               // url2base64(dchat.opt?.imageUrl ,'img:'+dchat.mjID ).then(()=>{}).catch((e)=>mlog('url2base64 error',e));
               //homeStore.setMyData{{act}}
               homeStore.setMyData({act:'mjReload', actData:{mjID:dchat.mjID,noShow:true} })
               toBottom();
            }else if(  (dchat.model=='dall-e-2' || dchat.model=='dall-e-3')   && dchat.opt?.imageUrl ){
                homeStore.setMyData({act:'dallReload', actData:{myid:dchat.myid,noShow:true} });
                toBottom();
            }

        }
    }
    
},{deep:true});

const toBottom= ()=>{
  setTimeout(() => {
    homeStore.setMyData({act:'scrollToBottom'});
  }, 1800);
}
</script>

<template>
</template>
