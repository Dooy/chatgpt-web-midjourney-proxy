<script setup lang="ts">
import { SvgIcon } from '@/components/common';
import { homeStore } from '@/store'
import { computed,watch ,ref  } from 'vue'
import { router } from '@/router'

import aiDrawInput from './aiDrawInput.vue'; 
import {NDrawerContent,NDrawer} from "naive-ui";
import { isDisableMenu } from '@/api';
const st= ref({show:true})

const goHome =computed(  () => {
  //router.push('/')
  return router.currentRoute.value.name
});
function drawSent(e:any){
  st.value.show=false;
  //$emit('drawSent', e)
  homeStore.setMyData({act:'draw',actData:e});
}

watch(()=>homeStore.myData.act, (n:string)=>{
    if('showChat'==n){
        router.push('/chat')
    }
    if('showDraw'==n){
        router.push('/draw')
        st.value.show=true;
    }
    if(n=='draw'){
       st.value.show=false;
    }
});
</script>
<template>
  <div class=" bg-gray-100 dark:bg-[#282832] h-[55px] flex  justify-around  items-center dark:text-white/70 " >
      <div class="flex items-center justify-center flex-col"  @click="homeStore.setMyData({act:'showChat'}) "   :class="[ goHome =='Chat' ? 'active' : '']" >
        <SvgIcon icon="ri:wechat-line" class="text-3xl"></SvgIcon>
        <div class="text-[13px]">{{$t('mjtab.chat')}}</div>
      </div>
      <div  v-if="!isDisableMenu ( 'gpts')"  class="flex items-center justify-center flex-col "  @click="homeStore.setMyData({act:'showgpts'}) " >
        <SvgIcon icon="ri:apps-fill" class="text-3xl"></SvgIcon>
        <div class="text-[13px]">GPTs</div>
      </div>
		
           <a :href="`https://api.raojialong.space/topup`" class="flex items-center justify-center flex-col">
      <SvgIcon icon="whh:spiderman" class="text-3xl"></SvgIcon>
      <div class="text-[13px]">控制台</div>
    </a>

		<div v-if="!isDisableMenu ( 'draws')" class="flex items-center justify-center flex-col "  @click="homeStore.setMyData({act:'showDraw'}) " :class="[goHome=='draw' ? 'active' : '']" >
        <SvgIcon icon="ic:outline-palette" class="text-3xl"></SvgIcon>
        <div class="text-[13px]">{{$t('mjtab.draw')}}</div>
      </div>
		
		<a v-if="!isDisableMenu ( 'music')"      @click="st.active='music'; urouter.push('/music')" class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
             >
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger> 
                    <div  class="flex  h-full justify-center items-center py-1 flex-col " :class="[ goHome =='music' ? 'active' : '']">
                      <SvgIcon icon="arcticons:wynk-music" class="text-3xl flex-1"></SvgIcon>
                      <span class="text-[10px]">{{ $t('suno.menu') }}</span>
                    </div>  
                  </template>
                    {{ $t('suno.menuinfo') }}
                </n-tooltip>                
            </a>

            <a v-if="!isDisableMenu ( 'video')"      @click="st.active='video'; urouter.push('/video')" 
                class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]">
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger> 
                    <div  class="flex  h-full justify-center items-center py-1 flex-col " :class="[ goHome =='video' ? 'active' : '']">
                      <SvgIcon icon="ri:video-on-line" class="text-3xl flex-1"></SvgIcon>
                      <span class="text-[10px]">{{ $t('video.menu') }}</span>
                    </div>  
                  </template>
                    {{ $t('video.menuinfo') }}
                </n-tooltip>                
            </a>


            <a v-if="!isDisableMenu ( 'dance')"      @click="st.active='dance'; urouter.push('/dance')" 
                class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]">
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger> 
                    <div  class="flex  h-full justify-center items-center py-1 flex-col " :class="[ goHome =='dance' ? 'active' : '']">
                      <SvgIcon icon="mdi:dance-ballroom" class="text-3xl flex-1"></SvgIcon>
                      <span class="text-[10px]">{{ $t('dance.menu') }}</span>
                    </div>  
                  </template>
                    {{ $t('dance.menuinfo') }}
                </n-tooltip>                
            </a>

      
      <div  v-if="!isDisableMenu ( 'gallery')"  class="flex items-center justify-center flex-col " @click="homeStore.setMyData({act:'gallery'})" >
        <SvgIcon icon="material-symbols:imagesmode-outline" class="text-3xl"></SvgIcon>
        <div class="text-[13px]">{{$t('mjtab.gallery')}}</div>
      </div> 
  </div>

  <n-drawer v-model:show="st.show"  class="!h-[90vh] !max-h-[660px]"     placement="bottom" v-if="goHome=='draw'">
    <n-drawer-content   style="--n-body-padding:0" class="h-full">
      <aiDrawInput @draw-sent="drawSent" @close="st.show=false"  />
    </n-drawer-content>
  </n-drawer>
</template>
