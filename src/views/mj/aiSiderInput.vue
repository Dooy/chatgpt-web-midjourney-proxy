<script setup lang="ts">
//import {  NLayoutSider } from 'naive-ui'; 
import aiDrawInput from './aiDrawInput.vue';
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { NDrawerContent,NDrawer} from "naive-ui";
import { computed,ref  } from "vue";
//import { SvgIcon } from '@/components/common';
import { homeStore } from '@/store';
 
//import { homeStore } from '@/store';
const { isMobile } = useBasicLayout()

const pp =defineProps<{buttonDisabled:boolean}>()
const st= ref({show:false})
const handleUpdateCollapsed = (value: boolean) => {
  console.log(value);
}
const $emit=defineEmits(['drawSent','close']);
const isLoading= computed(() => {
  return pp.buttonDisabled  
})
function drawSent(e:any){
  st.value.show=false;
  $emit('drawSent', e)
  homeStore.setMyData({act:'draw',actData:e});
}
// watch( ()=>homeStore.myData.act, (act) => {
//   act=='newtask' && (st.value.show=true);
//   act=='same2' && (st.value.show=true);
// });
 
</script>
<template>
<div v-if="isMobile" > 
    <!-- <div class="fixed right-[30px] bottom-[70px] z-10">
    <n-button  type="warning" circle size="large" @click="st.show=true">
      <template #icon>
        <SvgIcon icon="ic:round-add"></SvgIcon>
      </template>
    </n-button>
    </div> -->
    <n-drawer v-model:show="st.show" :height="565"  placement="bottom">
    <n-drawer-content   style="--n-body-padding:0" class="h-full">
      <aiDrawInput @draw-sent="drawSent" :button-disabled="isLoading"/>
    </n-drawer-content>
  </n-drawer>
</div>
<section class="h-full overflow-auto w-[300px]"  @update-collapsed="handleUpdateCollapsed" v-else>
   <!-- <div class="h-full w-full">
     <aiDrawInput class="p-4"/>
   </div> -->
   <div class="h-full w-full"> <aiDrawInput @draw-sent="drawSent" :button-disabled="isLoading"/></div>
  </section>

  
</template>