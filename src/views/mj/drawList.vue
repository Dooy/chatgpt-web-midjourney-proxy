<script setup lang='ts'> 
import { computed, onMounted, onUnmounted, ref,watch } from 'vue'
import { useRoute } from 'vue-router' 
import {   useDialog, useMessage } from 'naive-ui'
 
import { useScroll } from '../chat/hooks/useScroll'
import { useChat } from '../chat/hooks/useChat'
import { useUsingContext } from '../chat/hooks/useUsingContext' 
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { homeStore, useChatStore, usePromptStore } from '@/store'
import {   mlog,mjFetch,subTask,localSaveAny, url2base64 } from '@/api'
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

async function onConversation() {
  let message = prompt.value

  if (loading.value)
    return
  if( !message.drawText && dataSources.value.length==0){
      message.drawText='AI绘图';
  }
//   if (!message || message.trim() === '')
//     return

  controller = new AbortController()
  if( message.drawText){
    let promptMsg: Chat.Chat= {
        dateTime: new Date().toLocaleString(),
        text: message.drawText ,
        inversion: true,
        error: false,
        conversationOptions: null,
        requestOptions: { prompt: message.drawText , options: null },
        }
    
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
//   else if( message.action && message.action =='img2txt'){ //img2txt
//     let promptMsg: Chat.Chat= { 
//         dateTime: new Date().toLocaleString(),
//         text:'图生文' ,
//         inversion: true,
//         error: false,
//         conversationOptions: null,
//         requestOptions: { prompt: '图生文' , options: null },
//         opt:{  images:[message.data.base64] }
//     }
//     addChat(  +uuid, promptMsg )
//   }

  scrollToBottom()

  loading.value = true
  //prompt.value = ''

  let options: Chat.ConversationRequest = {}
  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions

  if (lastContext && usingContext.value)
    options = { ...lastContext }
  let outMsg: Chat.Chat={
      dateTime: new Date().toLocaleString(),
      text: '提交中',
      loading: true,
      inversion: false,
      error: false,
      conversationOptions: null,
      requestOptions: { prompt: '提交中', options: { ...options } },
      uuid:+uuid,
     
    }
  addChat(  +uuid, outMsg  )
  outMsg.index=  dataSources.value.length - 1;
  scrollToBottom()

  try { 
     await subTask(message, outMsg );
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
        //mlog('updateChat', dchat );
        if(  dchat.uuid && dchat.index ) {
            dchat.dateTime= new Date().toLocaleString();
            updateChat( +dchat.uuid, +dchat.index, dchat );
            mlog('updateChat', dchat.opt?.progress, dchat.opt?.imageUrl );
            if( dchat.opt?.progress&& dchat.opt?.progress=='100%' && dchat.opt?.imageUrl ){
                url2base64(dchat.opt?.imageUrl ,'img:'+dchat.mjID ).then(()=>{}).catch((e)=>mlog('url2base64 error',e));
            }
        }
    }
    
});
</script>

<template>
</template>
