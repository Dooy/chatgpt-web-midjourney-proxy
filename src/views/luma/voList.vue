<script setup lang="ts">
import { LumaMedia, lumaStore } from '@/api/lumaStore';
import { computed, ref, watch } from 'vue';
import {NEmpty ,NButton,NPopover, NTag,NButtonGroup } from 'naive-ui'
import {FeedLumaTask, lumaFetch, mlog} from '@/api';
import { homeStore } from '@/store';
import {SvgIcon} from '@/components/common'
import { myTestTranscode } from '@/api/mp4img';
//import { myTestTranscode } from '@/api/mp4img';

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
const FeedLumaTaskDown=async (id:string)=>{
    //FeedLumaTask(id)
    let d:any= await lumaFetch('/generations/'+id+'/download_video_url' );
    mlog("d", d )
    if(d.url) {
        //window.open(d.url)
        const link = document.createElement('a');
        link.href =d.url;
        link.download = id+".mp4";
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

//getLastFrameBase64
const extend= async(item:LumaMedia )=>{
    
    mlog("extend ", item ) 
    homeStore.setMyData({act:"luma.extend", actData: item  })

}


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
                <video v-if="item.video?.url|| item.video?.download_url" :src="item.video?.download_url? item.video?.download_url:item.video?.url" @error="$event.target.src=item.video?.url" loop  playsinline  :controls="st.pIndex==index" class="w-full h-full object-cover"></video>
                <div class=" text-center" v-else>
                    
                    <NButton  size="small" type="primary" @click="FeedLumaTask( item.id )"   v-if="!item.last_feed|| ((new Date().getTime())-item.last_feed)>20*1000" >{{$t('video.repeat')}}</NButton>
                    <div class="pt-2" v-else>
                        <div>{{$t('video.process')}}{{ new Date(item.last_feed).toLocaleString() }}</div>
                        <div v-if="item.state=='pending'">{{ $t('video.pending') }}</div> 
                        <div v-if="item.state=='processing'">{{ $t('video.processing') }}</div> 
                    </div>
                   
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
                <div class="flex justify-end items-center pt-1"  v-if="item.video?.url|| item.video?.download_url"> 
                     <!-- <span    @click="FeedLumaTaskDown( item.id )" class="cursor-pointer" ><SvgIcon icon="mdi:download" /></span> -->

                    
                      <n-button-group size="tiny">
                        <n-button  size="tiny" round ghost   @click="FeedLumaTaskDown( item.id )"  ><SvgIcon icon="mdi:download" /> {{ $t('video.download') }}</n-button>
                        <n-button   size="tiny"  round ghost  @click="extend( item )"  ><SvgIcon icon="ri:video-add-line" /> {{ $t('video.extend') }}</n-button>
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