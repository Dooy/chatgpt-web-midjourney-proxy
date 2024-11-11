<script setup lang="ts">
import { ref } from 'vue';
import McInput from './mcInput.vue';
import mcList from './mcList.vue';
import mcplayer from './mcplayer.vue';
import { NTabs,NTabPane} from "naive-ui"

import udioInput from './udioInput.vue';
import udioList from './udioList.vue';
import { gptServerStore } from '@/store';

const st= ref({menu:'suno'});

const handleUpdateValue=(v:string)=>{
   //mlog("handleUpdateValue",v)
   gptServerStore.setMyData({TAB_MUSIC:v})
}
</script>

<template>

<div class="flex w-full h-full   ">
    <div class="w-[300px] h-full  overflow-y-auto ">
        <n-tabs type="line" animated     :default-value="gptServerStore.myData.TAB_MUSIC??'suno'"  @update:value="handleUpdateValue"   >
         <n-tab-pane name="start" tab=""> 
            <McInput /> 
         </n-tab-pane>

         <n-tab-pane name="suno" tab="Suno"> 
            <McInput /> 
         </n-tab-pane>
          <n-tab-pane name="udio" tab="Udio"> 
            <udioInput/>
         </n-tab-pane>
           
        </n-tabs>
    </div>
    <div class=" flex-1  h-full bg-[#fafbfc] pt-2 dark:bg-[#18181c] overflow-y-auto " >
        <udioList  v-if="gptServerStore.myData.TAB_MUSIC=='udio'"/>
        <mcList  v-else />
       
    </div>
    <div class="w-[300px]  h-full overflow-y-auto ">
        <mcplayer/>
    </div>
</div>
</template>