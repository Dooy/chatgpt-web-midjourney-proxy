<script setup lang="ts"> 
import { NTabs, NTabPane } from 'naive-ui';
import LumaInput from './lumaInput.vue'
import RunwayInput from './runwayInput.vue'
import KlingInput from '../kling/kgInput.vue'
import { mlog } from '@/api';
import { gptServerStore } from '@/store';


const handleUpdateValue=(v:string)=>{
   mlog("handleUpdateValue",v)
   gptServerStore.setMyData({TAB_VIDEO:v})
}
</script>

<template>
<n-tabs type="line"  animated :default-value="gptServerStore.myData.TAB_VIDEO"  @update:value="handleUpdateValue">
    <n-tab-pane name="" tab="">
    </n-tab-pane>
    <n-tab-pane name="luma" tab="Luma">
        <LumaInput />
    </n-tab-pane>
    <n-tab-pane name="runway" tab="Runway">
        <RunwayInput />
    </n-tab-pane>
    <n-tab-pane name="kling" tab="Kling">
        <KlingInput />
    </n-tab-pane>
</n-tabs>
</template>