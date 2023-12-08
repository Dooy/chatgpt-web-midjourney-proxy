<script setup lang="ts">
import { computed,defineAsyncComponent ,ref} from "vue";
import { SvgIcon ,HoverButton} from '@/components/common'
import { useBasicLayout } from '@/hooks/useBasicLayout'
const { isMobile } = useBasicLayout()
import { NAvatar,NTooltip } from 'naive-ui'
import { homeStore, useUserStore } from '@/store'
 
//import gallery from '@/views/gallery/index.vue'

const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'))
const userStore = useUserStore()

const st= ref({'show':false,showImg:false, menu:[],active:'chat'})


const userInfo = computed(() => userStore.userInfo)
import { router } from '@/router'
import { mlog } from "@/api";

const goHome =computed(  () => {
  //router.push('/')
  return router.currentRoute.value.name
});
//mlog('g', goHome() );
</script>
<template>
<div class="flex-shrink-0 w-[60px] z-[1000]  h-full" v-if="!isMobile">
    <div class="flex h-full select-none flex-col items-center justify-between bg-[#e8eaf1] px-2 pt-4 pb-8 dark:bg-[#25272d]">
        <div class="flex flex-col space-y-4 flex-1">
            <a href="#/chat"    @click="st.active='chat'" class="router-link-active router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]">
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger> 
                    <div  class="flex h-full justify-center items-center py-1 flex-col " :class="[ goHome =='Chat' ? 'active' : '']">
                    <SvgIcon icon="ri:wechat-line" class="text-3xl  flex-1"></SvgIcon>
                     <span class="text-[10px]">对话</span>
                    </div>
                 </template>
                AI Chat
                </n-tooltip>
            </a>

            <a href="#/draw" @click="st.active='draw'" class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]">
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger> 
                    <div  class="flex h-full justify-center items-center   py-1 flex-col" :class="[goHome=='draw' ? 'active' : '']">
                    <SvgIcon icon="ic:outline-palette" class="text-3xl flex-1"></SvgIcon>
                     <span class="text-[10px]">绘画</span>
                    </div> 
                  </template>
                    AI绘画 Midjourney引擎
                </n-tooltip>
            </a>


            <a   @click="homeStore.setMyData({act:'showgpts'}) " class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]">
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger> 
                    <div  class="flex h-full justify-center items-center   py-1 flex-col" >
                    <SvgIcon icon="ri:apps-fill" class="text-3xl flex-1"></SvgIcon>
                     <span class="text-[10px]">GTPs</span>
                    </div> 
                  </template>
                    ChatGPT Store 
                </n-tooltip>
            </a>

            <!-- <section  class=" router-link-exact-active h-12 w-12 cursor-pointer rounded-xl bg-white duration-300 dark:bg-[#34373c] hover:bg-[#bbb] dark:hover:bg-[#555]"
             >
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger> 
                    <div  class="flex  h-full justify-center items-center py-1 flex-col ">
                      <SvgIcon icon="mingcute:grid-2-line" class="text-3xl flex-1"></SvgIcon>
                      <span class="text-[10px]">画廊</span>
                    </div>  
                  </template>
                    画廊:看看别人是如何画的
                </n-tooltip>                
            </section> -->

             

        </div>
        <div class="flex flex-col  space-y-2 "> 

            
            <NAvatar  size="large"  round  :src="userInfo.avatar"   v-if="userInfo.avatar"
             class=" cursor-pointer"  />
            
            <HoverButton>
                <div class="text-xl text-[#4f555e] dark:text-white flex h-full justify-center items-center "  @click="st.show = true">
                    <SvgIcon icon="ri:settings-4-line" />
                </div>
            </HoverButton>
        </div>
    </div>
</div>
 <Setting v-if="st.show" v-model:visible="st.show" />

 <!-- <n-drawer v-model:show="st.showImg" :placement="isMobile?'bottom':'right'"  :class="isMobile?['!h-[90vh]']: ['!w-[80vw]']" style="--n-body-padding:0">
    <n-drawer-content title="GPT store" closable>
      sdsd 
    </n-drawer-content>
</n-drawer> -->
</template>

 