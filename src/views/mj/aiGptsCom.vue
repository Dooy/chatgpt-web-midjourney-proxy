<script setup lang="ts"> 
import { myFetch, gptsType } from '@/api';
import { homeStore,gptConfigStore } from '@/store';
import { ref } from 'vue';
import { useMessage } from 'naive-ui';

const ms = useMessage();
const emit = defineEmits(['close']);
const gptsList= ref<gptsType[]>([]);
const load= async ()=>{
    const gptUrl= homeStore.myData.session.gptUrl??'https://gpts.ddaiai.com/open/gpts';
    let d = await myFetch(gptUrl);
    gptsList.value = d.gpts as gptsType[];
}
const go= ( item: gptsType)=>{
    gptConfigStore.setMyData({model:  `${ item.gid }`   ,gpts:item});
    ms.success('切换成功！');
    emit('close')
}

load();
</script>
<template>
<div class="w-full h-full p-4">
    <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" v-if="gptsList.length>0">
        <div @click="go(v)" v-for="v in gptsList" class="group relative flex gap-3 rounded-2xl bg-[#e8eaf1] p-5 dark:bg-neutral-600 cursor-pointer ">
           
            <div class="min-w-0 flex-1">
                <h3 class=" transition   text-lg font-semibold"> {{ v.name }}</h3>
                <div class="mt-0.5 text-zinc-400 text-md line-clamp-2">{{ v.info }}</div>
            </div>
            <img  class="group-hover:scale-[130%] duration-300 shrink-0 overflow-hidden bg-base object-cover rounded-full bc-avatar w-[80px] h-[80px]" :src="v.logo"/>
        </div>
    </div>
    <div class="h-full flex items-center justify-center"  v-else>正在载入...</div>
</div>
</template>