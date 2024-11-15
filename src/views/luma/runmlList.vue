<script setup lang="ts">
import {NEmpty, useMessage,NPopover,NPopconfirm,NButton,NButtonGroup  } from 'naive-ui'
import { RunwayMlStore, RunwayMlTask } from '@/api/runwaymlStore';
import { ref, watch } from 'vue';
import {runwayMlFeedById} from "@/api/runwayml"
import { t } from '@/locales';
import {SvgIcon} from '@/components/common'
import { homeStore } from '@/store';


//runwayml.feed
const ms= useMessage()
const st= ref({pIndex:-1});
const list= ref<RunwayMlTask[]>([]);
const csuno= new RunwayMlStore()
const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()
}

const deleteGo=(item:RunwayMlTask)=>{
    //..mlog('deleteGo',item )
    if( csuno.delete( item)){ 
        ms.success( t('common.deleteSuccess'))
        initLoad()
    }
}
 
watch(()=>homeStore.myData.act, (n)=>{
     if(n=='runwayml.feed')  initLoad() 
});

initLoad();
</script>
<template>
<div v-if="list.length>0" class="p-4">
    <div  class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, index) in list" :key="index" class="relative" @mousemove="st.pIndex=index" @mouseout="st.pIndex=-1">
            <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[16px] overflow-hidden aspect-[16/8.85] ">
                <template  v-if="item.status=='SUCCEEDED' && item.output && item.output.length>0 "> 
                   <video :src="item.output[0]"  loop  playsinline  :controls="st.pIndex==index" class="w-full h-full object-cover"></video>
                </template>
                <div class=" text-center" v-else>
                    <div v-if="item.status=='FAILED'"   >
                        {{ $t('video.failed') }}
                        <div v-text="item.failure"  class="p-2"></div>
                    </div> 
                    <NButton  size="small" type="primary" @click="runwayMlFeedById( item.id )"   v-else-if="!item.last_feed|| ((new Date().getTime())-item.last_feed)>20*1000" >{{$t('video.repeat')}}</NButton>
                    <div class="pt-2" v-else>
                        <div>{{$t('video.process')}}{{ new Date(item.last_feed).toLocaleString() }}</div>
                        <div  >Status: {{ item.status }}</div> 
                        <!-- <div v-if="item.state=='processing'">{{ $t('video.processing') }}</div>  -->

                    </div>
                   
                </div>
                
             </div>

             <div class="flex justify-between items-center">
                <div  >
                <n-popover trigger="hover">
                    <template #trigger>
                    <div class="line-clamp-1">{{item.promptText}}</div>
                    </template>
                    <div v-if="item.id" >ID: {{ item.id }}</div>
                    <div v-if="item.createdAt" >createdAt: {{ new Date( item.createdAt).toLocaleString() }}</div>

                    <div class=" max-w-[300px]">{{item.promptText}}</div>
                </n-popover>
                
                </div>
                <div class="flex justify-end items-center pt-1"   v-if="item.status=='SUCCEEDED' || item.status=='FAILED' " > 
                        
                        
                      <n-button-group size="tiny">
                        <n-button  size="tiny" round ghost   v-if="item.status=='SUCCEEDED'" ><a :href="item.output[0]" target="_blank" class="flex"><SvgIcon icon="mdi:download" /> {{ $t('video.download') }} </a></n-button>
                        <n-button   size="tiny"  round ghost    > 
                             <n-popconfirm @positive-click="()=>deleteGo(item)" placement="bottom">
                                <template #trigger> <div class=" cursor-pointer"><SvgIcon icon="mdi:delete"  /></div></template>
                                {{ $t('mj.confirmDelete') }}
                            </n-popconfirm> 
                        </n-button>  
                        <!-- <n-button   size="tiny"  round ghost  @click="extend( item )"  ><SvgIcon icon="ri:video-add-line" /> {{ $t('video.extend') }}</n-button> -->
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