 <script setup lang="ts">
 import { onBeforeUnmount, onMounted, reactive } from 'vue';
 import { NButton } from 'naive-ui';
 import VoInput from './voInput.vue';
 import VoList from './voList.vue';
 import RunwayList from './runwayList.vue';
 import PikaList from './pikaList.vue';
 import KlingList from '../kling/kgList.vue';
 import RunmlList from './runmlList.vue';
 import PixList from './pixList.vue';
 import VideoList from '../video/list.vue';
 import { gptServerStore } from '@/store';
 import { SvgIcon } from '@/components/common';
 
 const PANEL_KEY = 'video_panel_width';
 const panel = reactive({
   width: 300,
   collapsed: false,
 });
 const minW = 240;
 const maxW = 640;
 let startX = 0;
 let startW = 0;
 const clamp = (v: number) => Math.min(maxW, Math.max(minW, v));
 
 const startDrag = (e: MouseEvent) => {
   if (panel.collapsed) panel.collapsed = false;
   startX = e.clientX;
   startW = panel.width;
   window.addEventListener('mousemove', onMove);
   window.addEventListener('mouseup', stopDrag);
   e.preventDefault();
 };
 
 const onMove = (e: MouseEvent) => {
   const w = clamp(startW + (e.clientX - startX));
   panel.width = w;
   localStorage.setItem(PANEL_KEY, `${w}`);
 };
 
 const stopDrag = () => {
   window.removeEventListener('mousemove', onMove);
   window.removeEventListener('mouseup', stopDrag);
 };
 
 const toggleCollapsed = () => {
   panel.collapsed = !panel.collapsed;
 };
 
 onMounted(() => {
   const saved = Number(localStorage.getItem(PANEL_KEY));
   if (!Number.isNaN(saved) && saved > 0) panel.width = clamp(saved);
 });
 
 onBeforeUnmount(() => {
   stopDrag();
 });
 </script>
<template>

<div class="flex w-full h-full">
    <div
      class="relative h-full overflow-auto border-r border-gray-200 dark:border-neutral-800 bg-white/60 dark:bg-[#1d1f23]"
      :style="{
        width: panel.collapsed ? '0px' : panel.width + 'px',
        minWidth: panel.collapsed ? '0px' : minW + 'px',
        maxWidth: panel.collapsed ? '0px' : maxW + 'px',
      }"
    >
      <div class="absolute bottom-2 right-2 z-10 flex space-x-1">
        <n-button quaternary size="small" circle @click="toggleCollapsed">
          <SvgIcon :icon="panel.collapsed ? 'ri:arrow-right-s-line' : 'ri:arrow-left-s-line'" />
        </n-button>
      </div>
      <div v-show="!panel.collapsed" class="h-full overflow-y-auto">
        <VoInput/>
      </div>
      <div
        v-show="!panel.collapsed"
        class="absolute top-0 right-0 h-full w-2 cursor-col-resize hover:bg-gray-300/40 dark:hover:bg-gray-600/40"
        @mousedown="startDrag"
      ></div>
    </div>
    <div class="flex-1 h-full bg-[#fafbfc] pt-2 dark:bg-[#18181c] overflow-y-auto" >

        <RunwayList v-if="gptServerStore.myData.TAB_VIDEO=='runway'"/>
        <KlingList v-else-if="gptServerStore.myData.TAB_VIDEO=='kling'"/>
        <PikaList v-else-if="gptServerStore.myData.TAB_VIDEO=='pika'"/>
        <RunmlList v-else-if="gptServerStore.myData.TAB_VIDEO=='runwayml'"/>
        <PixList v-else-if="gptServerStore.myData.TAB_VIDEO=='pixverse'"/>
        <VideoList v-else-if="gptServerStore.myData.TAB_VIDEO=='seedance'"/>
        <VideoList v-else-if="gptServerStore.myData.TAB_VIDEO=='all'"/>
        <VoList v-else/>
    </div>
     
</div>
</template> 
