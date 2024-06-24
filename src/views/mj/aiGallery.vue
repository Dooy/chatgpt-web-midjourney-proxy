<script lang="ts" setup>
import { ref,watch,computed  } from "vue";
import gallery from './aiGalleryItem.vue'
import { homeStore } from "@/store";
import { useRoute } from 'vue-router';
import {NDrawerContent, NDrawer} from 'naive-ui'
import { useBasicLayout } from '@/hooks/useBasicLayout' 
import { mlog } from "@/api";
//import { copyText3 } from "@/utils/format";
const { isMobile } = useBasicLayout()
const route = useRoute();
const st= ref({'show':false,showImg:false})
const initLoad=()=>{
    //gallery
    mlog('toGallery', route.query  );
    mlog('toGallery',  homeStore.myData.session  );
    if( homeStore.myData.session.baiduId ) tjBaidu( homeStore.myData.session.baiduId );
    if( homeStore.myData.session.googleId ) tjGoogle( homeStore.myData.session.googleId );
    // if( _GET('to') =='gallery'){
    //     homeStore.setMyData({act:'gallery'})
    // }
}
watch(() =>  homeStore.myData.act, (act) =>{
  act=='gallery' && (st.value.showImg=true);
  //act=='copy' &&   copyText3('addd890').then(dd=>console.log('ddd',dd ) );
  })

const tjBaidu= (baiduID:string )=>{ 
   window._hmt=window._hmt || [];
   let  hm = document.createElement("script");
   hm.src = "https://hm.baidu.com/hm.js?"+baiduID;
   let s = document.getElementsByTagName("script")[0] as HTMLScriptElement;
   s.parentNode && s.parentNode.insertBefore(hm, s);
   mlog('tjBaidu', hm.src  );
  
}
const tjGoogle= ( googleId:string )=>{
  window.dataLayer = window.dataLayer || [];
  let  hm = document.createElement("script");
  hm.src = "https://www.googletagmanager.com/gtag/js?id="+googleId;
  let s = document.getElementsByTagName("script")[0] as HTMLScriptElement;
  s.parentNode && s.parentNode.insertBefore(hm, s); 
  function gtag(...arg:any ){ window.dataLayer.push(arguments);}
  gtag('js', new Date()); 
  gtag('config',  googleId );
}

//const baiduID= computed(()=>homeStore.myData.session.baiduID );
 
initLoad();
</script>

<template>
<n-drawer v-model:show="st.showImg" :placement="isMobile?'bottom':'right'"  :class="isMobile?['!h-[80vh]']: ['!w-[80vw]']" style="--n-body-padding:0">
    <n-drawer-content :title="$t('mjchat.myGallery')" closable>
      <gallery @close="st.showImg=false" v-if="st.showImg"/>
    </n-drawer-content>
</n-drawer>

<!-- <template v-if="baiduID">
  <script>
		 window._hmt=window._hmt || [];
   var hm = document.createElement("script");
   hm.src = "https://hm.baidu.com/hm.js?"+baiduID;
   var s = document.getElementsByTagName("script")[0];
   s.parentNode.insertBefore(hm, s);
	</script>
</template> -->
</template>