<script setup lang="ts">
import { NTabs,NTabPane } from 'naive-ui';
import aiDrawInputItem from './aiDrawInputItem.vue'
import aiFace from './aiFace.vue'
import aiBlend from './aiBlend.vue'
import aiDall from './aiDall.vue'

const $emit=defineEmits(['drawSent','close']);
const drawSent=(d:any )=> $emit('drawSent',d);
</script>
<template>
<div class="overflow-y-auto bg-[#fafbfc] pt-2 dark:bg-[#18181c] h-full ">
 
<n-tabs type="line" animated default-value="draw">
    <n-tab-pane name="start" tab=""> 

    </n-tab-pane>
     <n-tab-pane name="draw" tab="绘图" >
        <aiDrawInputItem @draw-sent="drawSent" @close="$emit('close')"></aiDrawInputItem>

    </n-tab-pane>
    <n-tab-pane name="face" tab="换脸">
    <div class="p-4"><aiFace  /></div>
     
    </n-tab-pane>
    <n-tab-pane name="blend" tab="混图">
     <div class="p-4"><aiBlend  /></div>
    </n-tab-pane>
    <n-tab-pane name="dall3" tab="Dall.E">
     <div class="p-4"><aiDall  /></div>
    </n-tab-pane>
</n-tabs> 
</div>
</template>