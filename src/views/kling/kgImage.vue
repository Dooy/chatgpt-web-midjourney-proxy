<script setup lang="ts">
import { localGet, mlog, url2base64 } from '@/api';
import { ref } from 'vue';
import { LazyImg } from 'vue-waterfall-plugin-next'
const pp= defineProps<{item:any}>();
const emit= defineEmits(['kgSuccess','kgClick']);

const st= ref({uri_base64:'',isLoad:false})


const load = async ()=>{
     mlog('kg-Image', pp.item  );

      
     if( pp.item.task && pp.item.task.request_id && pp.item.src){
       
     
        let key= 'kg:'+pp.item.task.request_id;
         mlog('key>> ',  key );  
        try {
            let base64 = await localGet(key );  
            if(!base64) {
                const ubase64=  await url2base64(`https://wsrv.nl/?url=${encodeURIComponent(pp.item.src)}`  ,key );
                base64= ubase64.base64;
                mlog('图片已保存>>', ubase64.key )
            }
            if(base64) st.value.uri_base64= base64 as string;
            
        } catch (error) {
            mlog('图片保存失败',error);
        }
     }

      mlog('图片已保存>>',   st.value.uri_base64  )

     st.value.isLoad= true
    
    

  
}
load();
</script>

<template>
<LazyImg :url="st.uri_base64?st.uri_base64:pp.item.src" v-if="st.isLoad"  @success="emit('kgSuccess')"  @click="emit('kgClick', {base64:st.uri_base64, src:pp.item.src} )"  />
</template>