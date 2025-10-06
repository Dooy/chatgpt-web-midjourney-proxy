<script setup lang="ts">
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
import { ViewCard } from 'vue-waterfall-plugin-next/dist/types/types/waterfall';

import { mlog } from '@/api';
import { DtoItem, DtoStore } from '@/api/dtoStore';
import { onMounted, ref, watch } from 'vue';
import { NEmpty,NButton, useMessage, NPopconfirm,NPopover} from "naive-ui"
import{ DtoFeed, breakpoints } from './veo'
import { t } from '@/locales';
import { SvgIcon } from '@/components/common';
import { homeStore } from '@/store';

const csuno= new DtoStore()
const list= ref<DtoItem[]>([]);
const list2= ref<ViewCard[]>([]);
const st=ref({show:false,showImg:'' ,isLoad:false,pIndex:-1,isStart:true });

const ms= useMessage()
const initLoad=()=>{
    
    let arr = csuno.getObjs();
    mlog("initLoad List", arr); //
    list.value= arr.reverse()

    list2.value= list.value.map((v,k )=>{
        let url= v.url??''
        return { url , id: v.id,  index: k, src: url ,isLoad:0,task:v } 
    })
}

const getFeed=(item:ViewCard)=>{
     DtoFeed(item.task)
}

 
onMounted(()=>{
   initLoad()
})
watch(()=>homeStore.myData.act, (n)=>{
     if(n=='dtoFeed') {
        st.value.isStart= false;
        initLoad() 
     }
});

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
            
            <div v-if="'failed'==item.task.status" >
                <div class="w-full h-[200px] justify-center items-center flex text-center"> {{ t('video.failed') }}<br>ID: {{ item.task.mid }}</div> 
            </div>
            
            <template v-else-if=" ((new Date().getTime())/1000-item.task.last_feed)>20  && !item.src ">
                <div class="w-full pt-[50px] justify-center items-center flex ">
                    <NButton  size="small" type="primary" @click="getFeed(item)"    >{{$t('video.repeat')}}</NButton>
                </div>
                <div class=" text-center w-full h-[80px] pb-[30px] text-[12px] opacity-80 ">ID: {{ item.task.mid }} </div>
            </template>
            <template v-else-if="!item.src">
                <div class="w-full pt-[50px] justify-center items-center flex ">
                    <div class="text-center ">Status: {{ item.task.status }}</div>
                </div>
                <div class=" text-center w-full h-[80px]  pb-[30px] text-[12px] opacity-80 ">ID: {{ item.task.mid }} </div>
            </template>
            
            <template v-else>
                
                 <div v-if="item.task.type=='video' && item.src" style="padding-bottom: 0%;" @mouseover="st.pIndex=index">
                    <video v-if="item.src" :src="item.src"   loop  playsinline disableremoteplayback disablepictureinpicture 
                     :controls="st.pIndex==index" class="w-full h-full object-cover"></video>   
                    <a target="_blank" :href="item.src" class=" absolute right-[10px] top-[10px] text-[14px] w-[20px] h-[20px] rounded-full bg-white/20 flex justify-center items-center">
                        <SvgIcon icon="line-md:download-loop"  />
                    </a>
                </div> 
                
            </template>

            <section  class="absolute w-full bottom-0   backdrop-blur-sm text-white/70  " :class="item.src?['invisible', 'group-hover/item:visible']:[]">
                    <div class="p-3  flex justify-between items-baseline">
                         <n-popover trigger="hover">
                            <template #trigger> 
                                <div class="line-clamp-1 text-[13px]"> 
                                    <template v-if="item.task.title">{{ item.task.title }}</template>
                                </div>
                            </template>
                             <div>
                                Model: {{ item.task.model }}<br>
                                Platform: {{ item.task.plat }}<br>
                                Id: {{ item.task.id }}<br>
                             </div>
                        </n-popover>
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

</template>