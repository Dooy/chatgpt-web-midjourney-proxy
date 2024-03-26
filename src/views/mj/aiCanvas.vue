<script setup lang="ts">
import { ref,onMounted,onUnmounted } from "vue";
//import { CavansDemo } from "@/views/aidutu";
const pp= defineProps<{chat?:Chat.Chat,base64:string}>() 
const st = ref({q:''}); 
const ifdiv =ref<HTMLIFrameElement>();
const emits = defineEmits(['success']);

onMounted( ()=>{ 
    // iframe.contentWindow && iframe.contentWindow.postMessage( JSON.stringify({act:'del',obj }), '*');
    const data = {
      instance_id: `1`,//固定值
      custom_id: `2`,//固定值
      channel_id: `3`,//固定值
      guild_id: `4`,//固定值
      frame_id: '5', //固定值
      platform: 'desktop', //固定值
      prompt: pp.chat?.text , // 按实际传入
      img_type: 'png'// 按实际传入
     // ,img_info:''
      ,img_info: JSON.stringify({"image_url":  '' ,"prompt":"sunglasses"})  // 按实际传入
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
   emits('success', obj );
}
const loadOk= (e:Event)=>{
   //console.log('loadOk','good news' );
    const iframe= e.target as HTMLIFrameElement;
    iframe.contentWindow && iframe.contentWindow.postMessage( JSON.stringify({act:'go',img_info: {"image_url":  pp.base64==''?pp.chat?.opt?.imageUrl : pp.base64 ,"prompt":'' }  }), '*');// pp.chat?.text
}
</script>
<template>
    <!-- <iframe @load="loadOk" ref="ifdiv" :src="`./mitf/index.html?${st.q}`"  class=" h-[80vh] w-full" style="border-width: 0px; border-style: none; overflow: hidden;" v-if="st.q"></iframe> -->
    <iframe @load="loadOk" ref="ifdiv" :src="`https://static.aitutu.cc/res/mitf/index.html?${st.q}`"  class=" h-[80vh] w-full" style="border-width: 0px; border-style: none; overflow: hidden;" v-if="st.q"></iframe>

</template>