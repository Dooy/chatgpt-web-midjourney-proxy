<script setup lang="ts">
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

import { KlingTask, klingStore } from '@/api/klingStore';
import { nextTick, ref, watch } from 'vue';
import {NEmpty ,NButton,NPopover, NButtonGroup,NSpin, NImage,NPopconfirm,useMessage} from "naive-ui"
import { ViewCard } from 'vue-waterfall-plugin-next/dist/types/types/waterfall';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { homeStore } from '@/store';
import { klingFeed } from '@/api/kling';
import { mlog } from '@/api';
import { SvgIcon } from '@/components/common';
import { t } from '@/locales';
import KgImage from './kgImage.vue';

const list= ref<KlingTask[]>([]);
const list2= ref<ViewCard[]>([]);
 
const st =ref({show:true ,showImg:'' ,isLoad:false,pIndex:-1,isStart:true });
const csuno= new klingStore()
const ms= useMessage()
const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()

    toList2();
}
const toList2=()=>{
    list2.value= list.value.map((v,k )=>{
        let url= v.data.task_result?.images?.[0]?.url||v.data.task_result?.videos?.[0]?.url||''
        return { url , id: v.request_id,  index: k, src: url ,isLoad:0,task:v } 
    })
}

const breakpoints= {
  2000: { //当屏幕宽度小于等于1200
    rowPerView: 6,
  },
  1600: { //当屏幕宽度小于等于1200
    rowPerView: 5,
  },
  1200: { //当屏幕宽度小于等于1200
    rowPerView: 4,
  },
  800: { //当屏幕宽度小于等于800
    rowPerView: 3,
  },
  500: { //当屏幕宽度小于等于500
    rowPerView: 2,
  }
}

const { isMobile } = useBasicLayout()

const showImg= ref<typeof NImage>();


const goShow=( item:any)=>{
    //console.log('goShow', isMobile );
    if( isMobile.value)   return ; 
    st.value.show= true;
    st.value.showImg= item.url ;
    //console.log('goShow', item);
    nextTick(() => showImg.value?.click());
}
const goShow2=( item:any)=>{
    //console.log('goShow', isMobile );
    if( isMobile.value)   return ; 
    st.value.show= true;
    st.value.showImg= (item.base64?item.base64: item.src) as string ;
    //console.log('goShow', item);
    nextTick(() => showImg.value?.click());
}

initLoad();
watch(()=>homeStore.myData.act, (n)=>{
     if(n=='KlingFeed') {
        st.value.isStart= false;
        initLoad() 
     }
});
const getFeed=( item:any)=>{
    mlog('item', item )
    klingFeed( item.task.data.task_id, item.task.cat, item.task.prompt )
}

const deleteGo=(item:any)=>{
    mlog('deleteGo',item )
    if( csuno.delete( item.id)){ 
        ms.success( t('common.deleteSuccess'))
        initLoad()
    }
}
</script>
<template>
<div v-if="list.length>0" class="p-4">
    <Waterfall :list="list2" :breakpoints="breakpoints"  class=" !bg-transparent" v-if="list2.length">
    <template #item="{ item, url, index }">
        <div class="bg-white dark:bg-[#24272e] rounded-md   overflow-hidden cursor-pointer group/item relative">
            <div v-if="'failed'==item.task.data.task_status" >
                
                <div class="w-full h-[200px] justify-center items-center flex text-center"> {{ t('video.failed') }}<br>ID: {{ item.task.data.task_id }}</div>   
               
            </div>
            <template v-else-if="(!item.task.last_feed|| ((new Date().getTime())-item.task.last_feed)>20*1000) && !item.src ">
                <div class="w-full h-[200px] justify-center items-center flex">
                    <NButton  size="small" type="primary" @click="getFeed(item)"    >{{$t('video.repeat')}}</NButton>  
                </div>
            </template>
           
            <template v-else>
                <div v-if="item.task.cat!='image' && item.src" style="padding-bottom: 0%;" >
                    <video v-if="item.src" :src="item.src"   loop  playsinline disableremoteplayback disablepictureinpicture  :controls="st.pIndex==index" class="w-full h-full object-cover"></video>   
                    <a target="_blank" :href="item.src" class=" absolute right-[10px] top-[10px] text-[20px] w-[30px] h-[30px] rounded-full bg-white/20 flex justify-center items-center">
                        <SvgIcon icon="ri:play-fill"  />
                    </a>
                </div>
                <!-- <LazyImg :url="item.src"  @success="item.isLoad=1"  @click="goShow(item )" v-else-if="item.src" /> -->
                <KgImage :item="item"  @kg-success="item.isLoad=1"  @kg-click="goShow2 " v-else-if="item.src" />
                <div v-else class="w-[200px] h-[200px]"></div>
    
               

                <section class="absolute top-0 left-0 right-0 bottom-0" v-if="(!item.src )  || (item.isLoad==0 && st.isStart && item.task.cat=='image' )">
                    <div class="flex justify-center items-center w-full h-full">
                        <n-spin size="large" />
                    </div>
                </section>
            </template>

             <section v-if="item.task.prompt" class="absolute w-full bottom-0   backdrop-blur-sm text-white/70  " :class="item.src?['invisible', 'group-hover/item:visible']:[]">
                    <div class="p-3  flex justify-between items-baseline"> 
                        <div class="line-clamp-2 text-[13px]"> 
                            <template v-if="item.task.prompt">{{ item.task.prompt }}</template>
                        </div>
                        <div>
                            <n-popconfirm @positive-click="()=>deleteGo(item)" placement="bottom">
                                <template #trigger> <SvgIcon icon="mdi:delete"  /></template>
                                {{ $t('mj.confirmDelete') }}
                            </n-popconfirm> 
                        </div>
                    </div>
                </section>

        </div>
    </template>
    </Waterfall>
</div>
<div class="w-full h-full flex justify-center items-center" v-else>
    <NEmpty :description="$t('video.nodata')"></NEmpty>
</div>
<NImage   :src="st.showImg"  ref="showImg" v-if="st.showImg" :width="1" />
</template>