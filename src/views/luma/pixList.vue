<script setup lang="ts">
import { pixverseStore,pixverseTask } from '@/api/pixverseStore';
import { homeStore } from '@/store';
import { ref, watch } from 'vue';
import {NEmpty ,NButton,NPopover, NButtonGroup, useMessage,NPopconfirm} from "naive-ui"
import { pixFeed } from '@/api/pixverse';
import { t } from '@/locales';
import {SvgIcon} from '@/components/common'
import { mlog } from '@/api';



const ms= useMessage()
const st= ref({pIndex:-1});
const list= ref<pixverseTask[]>([]);
const csuno= new pixverseStore()
const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()
}

const deleteGo=(item:pixverseTask)=>{
    //..mlog('deleteGo',item )
    if( csuno.delete( item.video_id)){ 
        ms.success( t('common.deleteSuccess'))
        initLoad()
    }
}
const extend2=  (item:pixverseTask )=>{ 
    
    mlog("extend ", item )  
    homeStore.setMyData({act:"pix.extend", actData: item  })
}
watch(()=>homeStore.myData.act, (n)=>{
     if(n=='PixFeed')  initLoad() 
});
initLoad()
</script>

<template>
<div v-if="list.length>0" class="p-4">
        <div  class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, index) in list" :key="index" class="relative" @mousemove="st.pIndex=index" @mouseout="st.pIndex=-1">
            <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[16px] overflow-hidden aspect-[16/8.85] ">
                <template  v-if="item.data && item.data.video_status==1  "> 
                   <video :src=" item.data.url"  :poster="item.data.first_frame" loop  playsinline  :controls="st.pIndex==index" class="w-full h-full object-cover"></video>
                </template>
                <div class=" text-center" v-else>
                    <div v-if="!item.data || item.data.video_status==100"   >
                        {{ $t('video.failed') }}
                        <!-- <div v-text="item.failure"  class="p-2"></div> -->
                    </div> 
                    <NButton  size="small" type="primary" @click="pixFeed( item.video_id )"   v-else-if="!item.last_feed|| ((new Date().getTime())-item.last_feed)>20*1000" >{{$t('video.repeat')}}</NButton>
                    <div class="pt-2" v-else>
                        <div>{{$t('video.process')}}{{ new Date(item.last_feed).toLocaleString() }}</div>
                        <div  >Status: {{ item.data.video_status }}</div> 
                    </div>
                   
                </div>
                
             </div>

             <div class="flex justify-between items-center">
                <div  >
                <n-popover trigger="hover" v-if="item.data">
                    <template #trigger>
                    <div class="line-clamp-1">{{item.data.prompt}}</div>
                    </template>
                    <div v-if="item.video_id" >ID: {{ item.video_id }}</div>
                    <div v-if="item.data.video_duration" class=" justify-between flex" >
                        <div>{{ t('mj.duration') }}: {{item.data.video_duration}}s</div>
                        <div>Model: {{ item.data.model }}</div>
                    </div>
                    <div class=" justify-between flex">
                        <div>{{ t('mj.mode') }}: {{ item.data.motion_mode  }}</div>
                        <div>Quality:  {{ item.data.quality  }}</div>
                    </div>
                    <div v-if="item.data.created_at" >createdAt: {{ new Date( item.data.created_at).toLocaleString() }}</div>

                    <div class=" max-w-[400px]">{{ t('mjchat.prompt') }}: {{item.data.prompt}}</div>  
                </n-popover>
                
                </div>
                <div class="flex justify-end items-center pt-1"   v-if="item.data " > 
                        
                        
                      <n-button-group size="tiny">
                        <n-button  size="tiny" round ghost   v-if="item.data.video_status==1" ><a :href="item.data.url" target="_blank" class="flex"><SvgIcon icon="mdi:download" /> {{ $t('video.download') }} </a></n-button>
                        <n-button   size="tiny"  round ghost    > 
                             <n-popconfirm @positive-click="()=>deleteGo(item)" placement="bottom">
                                <template #trigger> <div class=" cursor-pointer"><SvgIcon icon="mdi:delete"  /></div></template>
                                {{ $t('mj.confirmDelete') }}
                            </n-popconfirm> 
                        </n-button>  
                        <n-button   size="tiny"  round ghost  @click="extend2( item )"  ><SvgIcon icon="ri:video-add-line" /> {{ $t('video.extend') }}</n-button>
                      </n-button-group>
                
                </div>
            </div>
        </div>
    </div>
</div>
<div class="w-full h-full flex justify-center items-center" v-else>
    <NEmpty :description="$t('video.nodata')"></NEmpty>
</div>
</template>