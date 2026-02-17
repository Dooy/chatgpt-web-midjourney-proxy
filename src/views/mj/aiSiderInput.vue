<script setup lang="ts">
//import {  NLayoutSider } from 'naive-ui'; 
import aiDrawInput from './aiDrawInput.vue';
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { NDrawerContent,NDrawer, NButton} from "naive-ui";
import { computed,ref, reactive, onMounted, onBeforeUnmount  } from "vue";
import { SvgIcon } from '@/components/common';
import { homeStore } from '@/store';
 
const { isMobile } = useBasicLayout()

const pp =defineProps<{buttonDisabled:boolean}>()
const st= ref({show:false})
const panel = reactive({
  width: 320,
  collapsed: false,
});
const minW = 260;
const maxW = 720;
let startX = 0;
let startW = 0;
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
const clamp = (v:number)=> Math.min(maxW, Math.max(minW, v));
const startDrag = (e: MouseEvent)=>{
  if(panel.collapsed) panel.collapsed=false;
  startX= e.clientX;
  startW= panel.width;
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', stopDrag);
  e.preventDefault();
}
const onMove=(e:MouseEvent)=>{
  const w= clamp(startW + (e.clientX-startX));
  panel.width= w;
  localStorage.setItem('draw_panel_width', `${w}`);
}
const stopDrag=()=>{
  window.removeEventListener('mousemove', onMove);
  window.removeEventListener('mouseup', stopDrag);
}
const toggleCollapsed=()=>{ panel.collapsed=!panel.collapsed; }
onMounted(()=>{
  const saved= Number(localStorage.getItem('draw_panel_width'));
  if(!Number.isNaN(saved)&& saved>0){
    panel.width= clamp(saved);
  }
})
onBeforeUnmount(()=> stopDrag());
 
</script>
<template>
<div v-if="isMobile" > 
    <n-drawer v-model:show="st.show" :height="565"  placement="bottom">
    <n-drawer-content   style="--n-body-padding:0" class="h-full">
      <aiDrawInput @draw-sent="drawSent" :button-disabled="isLoading"/>
    </n-drawer-content>
  </n-drawer>
</div>
<section
  class="h-full overflow-auto border-r border-gray-200 dark:border-neutral-800 bg-white/60 dark:bg-[#1d1f23] relative"
  :style="{
    width: panel.collapsed ? '0px' : panel.width + 'px',
    minWidth: panel.collapsed ? '0px' : minW + 'px',
    maxWidth: panel.collapsed ? '0px' : maxW + 'px',
  }"
  @update-collapsed="handleUpdateCollapsed"
  v-else
>
   <div class="absolute bottom-2 right-2 z-10 flex space-x-1">
      <n-button quaternary size="small" circle @click="toggleCollapsed">
        <SvgIcon :icon="panel.collapsed ? 'ri:arrow-right-s-line' : 'ri:arrow-left-s-line'" />
      </n-button>
    </div>
   <div class="h-full w-full" v-show="!panel.collapsed"> <aiDrawInput @draw-sent="drawSent" :button-disabled="isLoading"/></div>
   <div
    v-show="!panel.collapsed"
    class="absolute top-0 right-0 h-full w-2 cursor-col-resize hover:bg-gray-300/40 dark:hover:bg-gray-600/40"
    @mousedown="startDrag"
  ></div>
  </section>

  
</template>
