<script setup lang="ts">
import { localGet, mlog } from '@/api';
import { SvgIcon } from '@/components/common';
import { homeStore } from '@/store';
import {   ref ,onUnmounted ,watch} from 'vue'
interface Props {   chat:Chat.Chat,isW?:boolean }
const st= ref({isLoad:0, bolb:''});
const props = defineProps<Props>();
const player = new window.Audio(); 
const mybolb = ref<Blob>();

const load= async ()=>{
    if( !props.chat.opt?.lkey ) return ;
    let blob = await localGet( props.chat.opt?.lkey ) as Blob;
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
        mlog('timeupdate'  ,player.currentTime ,player.duration );
    });
    player.load();
}
const go= ()=>{
    if(st.value.isLoad==1 ) player.pause();
    else player.play();
}
const getWidth= ()=>{
    if(props.isW) return '100%';
    let w=0.3;
    if(props.chat.opt?.duration){
        if(props.chat.opt?.duration>60) w=1;
        else w=props.chat.opt?.duration/45;
        w=0.3+w;
        if(w>1) w=1;
    }
    return (w*280)+'px';
}
const download = ()=>{
    if(!mybolb.value || !props.chat.opt?.lkey ) return ;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(mybolb.value);
    a.download =props.chat.model+'_' + (props.chat.opt?.lkey?.replace(/\:/ig,'-')) +'.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
watch(()=>homeStore.myData.act, (n=>{
    const data:any = homeStore.myData.actData ;
    mlog('act',n,data); 
    if(n=='playtts' && props.chat.opt?.lkey==data.saveID  ){
        player.play();
    }
}));
onUnmounted(()=>player.pause())  
load();
</script>
<template>
<div  class="markdown-body"  :class="[props.isW?'border-t border-neutral-400/25 ':'']" style="padding-top: 5px; margin-top: 5px;" >
    <div class=" flex justify-between items-center " :style="{width:getWidth()}">
        <div class="flex justify-start items-center flex-1" @click="go">
            <span v-html="chat.opt?.duration?.toFixed(2)"  ></span>s 
            <div class=" rotate-90  cursor-pointer"   >
                <SvgIcon icon="svg-spinners:wifi" v-if="st.isLoad==1" ></SvgIcon>
                <SvgIcon icon="mdi:wifi"  v-else></SvgIcon>
            </div>
        </div>
        <div  class="text-blue-500 cursor-pointer" @click="download"> <SvgIcon icon="ri:download-2-fill"></SvgIcon> </div>
    </div>
</div>
</template>