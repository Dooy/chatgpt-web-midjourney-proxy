<script setup lang='ts'>
import { computed } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { useAppStore } from '@/store'
import { aiSider } from '@/views/mj'
import aiMobileMenu from '@/views/mj/aiMobileMenu.vue';

const appStore = useAppStore()

const { isMobile } = useBasicLayout()

const collapsed = computed(() => appStore.siderCollapsed)


const getMobileClass = computed(() => {
    if (isMobile.value)
        return ['rounded-none', 'shadow-none']
    return ['shadow-md', 'dark:border-neutral-800'] //'border', 'rounded-md',
})

const getContainerClass = computed(() => {
    return [
        'h-full',
        { 'abc': !isMobile.value && !collapsed.value },
    ]
}) 
</script>

<template>
    <div class="dark:bg-[#24272e] transition-all p-0" :class="[isMobile ? 'h55' : 'h-full']">
        <div class="h-full overflow-hidden" :class="getMobileClass">
            <NLayout class="z-40 transition" :class="getContainerClass" has-sider
                :sider-placement="isMobile ? 'left' : 'right'">
                <aiSider v-if="!isMobile" />

                <NLayoutContent class="h-full">
                        <iframe id="myframe" src="https://raojl3-bggy.hf.space" title="RJLAPI" allow="fullscreen"
                            loading="lazy"></iframe>
                </NLayoutContent>
                <!-- <Sider /> -->
            </NLayout>
        </div>
    </div>
    <aiMobileMenu v-if="isMobile" />
</template>
<style>
iframe {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 0;
}
</style>
