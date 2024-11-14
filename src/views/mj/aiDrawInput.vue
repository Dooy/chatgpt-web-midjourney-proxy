<script setup lang="ts">
import { NTabs,NTabPane } from 'naive-ui';
import aiDrawInputItem from './aiDrawInputItem.vue'
import aiFace from './aiFace.vue'
import aiBlend from './aiBlend.vue'
import aiDall from './aiDall.vue'
import aiIdeoInput from './aiIdeoInput.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { SvgIcon } from '@/components/common'
import { onMounted, ref, watch } from 'vue';
import { gptServerStore } from '@/store';
import { mlog } from '@/api';
import { useRoute } from 'vue-router'; 

const route = useRoute(); // 获取当前路由对象

const $emit=defineEmits(['drawSent','close']);
const drawSent=(d:any )=> $emit('drawSent',d);
const {isMobile}= useBasicLayout()

const st= ref({drawType:'draw',tab:''});

onMounted(()=>{
  //st.value.drawType='draw'
  if(gptServerStore.myData.DRAW_TYPE) st.value.drawType=gptServerStore.myData.DRAW_TYPE
})

// watch(()=>st.value.drawType, (n:string)=> {
//   mlog('st.value.drawType',n)
//   gptServerStore.setMyData({DRAW_TYPE:n})
// } )

const handleUpdateValue=(v:string)=>{
   //mlog("handleUpdateValue",v)
   gptServerStore.setMyData({DRAW_TYPE:v})
}
const initLoad=()=>{
    if(route.query.tab){
        st.value.tab= 'midjourney'//route.query.tab as string;
        let tt= (route.query.tab as string).toLocaleLowerCase();
        if( ['dall.e','ideogram'].indexOf(tt)>-1 ){
           st.value.tab=tt;
        }
        handleUpdateValue(   st.value.tab )
    }
    else st.value.tab=( gptServerStore.myData.DRAW_TYPE?gptServerStore.myData.DRAW_TYPE:'midjourney')
}
initLoad();

</script>
<template>
<div class="overflow-y-auto bg-[#fafbfc] pt-2 dark:bg-[#18181c] h-full ">
 
<n-tabs type="line" animated :default-value="st.tab" @update:value="handleUpdateValue"  >
    <n-tab-pane name="start" tab=""> 

    </n-tab-pane>
    <n-tab-pane name="midjourney" tab="MidJourney" >
      <!--  -->
    <n-tabs type="segment" animated   default-value="draw23" size="small">
        <n-tab-pane name="draw23" :tab="$t('mjchat.draw')">
          <aiDrawInputItem @draw-sent="drawSent" @close="$emit('close')"></aiDrawInputItem>
        </n-tab-pane>
        <!-- <n-tab-pane name="chap2" tab="第二章">2</n-tab-pane>
        <n-tab-pane name="chap3" tab="第三章">3</n-tab-pane> -->
        <n-tab-pane name="face" :tab="$t('mjchat.face')">
          <div class="p-4"><aiFace  /></div>
        </n-tab-pane>
        <n-tab-pane name="blend" :tab="$t('mjchat.blend')">
          <div class="p-4"><aiBlend  /></div>
        </n-tab-pane>
    </n-tabs>

    </n-tab-pane>
    
    <n-tab-pane name="dall.e" tab="Dall.E">
     <div class="p-4"><aiDall  /></div>
    </n-tab-pane>

    <n-tab-pane name="ideogram" tab="IdeoGram">
     <div class="p-2"> <aiIdeoInput/> </div>
    </n-tab-pane> 
    


    <n-tab-pane name="Close" v-if="isMobile" >
      <template #tab>
      <div class=" text-center flex justify-center items-center"   @click="$emit('close')"  ><SvgIcon icon="ri:close-circle-line"></SvgIcon></div>
      </template>
      <div class="p-4"> 
        <div   @click="$emit('close')" class=" justify-center items-center flex">
            <SvgIcon icon="ri:close-circle-line"></SvgIcon> Close By Click me 
        </div>
      </div>
    </n-tab-pane>

</n-tabs> 
</div>
</template>