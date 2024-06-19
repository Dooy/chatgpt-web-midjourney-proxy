<script setup lang="ts">
import { LumaMedia, lumaStore } from '@/api/lumaStore';
import { computed, ref, watch } from 'vue';
import {NEmpty ,NButton,NPopover} from 'naive-ui'
import {FeedLumaTask} from '@/api';
import { homeStore } from '@/store';
import {SvgIcon} from '@/components/common'

const st= ref({pIndex:-1});
const list= ref<LumaMedia[]>([]);
const csuno= new lumaStore()
const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()
}
const nowTime= computed(()=>{
    return new Date().getTime()
})
watch(()=>homeStore.myData.act, (n)=>{
     if(n=='FeedLumaTask')  initLoad() 
});

initLoad();
</script>
<template>
<div v-if="list.length>0" class="p-4">
    <div  class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, index) in list" :key="index" class="relative" @mousemove="st.pIndex=index" @mouseout="st.pIndex=-1">
            <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[16px] overflow-hidden aspect-[16/8.85] ">
                <video v-if="item.video" :src="item.video?.url" loop  playsinline  :controls="st.pIndex==index" class="w-full h-full object-cover"></video>
                <div class=" text-center" v-else>
                    
                    <NButton  size="small" type="primary" @click="FeedLumaTask( item.id )"   v-if="!item.last_feed|| ((new Date().getTime())-item.last_feed)>20*1000" >重新获取</NButton>
                    <div class="pt-2" v-else>视频生成中...{{ new Date(item.last_feed).toLocaleString() }}</div>
                   
                </div>
            </div>
            <div class="flex justify-between items-center">
                <div  >
                <n-popover trigger="hover">
                    <template #trigger>
                    <div class="line-clamp-1">{{item.prompt}}</div>
                    </template>
                    <div class=" max-w-[300px]">{{item.prompt}}</div>
                </n-popover>
                
                </div>
                <div>
                     <a :href="item.video?.url" download  target="_blank" v-if="item.video"  ><SvgIcon icon="mdi:download" class="cursor-pointer"/></a>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="w-full h-full flex justify-center items-center" v-else>
    <NEmpty :description="$t('video.nodata')"></NEmpty>
</div>
</template>