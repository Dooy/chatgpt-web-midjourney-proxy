 <script setup lang="ts">
 import VoInput from './voInput.vue';
 //import VoInput from './lumaInput.vue';
 import VoList from './voList.vue';
 import RunwayList from './runwayList.vue';
 import KlingList from '../kling/kgList.vue';
import { gptServerStore } from '@/store';
 </script>
<template>

<div class="flex w-full h-full   ">
    <div class="w-[300px] h-full  overflow-y-auto ">
         <VoInput/>
    </div>
    <div class=" flex-1  h-full bg-[#fafbfc] pt-2 dark:bg-[#18181c] overflow-y-auto " >

        <RunwayList v-if="gptServerStore.myData.TAB_VIDEO=='runway'"/>
        <KlingList v-else-if="gptServerStore.myData.TAB_VIDEO=='kling'"/>
        <VoList v-else/>
    </div>
     
</div>
</template> 