<script setup lang="ts">
import aiSiderInput from './aiSiderInput.vue'; 
//import { useAppStore, useChatStore } from '@/store';

import { useBasicLayout } from '@/hooks/useBasicLayout'
import { mlog } from '@/api';
import chatIndex from '@/views/chat/index.vue';

const { isMobile } = useBasicLayout()
// const appStore = useAppStore()
// const chatStore = useChatStore()
const drawSent=( obj:any )=>{
    mlog('drawSent' , obj )
}
const mjClose=()=>{
}

// function handleAdd() {
//   chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
//   if (isMobile.value)
//     appStore.setSiderCollapsed(true)
// }

//handleAdd();
</script>
<template>
         <!-- <chatIndex></chatIndex> -->

<div   class="flex h-full">
    <div class="h-full ">
    <aiSiderInput  @close="mjClose" @drawSent="drawSent" :button-disabled="false"></aiSiderInput>
    </div>
     
    <main class="flex-1 overflow-hidden h-full">
        <chatIndex></chatIndex>
    </main>
</div>
</template>