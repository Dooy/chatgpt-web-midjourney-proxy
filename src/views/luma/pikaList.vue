<script setup lang="ts">
import { pikaFeed } from '@/api/pika';
import { PikaTask, pikaStore } from '@/api/pikaStore';
import { onMounted, ref, watch } from 'vue';
import {NEmpty,NButton,NPopover, NButtonGroup, useMessage,NPopconfirm} from "naive-ui"
import { mlog } from '@/api';
import {SvgIcon} from '@/components/common'
import { t } from '@/locales';
import { homeStore } from '@/store';

const st= ref({pIndex:-1});
const list= ref<PikaTask[]>([]);
const csuno= new pikaStore()

const ms= useMessage();

const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()
}

const deleteGo=(item:PikaTask)=>{
    mlog('deleteGo',item )
    if( csuno.delete( item)){ 
        ms.success( t('common.deleteSuccess'))
        initLoad()
    }
}

//pikaFeed('66e0818e-05fb-454e-b246-a6f253e9ffbf')
//pikaFeed('e90a4fa4-009a-4ca8-9002-57d2f2cbb6c3')
//PikaFeed
watch(()=>homeStore.myData.act, (n)=>{
    if(n=='PikaFeed')  initLoad()
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
                
                <template v-if="item.videos.length>0">
                    <video   loop  playsinline  :controls="st.pIndex==index" v-if="  item.videos[0].resultUrl"
                        referrerpolicy="no-referrer" :poster="item.videos[0].videoPoster" 
                        class="w-full h-full object-cover"   >
                            <source  :src="item.videos[0].resultUrl" referrerpolicy="no-referrer" type="video/mp4" v-if="st.pIndex==index">
                    </video>
                    <div v-else-if="'error'==item.videos[0].status" >
                        <div class="w-full h-[200px] justify-center items-center flex text-center"> 
                        {{ t('video.failed') }}<br>ID: {{ item.id }}
                        <br>{{ item.videos[0].error }}
                        </div>   
                    </div>
                   <template v-else-if="(!item.last_feed|| ((new Date().getTime())-item.last_feed)>20*1000)  ">
                        <div class="w-full h-[200px] justify-center items-center flex">
                            <NButton  size="small" type="primary" @click="pikaFeed(item.id)"    >{{$t('video.repeat')}}</NButton>  
                        </div>
                    </template>
                    <div class="pt-2 " v-else>
                        <div>
                        {{$t('video.process')}}{{ new Date(item.last_feed).toLocaleString() }}
                        </div>
                        <div v-if="item.videos[0].progress" class="text-center">{{ item.videos[0].progress }}%</div> 
                        <div v-if="item.videos[0].status=='queued'" class="text-center">{{t('video.pending') }}</div> 
                    </div>
                </template>

            </div>
            <div class="flex justify-between items-center">
                <section  >
                 <div class="line-clamp-1">{{ item.promptText }}</div>
                </section>
                <section class="flex justify-end items-center pt-1" > 
                     <n-button-group size="tiny" >
                        <n-button  size="tiny" round ghost    v-if="item.videos[0].resultUrl" >
                            <a :href="item.videos[0].resultUrl" download  target="_blank" class="flex justify-center items-center"  >
                                <SvgIcon icon="mdi:download" /> {{ $t('video.download') }}
                            </a>
                        </n-button>
                        <n-button   size="tiny"  round ghost    > 
                            <n-popconfirm @positive-click="()=>deleteGo(item)" placement="bottom">
                                <template #trigger> <SvgIcon icon="mdi:delete"  /></template>
                                {{ $t('mj.confirmDelete') }}
                            </n-popconfirm> 
                        </n-button>
                        <!-- <n-button   size="tiny"  round ghost  @click="extend( item )"  ><SvgIcon icon="ri:video-add-line" /> {{ $t('video.extend') }}</n-button> -->
                        
                        
                      </n-button-group>
                     
                </section>
            </div>
        </div>
    </div>
</div>
<div class="w-full h-full flex justify-center items-center" v-else>
    <NEmpty :description="$t('video.nodata')"></NEmpty>
</div>
 
</template>