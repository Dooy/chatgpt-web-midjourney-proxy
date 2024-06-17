<script setup lang="ts">
import { ref, watch } from 'vue'
import { SvgIcon } from '@/components/common';
//import {   FeedTask} from '@/api/suno';
import {   sunoStore, SunoMedia} from '@/api/sunoStore';  

import playui from './playui.vue';
import { homeStore } from '@/store';
import { mlog } from '@/api';
import {NEmpty, NImage ,useMessage} from "naive-ui"
import { FeedTask } from '@/api/suno';

const list= ref<SunoMedia[]>([]);
const csuno= new sunoStore()
const st= ref({playid:''});

const ms = useMessage();
const initLoad=()=>{
    let arr = csuno.getObjs();
    list.value= arr.reverse()
}

const getNowCls=(v:any)=>{
    if(v.id==st.value.playid ){
        return ['bg-gray-200','dark:bg-black']
    }
    return [];
}
const goPlay=(v:SunoMedia)=>{
    if(v.status=='error'){
        ms.info("这首歌生成失败！")
        return ;
    }
    st.value.playid=v.id
    homeStore.setMyData({act:'goPlay',actData:v})
    
    if(v.status!='complete'){
        FeedTask([v.id ])
    }
}

const extend=(v:SunoMedia)=>{
    mlog("extend", extend )
    //homeStore.myData.actData
    homeStore.setMyData({act:"suno.extend", actData: v  })
}

const sp= ref({v:10, max:0 ,status:'',idDrop:false });
 
watch(()=>homeStore.myData.act, (n)=>{
     if(n=='FeedTask'){
         initLoad()
     }
     if(n=='playEned'){
        //
        let  i= list.value.findIndex((v)=>v.id==st.value.playid)
        i++;
        mlog('playEned,',i, list.value.length )
        if(i<list.value.length) setTimeout(()=>goPlay(list.value[i]),1000)  
     }
});

const getExSuno=(id:string)=>{
    id= id.replace("m_",'');
    let index= list.value.findIndex(v=>v.id==id);
     
    if (index<0){
      return null ;
    }
    return list.value[index];
}
const update = (v:any )=>{
     sp.value=v
      
}
initLoad();
</script>
<template>
<div v-if="list.length>0">
    <div  v-for="item in list" :class="getNowCls( item )" class="flex relative  justify-between items-start p-2 hover:dark:bg-black hover:bg-gray-200 border-b-[1px] border-gray-500/10 ">
        
        <playui @update="update" v-if="st.playid==item.id"  class="absolute top-[-4px] left-0 w-full  z-10" ></playui>
        <div class="w-[60px] h-[60px] relative  cursor-pointer"  @click="goPlay( item )">
            
           <template v-if="item.status=='complete'">
                <n-image  lazy  width="100"  :src="item.image_url" preview-disabled  >
                    <template #placeholder>
                        <div class="w-full h-full justify-center items-center flex"  >
                        <SvgIcon icon="line-md:downloading-loop" class="text-[40px] text-green-300"   ></SvgIcon>
                        </div>
                    </template>
                </n-image>
                <div class="absolute top-0 right-0 w-full h-full flex justify-center items-center" v-if="st.playid==item.id">
                    <SvgIcon icon="mdi:pause-circle-outline" class="text-[40px] text-[#fff]" v-if="sp.status=='pause'"></SvgIcon>
                    <SvgIcon icon="mdi:play-circle-outline" class="text-[40px] text-[#fff]" v-else></SvgIcon>
                </div>
            </template>
            <template v-else>
                <n-image  lazy  width="100"  :src="item.image_url" preview-disabled  />
                <div class="absolute top-0 right-0  w-full h-full justify-center items-center flex"  >
                    <SvgIcon icon="line-md:downloading-loop" class="text-[40px] text-green-300"   ></SvgIcon>
                </div>
            </template>
             

            
        </div> 
        <div class="flex-1  pl-2"> 
            <div class="flex justify-between line-clamp-1 w-full cursor-pointer"  @click="goPlay( item )">
                <div class="flex justify-start items-center"> 
                    <h3 >{{item.title}}</h3>
                    <div class="text-[8px] flex items-center border-[1px] border-gray-500/30 px-1 ml-1 list-none rounded-md" v-if="item.metadata?.type=='upload'" >Uploaded</div>
                </div>
                <div class="opacity-80"  >{{item.metadata.tags}}</div>
            </div>
            <div class="opacity-60 line-clamp-1 w-full text-[12px] cursor-pointer"  @click="goPlay( item )" v-if="item.metadata && item.metadata.prompt">
             {{item.metadata.prompt}}
            </div>
            <div class="opacity-60 line-clamp-1 w-full text-[12px] cursor-pointer"  @click="goPlay( item )" v-else>
             {{$t('suno.noly')}}
              </div>
            <div class="text-right text-[14px] flex justify-end items-center space-x-2  ">
                <div class="text-[8px] flex items-center border-[1px] border-gray-500/30 px-1 list-none rounded-md" v-if="item.metadata?.audio_prompt_id">
                    {{ $t('suno.extendFrom') }}:{{ getExSuno(item.metadata?.audio_prompt_id)?.title }}
                </div>
                <div v-if="item.status=='error'" class="text-[8px] flex items-center border-[1px] border-red-500/80 px-1 list-none rounded-md ">{{ $t('suno.fail') }}</div>
                <template v-if="item.metadata && item.metadata.duration">
                    <div class="text-[8px] flex items-center border-[1px] border-gray-500/30 px-1 list-none rounded-md" > {{item.metadata.duration.toFixed(1)}}s</div>
                    <div @click="extend(item)" class="text-[8px] flex items-center border-[1px] border-gray-500/30 px-1 list-none rounded-md cursor-pointer">{{ $t('suno.extend') }}</div>
                </template>
                <div class="text-[8px] flex items-center border-[1px] border-gray-500/30 px-1 list-none rounded-md" v-if="item.major_model_version"> {{item.major_model_version}}</div>
                <SvgIcon icon="mdi:play-circle-outline" class="cursor-pointer"  @click="goPlay( item )" />
                <a :href="item.audio_url" download  target="_blank"><SvgIcon icon="mdi:download" class="cursor-pointer"/></a>
            </div>
           
        </div>
    </div>
</div>
<div class="w-full h-full flex justify-center items-center" v-else>
    <NEmpty :description="$t('suno.nodata')"></NEmpty>
</div>

</template>
