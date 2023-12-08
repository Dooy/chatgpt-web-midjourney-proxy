<script setup lang="ts">
import { NDrawer,NDrawerContent } from "naive-ui";
import { ref, watch } from "vue";
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { homeStore } from "@/store";
import AiGptsCom from "./aiGptsCom.vue";
const { isMobile } = useBasicLayout()

const st =ref({showImg:false});
watch(()=>homeStore.myData.act, (n)=>{
    if(n=='showgpts')   st.value.showImg=true;
})
</script>
<template>
 <n-drawer v-model:show="st.showImg" :placement="isMobile?'bottom':'right'"  :class="isMobile?['!h-[90vh]']: ['!w-[80vw]']" style="--n-body-padding:0">
    <n-drawer-content title="GPT store" closable>
      <AiGptsCom @close="st.showImg=false" />
    </n-drawer-content>
</n-drawer>
</template>