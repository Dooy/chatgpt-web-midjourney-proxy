<script setup lang="ts"> 
import { NTabs, NTabPane } from 'naive-ui';
import LumaInput from './lumaInput.vue'
import RunwayInput from './runInput.vue'
import KlingInput from '../kling/kgInput.vue'
import PikaInput from './pikaInput.vue'
import { mlog } from '@/api';
import { gptServerStore } from '@/store';
import {  ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // 获取当前路由对象

const st= ref({tab:''});
const handleUpdateValue=(v:string)=>{
   mlog("handleUpdateValue",v)
   gptServerStore.setMyData({TAB_VIDEO:v})
}

const initLoad=()=>{
    if(route.query.tab){
        //st.value.tab=route.query.tab as string;
        st.value.tab= 'luma' 
        let tt= (route.query.tab as string).toLocaleLowerCase();
        if( ['luma','runway','pika','kling'].indexOf(tt)>-1 ){
           st.value.tab=tt;
        }
        handleUpdateValue(  st.value.tab )
    }
    else st.value.tab=( gptServerStore.myData.TAB_VIDEO?gptServerStore.myData.TAB_VIDEO:'Luma')
    if( st.value.tab=='runwayml') st.value.tab='runway'
}
initLoad();
</script>

<template>
<n-tabs type="line"  animated :default-value="st.tab"  @update:value="handleUpdateValue">
    <n-tab-pane name="" tab="">
    </n-tab-pane>
    <n-tab-pane name="luma" tab="Luma">
        <LumaInput />
    </n-tab-pane>
    <n-tab-pane name="runway" tab="Runway">
        <RunwayInput />
    </n-tab-pane>
    <n-tab-pane name="pika" tab="Pika">
        <PikaInput />
    </n-tab-pane>
    <n-tab-pane name="kling" :tab="$t('mj.kling')">
        <KlingInput />
    </n-tab-pane>
</n-tabs>
</template>