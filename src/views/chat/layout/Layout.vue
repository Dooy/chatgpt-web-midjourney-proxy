<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent,useMessage } from 'naive-ui'
import { useRouter ,useRoute } from 'vue-router'
import Sider from './sider/index.vue'
import Permission from './Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { gptConfigStore, homeStore, useAppStore, useAuthStore, useChatStore } from '@/store'
import { aiSider,aiGpts } from '@/views/mj' 

const router = useRouter()
const appStore = useAppStore()
const chatStore = useChatStore()
const authStore = useAuthStore()

const rt = useRoute();
if(rt.name =='GPTs'){
  const ms = useMessage();
  let model= `gpt-4-gizmo-${rt.params.gid.toString()}`  ;
  gptConfigStore.setMyData({model:model});
  ms.success(`GPTs 模型加载成功`);
}else if(rt.name=='Model'){
   const ms = useMessage();
  let model= `${rt.params.gid.toString()}`  ;
  gptConfigStore.setMyData({model:model});
  ms.success(`模型加载成功`);
}

router.replace({ name: 'Chat', params: { uuid: chatStore.active } })
homeStore.setMyData({local:'Chat'});
const { isMobile } = useBasicLayout()


const collapsed = computed(() => appStore.siderCollapsed)

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token)

const getMobileClass = computed(() => {
  if (isMobile.value)
    return ['rounded-none', 'shadow-none']
  return [ 'shadow-md', 'dark:border-neutral-800'] //'border', 'rounded-md',
})

const getContainerClass = computed(() => {
  return [
    'h-full',
    { 'abc': !isMobile.value && !collapsed.value },
  ]
}) 
</script>

<template>
  <div class="h-full dark:bg-[#24272e] transition-all" :class="[isMobile ? 'p-0' : 'p-0']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <aiSider v-if="!isMobile"/>
        <Sider />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <Permission :visible="needPermission" />
  </div>
  <aiGpts/>
</template>
