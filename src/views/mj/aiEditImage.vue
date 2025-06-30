<script setup lang="ts">
import { ref,onMounted,onUnmounted } from "vue";
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { NImage,NButton,useMessage,NInput,NSelect } from 'naive-ui'
import { mlog } from "@/api";
import { homeStore } from "@/store";

const pp= defineProps<{chat?:Chat.Chat,img:string}>() 
const { isMobile } = useBasicLayout()
const f= ref({motion:'low',prompt:'','image':pp.img,"base64":pp.img,mode:'FAST'});
const st= ref({'isLoading':false,q:''});
const emits = defineEmits(['success']);
const ifdiv =ref<HTMLIFrameElement>();

onMounted( ()=>{ 
    // iframe.contentWindow && iframe.contentWindow.postMessage( JSON.stringify({act:'del',obj }), '*');
    const data = {
      instance_id: `1`,//固定值
      custom_id: `2`,//固定值
      channel_id: `3`,//固定值
      guild_id: `4`,//固定值
      frame_id: '5', //固定值
      platform: 'desktop', //固定值
      prompt: "" , // 按实际传入
      img_type: 'png'// 按实际传入
     // ,img_info:''
      ,img_info: JSON.stringify({"image_url":  '' ,"prompt":""})  // 按实际传入
      }
    st.value.q=  Object.keys(data).map(key =>key + '=' + encodeURIComponent(data[key])).join('&')
    window.addEventListener('message', messageFun )
})
onUnmounted(()=>{
   window.removeEventListener('message', messageFun )
})
//收到iframe的消息
const messageFun=(e:MessageEvent)=>{
   //console.log('我收到消息了', e.data );
   if( !e?.data) return ;
   const obj= JSON.parse( e.data ); 
   //console.log('success',  obj  );

    let obj2={
        action:'mj.edit.image',
        version:1, 
        data:{
            prompt:obj.prompt,
            maskBase64:obj.mask,
            image:pp.img,
        },
        
    }
    mlog('mj.edit.image', obj2 );
    homeStore.setMyData({act:'draw',actData:obj2});
   
    emits('success'  );

}

const loadOk= (e:Event)=>{
    //console.log('loadOk','good news' );
    const iframe= e.target as HTMLIFrameElement;
    iframe.contentWindow && iframe.contentWindow.postMessage( JSON.stringify({act:'go',img_info: {"image_url":pp.img ,"prompt":'' }  }), '*');// pp.chat?.text
}

</script>
<template> 
    
    <iframe @load="loadOk" ref="ifdiv" :src="`https://cdn.aidutu.cn/res/mitf/index.html?${st.q}`"  class=" h-[80vh] w-full" style="border-width: 0px; border-style: none; overflow: hidden;" v-if="st.q"></iframe>

</template> 