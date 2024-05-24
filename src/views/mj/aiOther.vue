<script setup lang="ts">
import { mlog } from '@/api';
import { homeStore ,useChatStore} from '@/store';
import { watch } from 'vue'; 

const chatStore = useChatStore() //const chatStore = useChatStore()
//const dataSources = computed(() => chatStore.getChatByUuid(+uuid))
watch( ()=>homeStore.myData.local,n=>{
    if(! chatStore.active) return ;
    const dataSources =    chatStore.getChatByUuid(+chatStore.active) ;
    if( dataSources.length> 0 ){
        chatStore.addHistory({ title: 'New Chat', uuid: Date.now(), isEdit: false })
    }
    
})
 
</script>

<template></template>