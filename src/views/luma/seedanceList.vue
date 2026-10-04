<script setup lang="ts">
import { seedanceStore, SeedanceTask } from '@/api/seedanceStore';
import { onMounted, ref, watch } from 'vue';
import {NEmpty, useMessage,NButton} from 'naive-ui'
import { mlog } from '@/api';
import { t } from '@/locales';
import { homeStore } from '@/store/homeStore';
import { SeedanceFeed } from '@/api/seedance';
import { SvgIcon } from '@/components/common';

const list= ref<SeedanceTask[]>([]);
const csuno= new seedanceStore()
const ms= useMessage();
const st= ref({pIndex:-1});
const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()
}

const deleteGo=(item:SeedanceTask)=>{
    mlog('deleteGo',item )
    if( csuno.delete( item.id)){ 
        ms.success( t('common.deleteSuccess'))
        initLoad()
    }
}

watch(()=>homeStore.myData.act, (n)=>{
    if(n=='SeedanceFeed')  initLoad()
})
onMounted(() => {
    initLoad();
    homeStore.setMyData({ms:ms });
})

</script>

<template>

<div v-if="list.length>0" class="p-4">
    <div  class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, index) in list" :key="index" class="relative" @mousemove="st.pIndex=index" @mouseout="st.pIndex=-1">
            <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[16px] overflow-hidden aspect-[16/8.85] ">
                    <video   loop  playsinline  :controls="st.pIndex==index" v-if="item.url"
                        referrerpolicy="no-referrer"  
                        class="w-full h-full object-cover"   >
                            <source  :src="item.url" referrerpolicy="no-referrer" type="video/mp4" >
                    </video>
                    <div v-else-if="'failed'==item.status" >
                        <div class="w-full h-[200px] justify-center items-center flex text-center"> 
                        {{ t('video.failed') }}<br>ID: {{ item.id }}
                        <br>{{ item.error }}
                        </div>   
                    </div>
                   <template v-else-if="(!item.last_feed|| ((new Date().getTime())-item.last_feed)>20*1000)  ">
                        <div class="w-full h-[200px] justify-center items-center flex">
                            <NButton  size="small" type="primary" @click="SeedanceFeed(item.id,'')"    >{{$t('video.repeat')}}</NButton>  
                        </div>
                    </template>
                    <div class="pt-2 " v-else>
                        <div>
                        {{$t('video.process')}}{{ new Date(item.last_feed).toLocaleString() }}
                        </div>
                        <div class="text-center">{{t('video.pending') }}: {{ item.status }}</div> 
                    </div>
                    <a target="_blank" :href="item.url" v-if="item.url" class=" absolute right-[10px] top-[10px] text-[14px] w-[20px] h-[20px] rounded-full bg-white/20 flex justify-center items-center">
                        <SvgIcon icon="line-md:download-loop"  />
                    </a>
            </div>
        </div>
    </div>
</div>
<div class="w-full h-full flex justify-center items-center" v-else>
    
    <NEmpty :description="$t('video.nodata')"></NEmpty>
</div>
</template>