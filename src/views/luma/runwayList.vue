<script setup lang="ts">
import { RunwayTask, runwayStore } from '@/api/runwayStore';
import { ref, watch } from 'vue';
import {NEmpty ,NButton,NPopover, NButtonGroup} from "naive-ui"
import {runwayFeed} from "@/api/runway"
import { mlog } from '@/api';
import { homeStore } from '@/store';
import {SvgIcon} from '@/components/common'

const mapRef = ref(new Map<string, number>());

const st= ref({pIndex:-1});
const list= ref<RunwayTask[]>([]);
const csuno= new runwayStore()
const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()
}
const RunwayTaskDown=(item:RunwayTask)=>{
    mlog("RunwayTaskDown", item)
    if(  !item.artifacts ||  item.artifacts.length==0 ) return;

    const link = document.createElement('a');

    link.href = item.artifacts[0].url ;
    link.download = item.id+".mp4";
    link.target = '_blank';
    link.rel='noreferrer'
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

watch(()=>homeStore.myData.act, (n)=>{
     if(n=='RunwayFeed')  initLoad() 
});

const videoError=(item:RunwayTask, index:number)=>{
    //if(  st.value.pIndex!=index ) return;
    mlog("videoError", index , item)
    //item.artifacts[0].url= item.artifacts[0].previewUrls[0]
    mapRef.value.set(item.id, index+1 )
};

const reRunwayFeed= async(id:string)=>{ 
    await runwayFeed(id)
    mapRef.value.delete( id)
}

initLoad();
</script>
<template>
<div v-if="list.length>0" class="p-4">
    <div  class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, index) in list" :key="index" class="relative" @mousemove="st.pIndex=index" @mouseout="st.pIndex=-1">
            <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[16px] overflow-hidden aspect-[16/8.85] ">
                <template  v-if="item.artifacts && item.artifacts.length>0  && item.artifacts[0].url">
                    <div v-if="mapRef.has(item.id)   ">
                        <NButton  size="small" type="primary" @click="reRunwayFeed( item.id )"   >{{$t('video.repeat2')}}</NButton>
                    </div>
                    <video v-else  loop  playsinline  :controls="st.pIndex==index"
                    referrerpolicy="no-referrer" :poster="item.artifacts[0].previewUrls[0]" 
                    class="w-full h-full object-cover" @error="videoError(item, index)"  >
                        <source  :src="item.artifacts[0].url" referrerpolicy="no-referrer" type="video/mp4" v-if="st.pIndex==index">
                    </video>
                </template>
                <div class=" text-center" v-else>
                    <div v-if="item.status=='FAILED'" class="pt-2" >
                        <div>{{ $t('video.failed') }}</div>
                    <div class="line-clamp-3" >{{ item.progressText }}</div>
                    </div> 
                    <NButton  size="small" type="primary" @click="runwayFeed( item.id )"   v-else-if="!item.last_feed|| ((new Date().getTime())-item.last_feed)>20*1000" >{{$t('video.repeat')}}</NButton>
                    <div class="pt-2" v-else>
                        <div>
                        {{$t('video.process')}}{{ new Date(item.last_feed).toLocaleString() }}
                        </div>
                        <div v-if="item.progressRatio">{{  (parseFloat(item.progressRatio)*100).toFixed(0) }}%</div> 
                        <!-- estimatedTimeToStartSeconds -->
                        <!-- <div v-if="item.estimatedTimeToStartSeconds && item.estimatedTimeToStartSeconds>0">{{ item.estimatedTimeToStartSeconds.toFixed(1) }}s 开始执行</div> -->
                        <!-- <div v-if="item.state=='processing'">{{ $t('video.processing') }}</div>  -->

                    </div>
                   
                </div>
            </div>
            <div class="flex justify-between items-center">
                <div  >
                <n-popover trigger="hover">
                    <template #trigger>
                    <div class="line-clamp-1">
                     <template   v-if="item.options.text_prompt">{{ item.options.text_prompt }}</template>
                     <template v-else  >{{ item.options.gen2Options?.text_prompt?item.options.gen2Options.text_prompt: item.name }}</template>
               
                    </div>
                    </template>
                    <div v-if="item.id" >ID: {{ item.id }}</div>
                    <div v-if="item.taskType=='gen3a'" >Version: Gen-3</div>
                    <div v-if="item.taskType=='gen2'" >Version: Gen-2</div>
                    <div v-if="item.createdAt" >createdAt: {{ new Date( item.createdAt).toLocaleString() }}</div>
                    <div class=" max-w-[300px]" v-if="item.options.text_prompt">{{ item.options.text_prompt }}</div>
                    <div class=" max-w-[300px]">{{ item.options.gen2Options?.text_prompt?item.options.gen2Options.text_prompt: item.name }}</div>
                </n-popover>
                
                </div>
                <div class="flex justify-end items-center pt-1"  v-if="item.artifacts && item.artifacts.length>0  && item.artifacts[0].url"> 
                     <!-- <span    @click="FeedLumaTaskDown( item.id )" class="cursor-pointer" ><SvgIcon icon="mdi:download" /></span> -->

                    
                      <n-button-group size="tiny">
                        <n-button  size="tiny" round ghost   @click="RunwayTaskDown( item )"  ><SvgIcon icon="mdi:download" /> {{ $t('video.download') }}</n-button>
                        
                      </n-button-group>
                     <!-- <a :href="item.video?.download_url? item.video?.download_url:item.video?.url" download  target="_blank" v-if="item.video?.url|| item.video?.download_url"  ><SvgIcon icon="mdi:download" class="cursor-pointer"/></a> -->
                </div>
            </div>
        </div>
    </div>
</div>
<div class="w-full h-full flex justify-center items-center" v-else>
    <NEmpty :description="$t('video.nodata')"></NEmpty>
</div>
</template>