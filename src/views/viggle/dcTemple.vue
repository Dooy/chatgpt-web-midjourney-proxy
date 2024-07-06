<script setup lang="ts">
import { mlog } from '@/api';
import { viggleFetch,tagInfo,ViggleTemplate } from '@/api/viggle';
import { ref } from 'vue';
import { NButton } from 'naive-ui';
import { homeStore } from '@/store';
 

const st= ref({qindex:0}) 
const emit = defineEmits(['close','toq']);
const pp= defineProps<{q:string}>( );



const tagOption= ref<tagInfo[]>([])
const myList = ref<ViggleTemplate[]>([])

const loadTag= async ()=>{
    let d= await viggleFetch('/template2/tag')
    mlog('tags', d );
    if (d.data ) {
        tagOption.value= d.data;
        if( tagOption.value.length>0 ) goSearch( tagOption.value[0] )
    }
}
const initLoad=()=>{
   loadTag()
}
const goSearch= (v:tagInfo)=>{
     emit('toq',{q:v.name});
     searchQ('',v.id)
}

const searchQ= async (q:string,tagID:string)=>{
    let url=`/template2?page=1&pageSize=48&searchKeyword=${ encodeURIComponent(q) }&tagID=${ tagID }&type=0`
    let d= await viggleFetch( url)
    mlog('searchQ', d );
    myList.value=[]
    if (d.data && d.data.length>0 ) {
         myList.value= d.data as ViggleTemplate[]
    }
    
}

const useVideo= (v:ViggleTemplate )=>{
    mlog('useVideo', v );
    homeStore.setMyData({act:'viggle.useVideo', actData: v })
}

initLoad()
</script>

<template>
<div class="w-full h-full p-4">
    <div class="flex items-center justify-start line-clamp-1 pb-4"  >
        <div class="m-1 cursor-pointer" v-for="v in tagOption" @click="goSearch(v)">
        <n-button strong   round size="small" type="success" v-if="v.name==pp.q">{{ v.name }}</n-button>
        <n-button strong secondary round size="small" type="success" v-else>{{ v.name }}</n-button>
        </div>
    </div>
    <div v-if="myList.length>0"   class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div   v-for="(v,k) in myList" class="  mb-2 " >
            <div class="relative h-[180px]" @mousemove="st.qindex=k">
                <div class="absolute right-2 top-2 z-40" v-if="st.qindex==k">
                    <NButton rounded size="small" type="success" @click="useVideo(v)">{{$t('dance.use')}}</NButton>
                </div>
                <div class="   absolute w-full h-full top-0 left-0 z-1"   >
                <video :controls="st.qindex==k"  playsinline loop :poster="v.processedCoverURL" 
                 class="  rounded-lg bg-[#242424] object-contain w-full h-full transition-all"      :src="v.processedURL" ></video>
                </div>
            </div>
            <div class="line-clamp-1">{{ v.description }}</div>
        </div>
    </div>
</div>
</template>
<style scope>
 .myvideo{
    width: 100%;
    height: 100%;
    background: #242424;
    object-fit: contain;
    cursor: pointer;
    transition: all .3s;
 }
</style>