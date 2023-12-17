<script lang="ts" setup>
import { ref,watch  } from "vue";
import gallery from './aiGalleryItem.vue'
import { homeStore } from "@/store";
import { useRoute } from 'vue-router';
import {NDrawerContent, NDrawer} from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout' 
//import { copyText3 } from "@/utils/format";
const { isMobile } = useBasicLayout()
const route = useRoute();
const st= ref({'show':false,showImg:false})
const initLoad=()=>{
    //gallery
    console.log('toGallery', route.query  );
    // if( _GET('to') =='gallery'){
    //     homeStore.setMyData({act:'gallery'})
    // }
}
watch(() =>  homeStore.myData.act, (act) =>{
  act=='gallery' && (st.value.showImg=true);
  //act=='copy' &&   copyText3('addd890').then(dd=>console.log('ddd',dd ) );
  })

initLoad();
</script>

<template>
<n-drawer v-model:show="st.showImg" :placement="isMobile?'bottom':'right'"  :class="isMobile?['!h-[90vh]']: ['!w-[80vw]']" style="--n-body-padding:0">
    <n-drawer-content title="我的画廊" closable>
      <gallery @close="st.showImg=false" v-if="st.showImg"/>
    </n-drawer-content>
</n-drawer>
</template>