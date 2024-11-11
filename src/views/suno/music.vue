<script setup lang="ts">
import { ref } from 'vue';
import McInput from './mcInput.vue';
import mcList from './mcList.vue';
import mcplayer from './mcplayer.vue';
import { NTabs,NTabPane} from "naive-ui"

import udioInput from './udioInput.vue';
import udioList from './udioList.vue';

const st= ref({menu:'udio'});
</script>

<template>

<div class="flex w-full h-full   ">
    <div class="w-[300px] h-full  overflow-y-auto ">
        <n-tabs type="line" animated default-value="draw" v-model:value="st.menu">
         <n-tab-pane name="start" tab=""> 

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
        <udioList  v-if="st.menu=='udio'"/>
        <mcList  v-else />
       
    </div>
    <div class="w-[300px]  h-full overflow-y-auto ">
        <mcplayer/>
    </div>
</div>
</template>