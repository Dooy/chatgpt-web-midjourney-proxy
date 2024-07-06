<script setup lang="ts"> 
import { FeedViggleTask } from '@/api/viggle';
import { ViggleTask, viggleStore } from '@/api/viggleStore';
import {NEmpty ,NButton,NPopover, NTag,NButtonGroup } from 'naive-ui'
 
import { ref, watch } from 'vue';
import {SvgIcon} from "@/components/common"
import { homeStore } from '@/store';

const st= ref({pIndex:-1});
const list= ref<ViggleTask[]>([]);

const csuno = new viggleStore()
const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()
}
const TaskDown=async (item:ViggleTask)=>{
    //FeedLumaTask(id)
    
        //window.open(d.url)
    const link = document.createElement('a');
    link.href = item.result ;
    link.download = item.taskID+".mp4";
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
}

watch(()=>homeStore.myData.act, (n)=>{
     if(n=='FeedViggleTask')  initLoad() 
});
initLoad()
</script>
<template>
<div v-if="list.length>0" class="p-4" >
    <div  class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, index) in list" :key="index" class="relative" @mousemove="st.pIndex=index" @mouseout="st.pIndex=-1">
            <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[16px] overflow-hidden aspect-[16/8.85] ">
                <video class="bg-[#242424] object-contain w-full h-full transition-all" v-if="item.result" :src="item.result" :poster="item.resultCover" loop  playsinline  :controls="st.pIndex==index" ></video>
                <div class=" text-center" v-else>
                     
                    <NButton  size="small" type="primary" @click="FeedViggleTask( item.taskID )"   v-if="!item.last_feed|| ((new Date().getTime())-item.last_feed)>20*1000" >{{$t('video.repeat')}}</NButton>
                    <div class="pt-2" v-else>
                        <div>{{$t('video.process')}}{{ new Date(item.last_feed).toLocaleString() }}</div> 
                    </div>
                   
                </div>
            </div>
            <div class="flex justify-between items-center">
                <div  >
                <n-popover trigger="hover">
                    <template #trigger>
                    <div class="line-clamp-1">{{item.taskID}}</div>
                    </template>
                    <div class=" max-w-[300px]">{{item.taskID}}</div>
                </n-popover>
                
                </div>
                <div class="flex justify-end items-center pt-1"   > 
                     <!-- <span    @click="FeedLumaTaskDown( item.id )" class="cursor-pointer" ><SvgIcon icon="mdi:download" /></span> -->

                    
                      <n-button-group size="tiny">
                        <n-button  size="tiny" round ghost @click="TaskDown( item )"   ><SvgIcon icon="mdi:download" /> {{ $t('video.download') }}</n-button>
                        <!-- <n-button   size="tiny"  round ghost   ><SvgIcon icon="ri:video-add-line" /> {{ $t('video.extend') }}</n-button> -->
                      </n-button-group>
                     <!-- <a :href="item.video?.download_url? item.video?.download_url:item.video?.url" download  target="_blank" v-if="item.video?.url|| item.video?.download_url"  ><SvgIcon icon="mdi:download" class="cursor-pointer"/></a> -->
                </div>
            </div>
        </div>
    </div>
</div> 
<div class="w-full h-full flex justify-center items-center" v-else>
    <NEmpty description="请先创作才有跳舞视频列表"></NEmpty>
</div>
</template>