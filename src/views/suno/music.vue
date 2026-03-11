<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import McInput from './mcInput.vue';
import mcList from './mcList.vue';
import mcplayer from './mcplayer.vue';
import { NTabs, NTabPane, NButton } from "naive-ui"
import { SvgIcon } from '@/components/common';

import RiffInput from './riffInput.vue';
import RiffList from './riffList.vue';
import udioInput from './udioInput.vue';
import udioList from './udioList.vue';
import { gptServerStore } from '@/store';
import { useRoute } from 'vue-router';

const route = useRoute(); // 获取当前路由对象
const st= ref({menu:'suno',tab:''});

// 左侧面板宽度控制
const PANEL_KEY = 'music_panel_width';
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

const handleUpdateValue=(v:string)=>{
   //mlog("handleUpdateValue",v)
   gptServerStore.setMyData({TAB_MUSIC:v})
}

const initLoad=()=>{
    if(route.query.tab){
        st.value.tab= 'suno'
        let tt= (route.query.tab as string).toLocaleLowerCase();
        if( ['suno','udio','riff'].indexOf(tt)>-1 ){
           st.value.tab=tt;
        }

        handleUpdateValue(  st.value.tab )
    }
    else st.value.tab=( gptServerStore.myData.TAB_MUSIC?gptServerStore.myData.TAB_MUSIC:'suno')
}
initLoad();

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
      class="relative h-full border-r border-gray-200 dark:border-neutral-800 bg-white/60 dark:bg-[#1d1f23]"
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
        <n-tabs type="line" animated :default-value="gptServerStore.myData.TAB_MUSIC??'suno'" @update:value="handleUpdateValue">
         <n-tab-pane name="start" tab="">
            <McInput />
         </n-tab-pane>

         <n-tab-pane name="suno" tab="Suno">
            <McInput />
         </n-tab-pane>
         <n-tab-pane name="riff" tab="Riffusion">
            <RiffInput/>
         </n-tab-pane>
         <n-tab-pane name="udio" tab="Udio">
            <udioInput/>
         </n-tab-pane>

        </n-tabs>
      </div>
      <div
        v-show="!panel.collapsed"
        class="absolute top-0 right-0 h-full w-2 cursor-col-resize hover:bg-gray-300/40 dark:hover:bg-gray-600/40"
        @mousedown="startDrag"
      ></div>
    </div>
    <div class="flex-1 h-full bg-[#fafbfc] pt-2 dark:bg-[#18181c] overflow-y-auto">
        <udioList v-if="gptServerStore.myData.TAB_MUSIC=='udio'"/>
        <RiffList v-else-if="gptServerStore.myData.TAB_MUSIC=='riff'" />
        <mcList v-else />
    </div>
    <div class="w-[300px] h-full overflow-y-auto">
        <mcplayer/>
    </div>
</div>
</template>