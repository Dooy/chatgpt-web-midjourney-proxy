<script lang="ts" setup>
import { computed, nextTick,ref,watch  } from 'vue'
import { HoverButton, SvgIcon } from '@/components/common'
import {  gptConfigStore, homeStore, useAppStore, useChatStore } from '@/store'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import {NModal} from "naive-ui"
import aiModel from "@/views/mj/aiModel.vue"
import { chatSetting, mlog } from '@/api'
import { debounce } from '@/utils/functions/debounce'

const { isMobile } = useBasicLayout()

interface Props {
  usingContext: boolean
}

interface Emit {
  (ev: 'export'): void
  (ev: 'handleClear'): void
}

defineProps<Props>()

const emit = defineEmits<Emit>()

const appStore = useAppStore()
const chatStore = useChatStore()

const collapsed = computed(() => appStore.siderCollapsed)
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive)

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}

function onScrollToTop() {
  const scrollRef = document.querySelector('#scrollRef')
  if (scrollRef)
    nextTick(() => scrollRef.scrollTop = 0)
}

function handleExport() {
  emit('export')
}

function handleClear() {
  emit('handleClear')
}
const uuid = chatStore.active;
const chatSet = new chatSetting( uuid==null?1002:uuid);
const nGptStore = ref()  ;
nGptStore.value=  chatSet.getGptConfig() ;
const st = ref({isShow:false});
//导致卡死的原因 当删除时触发 切换 uuid 这个地方会删除的uuid 跟新uuid 一直却换
watch(()=>gptConfigStore.myData,debounce( ()=>{
  mlog("toMyuid19","watch gptConfigStore.myData ",  chatStore.active  )
  nGptStore.value=  chatSet.getGptConfig() 
},600 ), {deep:true})
watch(()=>homeStore.myData.act,debounce( (n)=> n=='saveChat' && (nGptStore.value=  chatSet.getGptConfig() ),600), {deep:true})
</script>

<template>
  <header
    class="sticky top-0 left-0 right-0 z-30 border-b dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur"
  >
    <div class="relative flex items-center justify-between min-w-0 overflow-hidden h-14" data-tauri-drag-region>
      <div class="flex items-center">
        <button
          class="flex items-center justify-center w-11 h-11"
          @click="handleUpdateCollapsed" v-if="isMobile"
        >
          <SvgIcon v-if="collapsed" class="text-2xl" icon="ri:align-justify" />
          <SvgIcon v-else class="text-2xl" icon="ri:align-right" />
        </button>
      </div>
      <h1  class="flex-1 px-4 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap"
        @dblclick="onScrollToTop" data-tauri-drag-region>
        {{ currentChatHistory?.title ?? '' }}
      </h1>
      <div class="flex items-center space-x-2">
        <HoverButton @click="handleExport">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:download-2-line" />
          </span>
        </HoverButton>
        <HoverButton @click="handleClear">
          <span class="text-xl text-[#4f555e] dark:text-white">
            <SvgIcon icon="ri:delete-bin-line" />
          </span>
        </HoverButton>
      </div>
    </div>
    
    <div @click="st.isShow=true" class="absolute left-1/2   top-full -translate-x-1/2 cursor-pointer select-none rounded-b-md border  bg-white px-2 dark:border-neutral-800 dark:bg-[#111114]">
        <div class="flex items-center   justify-center space-x-1 cursor-pointer hover:text-[#4b9e5f]" v-if="homeStore.myData.local!='draw'">
            <template   v-if="nGptStore.gpts">
             <SvgIcon icon="ri:apps-fill" /> 
             <span class="line-clamp-1 overflow-hidden">{{ nGptStore.gpts.name }}</span> 
            </template>
            <template v-else >
            <SvgIcon icon="heroicons:sparkles" /> 
            <span >{{ nGptStore.model }}</span> 
            </template>
            <SvgIcon icon="icon-park-outline:right" />
        </div>
    </div>
  </header>

  <NModal v-model:show="st.isShow"   preset="card"  :title="$t('mjchat.modelChange')" class="!max-w-[620px]" @close="st.isShow=false" >  
        <aiModel @close="st.isShow=false"/>
  </NModal>
</template>
