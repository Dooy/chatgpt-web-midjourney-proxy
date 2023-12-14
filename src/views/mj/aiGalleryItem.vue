<script setup lang="ts">
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'
//import { ajax } from '@/api' 
import {ref,nextTick} from "vue"
import {NSpin ,NEmpty,NImage } from 'naive-ui' 
//import {copyText3} from "@/utils/format";
//import { copyText } from 'vue3-clipboard'
//import { copyToClip } from "@/utils/copy";
//import AiMsg from "@/views/aidutu/aiMsg.vue";
import { homeStore ,useChatStore} from "@/store"
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { ViewCard } from 'vue-waterfall-plugin-next/dist/types/types/waterfall'
import { getMjAll, localGet, mlog } from '@/api'
 
const chatStore = useChatStore()

const { isMobile } = useBasicLayout()

const emit = defineEmits(['close']);
//import {hom}

const st =ref({show:true
,showImg:''
});

const showImg= ref<typeof NImage>();
 

const list = ref<ViewCard[]>([])

const breakpoints= {
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

const loadImg= async ( )=>{
    let d = await getMjAll( chatStore.$state);
    if( !d || d.length==0 ) return;
   //mlog('loadImg', d );
    
    let rz = d.filter((v:any)=>  v.opt && v.opt.imageUrl ).map((v:any)=>{
        //mlog('vv', v.opt.imageUrl); 
        // let key= 'img:'+v.mjID;
        //  let base64 = await loca(key );  
        return {
            mjID: v.mjID,
            src: v.opt.imageUrl,isLoad:0, prompt: v.opt.promptEn,
            image_url: v.opt.imageUrl 
        }
    });
    list.value=[];
    for(let v of rz ){
        let key= 'img:'+v.mjID;
        try{
            let base64 = await localGet(key ); 
            if( base64 ) v.image_url =base64;
        }catch(e){  }
        list.value.push(v );
    }

   // list.value
    
    // ajax({  url: '/chatgpt/mj/gallery' })
    //     .then((d) => {
    //         // st.value.style= d.data.style
    //         // st.value.example= d.data.example
    //         console.log(d)
    //         list.value= d.data.images.map((v:any)=>{ 
    //             v.isLoad=0
    //             return  v;
    //         })
    //     } )

}
const goShow=( item:any)=>{
    //console.log('goShow', isMobile );
    if( isMobile.value)   return ; 
    st.value.show= true;
    st.value.showImg= item.image_url;
    //console.log('goShow', item);
    nextTick(() => showImg.value?.click());
}
// function copy( item:any){ 
//   //console.log('copy', item.prompt );
// 	//copyText3(  item.prompt ).then(()=>msgRef.value.showMsg('复制成功！'));
//   homeStore.setMyData({act:'copy',actData: {text: item.prompt } });
// 	//copyToClip(  item.prompt ).then(()=>msgRef.value.showMsg('复制成功！'));
// }
 

//画同款
const same=( item:any,act:string)=>{
  //console.log('same',item);
  homeStore.setMyData({act,actData: JSON.parse(JSON.stringify(item) ) }); //:'same'
  emit('close');
}
loadImg();

</script>
<template>
 
 <Waterfall :list="list" :breakpoints="breakpoints"  class=" !bg-transparent" v-if="list.length">
  <template #item="{ item, url, index }">
    <div class="bg-white dark:bg-[#24272e] rounded-md   overflow-hidden cursor-pointer group/item relative">
      <LazyImg :url="item.image_url"  @success="item.isLoad=1" @click="goShow(item )" />
      <!-- <LazyImg :url="item.image_hd_url"  @success="item.isLoad=1" /> -->
      <div class="absolute top-0 left-0 right-0 bottom-0" v-if="item.isLoad==0">
        <div class="flex justify-center items-center w-full h-full">
            <n-spin size="large" />
        </div>
      </div>
      <div class="absolute w-full bottom-0   backdrop-blur-sm text-white/70 invisible group-hover/item:visible ">
        <div class="p-3">
            <div class="line-clamp-2 text-[13px]">{{ item.prompt }}</div>
            <div class="space-x-2">
                
                <!-- <NButton type="primary" size="small" @click="copy(item )" >复制</NButton> -->

                <!-- <NButton type="primary" size="small" @click="same(item,'same2' )" >引用</NButton>
                <NButton type="primary" size="small"  @click="same(item,'same' )">画同款</NButton> -->
                 
            </div>
        </div>
      </div>
      <!-- <p class="text">这是具体内容</p> -->
    </div>
  </template>
</Waterfall>
<div v-else class="w-full h-full flex justify-center items-center">
    <n-empty description="画廊还没有您的作品" />
</div>


<NImage   :src="st.showImg"  ref="showImg" v-if="st.showImg" :width="1" />
 <!-- <NButton type="primary" size="small" @click="copy2('abdd' )" >复制</NButton> -->

<!-- <div @click="copy2('abdd' )">复制测试</div> -->
</template>

<style>
.lazy__img[lazy=loading] {
  padding: 5em 0;
  width: 48px;
}

.lazy__img[lazy=loaded] {
  width: 100%;
}

.lazy__img[lazy=error] {
  padding: 5em 0;
  width: 48px;
}
</style>