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
    
    <div v-if="!isDisableMenu('music')" class="flex items-center justify-center flex-col" @click="st.active='music'; router.push('/music')">
      <n-tooltip placement="top">
        <template #trigger>
          <div class="flex flex-col items-center">
            <SvgIcon icon="arcticons:wynk-music" class="text-3xl"></SvgIcon>
            <span class="text-[13px]">{{ $t('suno.menu') }}</span>
          </div>
        </template>
        {{ $t('suno.menuinfo') }}
      </n-tooltip>
    </div>

    <div v-if="!isDisableMenu('video')" class="flex items-center justify-center flex-col" @click="st.active='video'; router.push('/video')">
      <n-tooltip placement="top">
        <template #trigger>
          <div class="flex flex-col items-center">
            <SvgIcon icon="ri:video-on-line" class="text-3xl"></SvgIcon>
            <span class="text-[13px]">{{ $t('video.menu') }}</span>
          </div>
        </template>
        {{ $t('video.menuinfo') }}
      </n-tooltip>
    </div>

    <div v-if="!isDisableMenu('dance')" class="flex items-center justify-center flex-col" @click="st.active='dance'; router.push('/dance')">
      <n-tooltip placement="top">
        <template #trigger>
          <div class="flex flex-col items-center">
            <SvgIcon icon="mdi:dance-ballroom" class="text-3xl"></SvgIcon>
            <span class="text-[13px]">{{ $t('dance.menu') }}</span>
          </div>
        </template>
        {{ $t('dance.menuinfo') }}
      </n-tooltip>
    </div>

    <div v-if="!isDisableMenu('gallery')" class="flex items-center justify-center flex-col" @click="homeStore.setMyData({ act: 'gallery' })">
      <SvgIcon icon="material-symbols:imagesmode-outline" class="text-3xl"></SvgIcon>
      <div class="text-[13px]">{{ $t('mjtab.gallery') }}</div>
    </div>
  </div>

  <n-drawer v-model:show="st.show" class="!h-[90vh] !max-h-[660px]" placement="bottom" v-if="goHome == 'draw'">
    <n-drawer-content style="--n-body-padding:0" class="h-full">
      <aiDrawInput @draw-sent="drawSent" @close="st.show = false" />
    </n-drawer-content>
  </n-drawer>
</template>
