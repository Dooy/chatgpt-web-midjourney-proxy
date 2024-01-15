<script setup lang="ts">
import { localGet, mlog } from '@/api';
import { SvgIcon } from '@/components/common'; 
import {   ref ,onUnmounted } from 'vue'
const st= ref({isLoad:0, bolb:'',fileName:'',duration:0});
const props = defineProps<{ chat:Chat.Chat,isW?:boolean}>();
const player = new window.Audio(); 
const mybolb = ref<Blob>();
const load= async ()=>{
    if( !props.chat.opt?.lkey ) return ;
    let dd:any = await localGet( props.chat.opt?.lkey ) ;
    let blob= dd.blob as Blob;
    mlog('dd', dd.filename);
    st.value.fileName = dd.filename;
    //st.value.bolb= blob;
    mybolb.value =blob;
    player.src = URL.createObjectURL(blob);
    player.addEventListener('ended', () => {
        st.value.isLoad=0;
    });
    player.addEventListener('play', () => {
        st.value.isLoad=1;
    }) 
    player.addEventListener('pause', function() {
         st.value.isLoad=2;
    });
    player.addEventListener('timeupdate', function(e) {
        // 音频播放位置变化时的操作
        //mlog('timeupdate'  ,player.currentTime ,player.duration );
    });
     player.addEventListener('loadedmetadata', function() {
         st.value.duration= player.duration ;
    });
    player.load();
}
const go= ()=>{
    if(st.value.isLoad==1 ) player.pause();
    else player.play();
}
// const getWidth= ()=>{
//     let w=0.3;
//     if(props.chat.opt?.duration){
//         if(props.chat.opt?.duration>60) w=1;
//         else w=props.chat.opt?.duration/45;
//         w=0.3+w;
//         if(w>1) w=1;
//     }
//     return (w*280)+'px';
// }
const download = ()=>{
    if(!mybolb.value || !props.chat.opt?.lkey ) return ;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(mybolb.value);
    a.download ='ddaiai_'+ st.value.fileName ;//props.chat.model+'_' + (props.chat.opt?.lkey?.replace(/\:/ig,'-')) +'.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
onUnmounted(()=>player.pause())  
load();

</script>
<template>
<div   class="whitespace-pre-wrap " :class="[props.isW?'border-t border-neutral-400/25':'']"  >
    <div class=" flex justify-between items-center w-full" >
        <div  class="text-blue-500 cursor-pointer mr-8" @click="download"> <SvgIcon icon="ri:download-2-fill"></SvgIcon> </div>

        <div class="flex justify-end items-center flex-1" @click="go">
            <span v-html="chat.opt?.duration.toFixed(2)+`s`"  v-if="chat.opt && chat.opt?.duration " ></span>
            <span v-html="st.fileName" v-else ></span>
            <div class=" rotate-90  cursor-pointer"   >
                <SvgIcon icon="svg-spinners:wifi" v-if="st.isLoad==1" ></SvgIcon>
                <SvgIcon icon="mdi:wifi"  v-else></SvgIcon>
            </div>
        </div>
    </div>
</div>
</template> 