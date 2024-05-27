<script setup lang="ts">
import { NTabs,NTabPane } from 'naive-ui';
import aiDrawInputItem from './aiDrawInputItem.vue'
import aiFace from './aiFace.vue'
import aiBlend from './aiBlend.vue'
import aiDall from './aiDall.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { SvgIcon } from '@/components/common'
const $emit=defineEmits(['drawSent','close']);
const drawSent=(d:any )=> $emit('drawSent',d);
const {isMobile}= useBasicLayout()
</script>
<template>
<div class="overflow-y-auto bg-[#fafbfc] pt-2 dark:bg-[#18181c] h-full ">
 
<n-tabs type="line" animated default-value="draw">
    <n-tab-pane name="start" tab=""> 

    </n-tab-pane>
     <n-tab-pane name="draw" :tab="$t('mjchat.draw')" >
        <aiDrawInputItem @draw-sent="drawSent" @close="$emit('close')"></aiDrawInputItem>

    </n-tab-pane>
    <n-tab-pane name="face" :tab="$t('mjchat.face')">
    <div class="p-4"><aiFace  /></div>
     
    </n-tab-pane>
    <n-tab-pane name="blend" :tab="$t('mjchat.blend')">
     <div class="p-4"><aiBlend  /></div>
    </n-tab-pane>
    <n-tab-pane name="dall3" tab="Dall.E">
     <div class="p-4"><aiDall  /></div>
    </n-tab-pane>

    <n-tab-pane name="Close" v-if="isMobile" >
      <template #tab>
      <div class=" text-center flex justify-center items-center"   @click="$emit('close')"  ><SvgIcon icon="ri:close-circle-line"></SvgIcon></div>
      </template>
      <div class="p-4"> 
        <div   @click="$emit('close')" class=" justify-center items-center flex">
            <SvgIcon icon="ri:close-circle-line"></SvgIcon> Close By Click me 
        </div>
      </div>
    </n-tab-pane>

</n-tabs> 
</div>
</template>