<script setup lang="ts">
import { NDrawer,NDrawerContent,NInput } from "naive-ui";
import { ref, watch } from "vue";
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { homeStore } from "@/store";
import AiGptsCom from "./aiGptsCom.vue";
import { SvgIcon } from "@/components/common";
const { isMobile } = useBasicLayout()
const qref= ref();
const st =ref({showImg:false,q:''});
watch(()=>homeStore.myData.act, (n)=>{
    if(n=='showgpts')   st.value.showImg=true;
})
const search=()=>{
    if(!st.value.q ) return ;
    qref.value.searchQ(st.value.q);
 }
const toq=( d:any )=>{
    st.value.q= d.q;
}
</script>
<template>
 <n-drawer v-model:show="st.showImg"   :placement="isMobile?'bottom':'right'"  :class="isMobile?['!h-[90vh]']: ['!w-[80vw]']" style="--n-body-padding:0">
    <n-drawer-content  class="mydrawer" :closable="isMobile">
      <template #header>
        <div class="flex justify-between items-center w-full">
        <!-- <SvgIcon icon="uil:search" class="pr-2 text-[28px] cursor-pointer"></SvgIcon> GPT store -->
        <div class="pr-4">GPT store</div>
        <div class=" max-w-[400px]">
            <n-input round :placeholder="$t('mjchat.searchPlaceholder')" clearable v-model:value="st.q" @keydown.enter="search()" >
                <template #prefix>
                    <SvgIcon icon="uil:search"/>
                </template>
                <template #suffix>
                    <div class="cursor-pointer" @click="search()">{{ $t('mjchat.search')}}</div>
                </template>
            </n-input>
        </div>
        </div>
      </template>
      <AiGptsCom @close="st.showImg=false" ref="qref" :q="st.q" @toq="toq" />
    </n-drawer-content>
</n-drawer>
</template>
<style>
.mydrawer .n-drawer-header__main{
 @apply flex-1;
}
</style>