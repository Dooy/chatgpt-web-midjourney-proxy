<script setup lang="ts">
import { SvgIcon } from '@/components/common';
import { homeStore, useChatStore } from '@/store'
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router';
import aiDrawInput from './aiDrawInput.vue'; 
import { NDrawerContent, NDrawer, NTooltip } from "naive-ui";
import { isDisableMenu } from '@/api';

const router = useRouter();
const chatStore = useChatStore()
const st = ref({ show: true, active: 'chat' })

const goHome = computed(() => {
  return router.currentRoute.value.name
});

const chatId = computed(() => chatStore.active ?? '1002');

function drawSent(e: any) {
  st.value.show = false;
  homeStore.setMyData({ act: 'draw', actData: e });
}

watch(() => homeStore.myData.act, (n: string) => {
  if (n === 'showChat') {
    router.push('/chat')
  }
  if (n === 'showDraw') {
    router.push('/draw')
    st.value.show = true;
  }
  if (n === 'draw') {
    st.value.show = false;
  }
});

// 新增：控制下拉菜单的显示
const showDropdown = ref(false);

// 新增：处理下拉菜单项的点击
function handleDropdownClick(action: string) {
  showDropdown.value = false;
  switch(action) {
    case 'music':
      st.value.active = 'music';
      router.push('/music');
      break;
    case 'video':
      st.value.active = 'video';
      router.push('/video');
      break;
    case 'dance':
      st.value.active = 'dance';
      router.push('/dance');
      break;
    case 'gallery':
      homeStore.setMyData({ act: 'gallery' });
      break;
  }
}
</script>

<template>
  <div class="bg-gray-100 dark:bg-[#282832] h-[55px] flex justify-around items-center dark:text-white/70">
    <div class="flex items-center justify-center flex-col" @click="st.active='chat'; router.push(`/chat`)">
      <SvgIcon icon="ri:wechat-line" class="text-3xl"></SvgIcon>
      <div class="text-[13px]">{{ $t('mjtab.chat') }}</div>
    </div>
    
    <div v-if="!isDisableMenu('gpts')" class="flex items-center justify-center flex-col" @click="homeStore.setMyData({ act: 'showgpts' })">
      <SvgIcon icon="ri:apps-fill" class="text-3xl"></SvgIcon>
      <div class="text-[13px]">GPTs</div>
    </div>
    
    <a :href="`https://api.raojialong.space/topup`" class="flex items-center justify-center flex-col">
      <SvgIcon icon="whh:spiderman" class="text-3xl"></SvgIcon>
      <div class="text-[13px]">控制台</div>
    </a>
    
    <div v-if="!isDisableMenu('draws')" class="flex items-center justify-center flex-col" @click="st.active='draw'; router.push(`/draw`)">
      <SvgIcon icon="ic:outline-palette" class="text-3xl"></SvgIcon>
      <div class="text-[13px]">{{ $t('mjtab.draw') }}</div>
    </div>
    
    <!-- 新的下拉菜单 -->
    <div class="relative">
      <div class="flex items-center justify-center flex-col" @click="showDropdown = !showDropdown">
        <SvgIcon :icon="showDropdown ? 'mdi:menu-up' : 'mdi:menu-down'" class="text-3xl"></SvgIcon>
        <div class="text-[13px]">更多</div>
      </div>
      
      <!-- 下拉菜单内容 -->
      <div v-if="showDropdown" class="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-100 dark:bg-[#282832] rounded shadow-lg p-2 mb-2">
        <div v-if="!isDisableMenu('music')" @click="handleDropdownClick('music')" class="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-[#3e3e4a]">
          <SvgIcon icon="arcticons:wynk-music" class="text-3xl mr-2"></SvgIcon>
          <span>{{ $t('suno.menu') }}</span>
        </div>
        <div v-if="!isDisableMenu('video')" @click="handleDropdownClick('video')" class="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-[#3e3e4a]">
          <SvgIcon icon="ri:video-on-line" class="text-3xl mr-2"></SvgIcon>
          <span>{{ $t('video.menu') }}</span>
        </div>
        <div v-if="!isDisableMenu('dance')" @click="handleDropdownClick('dance')" class="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-[#3e3e4a]">
          <SvgIcon icon="mdi:dance-ballroom" class="text-3xl mr-2"></SvgIcon>
          <span>{{ $t('dance.menu') }}</span>
        </div>
        <div v-if="!isDisableMenu('gallery')" @click="handleDropdownClick('gallery')" class="flex items-center p-2 hover:bg-gray-200 dark:hover:bg-[#3e3e4a]">
          <SvgIcon icon="material-symbols:imagesmode-outline" class="text-3xl mr-2"></SvgIcon>
          <span>{{ $t('mjtab.gallery') }}</span>
        </div>
      </div>
    </div>
  </div>

  <n-drawer v-model:show="st.show" class="!h-[90vh] !max-h-[660px]" placement="bottom" v-if="goHome == 'draw'">
    <n-drawer-content style="--n-body-padding:0" class="h-full">
      <aiDrawInput @draw-sent="drawSent" @close="st.show = false" />
    </n-drawer-content>
  </n-drawer>
</template>
