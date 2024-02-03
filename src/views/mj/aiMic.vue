<script setup lang="ts">
import { mlog } from '@/api';
import { SvgIcon } from '@/components/common';
import Recorder from 'js-audio-recorder';
import  { NButton,useMessage,NButtonGroup } from "naive-ui"
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { ref,watch,onUnmounted } from 'vue'
import { t } from '@/locales';

const emit = defineEmits(['process' ,'send','cancel']);
let recorder = new Recorder();
interface statType{
    duration: number
    fileSize: number
    vol: number
}
const stat = ref<statType>({duration:0,fileSize:0,vol:0});
const st =ref({start:0,isGo:false});

const ms = useMessage();
const { isMobile } = useBasicLayout()

recorder.onprogress =  (params) => {
    stat.value = {duration: params.duration , fileSize: params.fileSize, vol: params.vol }
    //emit('process', stat.value);
}
const start = ()=>{
    recorder.start().then(()=>{
        st.value.start=1;
        st.value.isGo=true;
        ms.info( t('mj.micIng') );
    }).catch(e=>{
        mlog('录音错误', e );
        ms.error( t('mj.fail')+':'+e );
        emit('cancel');
    });
}
const pause=()=>{
    recorder.pause() 
    st.value.start=2;

}
const pauseGoon=()=>{
    recorder.resume();
    st.value.start=1;
    recorder.stopPlay();
}
const send=()=>{
    stop();
    emit('send',{blob: recorder.getWAVBlob() , stat:stat.value });
    stat.value= {duration:0,fileSize:0,vol:0} ;
}
const play=()=>{
    //if(st.value.start==1) pause();
    recorder.play();
    stop();
}
const stopAdnRecord= ()=>{
    stop();
    start();
    st.value.start=1;
}
const stop=()=>{
    st.value.start=0;
    recorder.stop();
    recorder.stopPlay();
}
const cancal=()=>{
    stop();
    emit('cancel');
}
onUnmounted(() => {
    recorder.stop();
    recorder.destroy();
}),
watch(()=> stat.value , (n)=> emit('process', stat.value) ,{deep:true} );

start();
</script>
<template> 
<template v-if="!st.isGo">
    <NButton @click="start()" type="primary" block round> 
        <template #icon><SvgIcon icon="bi:mic"/></template>{{ $t('mj.mStart') }}
    </NButton>
</template>
<n-button-group v-else>
    <NButton @click="start()" type="primary" v-if="st.start==0" > 
        <template #icon><SvgIcon icon="bi:mic"/></template>{{ $t('mj.mStart') }}
    </NButton>
    <NButton type="primary" @click="pause()" v-if="st.start==1">
        <template #icon><SvgIcon icon="bi:pause-circle"/></template>{{ $t('mj.mPause') }}
    </NButton>
    <NButton type="primary" @click="pauseGoon()" v-if="st.start==2">
        <template #icon><SvgIcon icon="bi:mic"/></template>{{ $t('mj.mGoon') }}
    </NButton>
 
    <template v-if="stat.duration>0 ">
        <NButton type="info" @click="stopAdnRecord()"  v-if="!isMobile" >
        <template #icon><SvgIcon icon="bi:bootstrap-reboot"/></template>{{ $t('mj.mRecord') }}</NButton>

        <NButton @click="play()" type="info">
        <template #icon><SvgIcon icon="bi:play-circle"/></template>{{ $t('mj.mPlay') }}</NButton> 
        <NButton @click="cancal()" type="info">
        <template #icon><SvgIcon icon="ri:close-circle-line"/></template>{{ $t('mj.mCanel') }}</NButton> 

        <NButton type="primary" @click="send()">
        <template #icon><SvgIcon icon="ri:send-plane-fill"></SvgIcon></template>
        {{ $t('mj.mSent') }}
        <span class="w-[30px]" v-if="stat.duration>0 ">{{ stat?.duration.toFixed(1) }}s</span>
        </NButton> 
    </template>
</n-button-group> 
</template>