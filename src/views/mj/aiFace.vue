<script setup lang="ts">
import { ref } from 'vue';
import {useMessage, NButton} from 'naive-ui';
import {upImg} from '@/api'
import { homeStore } from '@/store';
const ms = useMessage();
const fsRef= ref() ;
const st= ref({status:'',isGo:false})
const f= ref({sourceBase64:'',targetBase64:''});
function selectFile(input:any){
     
    upImg(input.target.files[0]).then(d=>{
        if(st.value.status=='target') f.value.targetBase64=d;
        else f.value.sourceBase64= d ; 
         st.value.isGo=true;
        //if(st)
    }).catch(e=>ms.error(e));
    
}
const send=()=>{
    if( f.value.targetBase64 && f.value.sourceBase64){
        let obj={
            action:'face',
            version:1, 
            data:f.value
        }
        homeStore.setMyData({act:'draw',actData:obj});
        st.value.isGo=false;
    }
}
</script>
<template>
<input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>

<div class="flex justify-around items-center">
    <div class="h-[80px] w-[80px] rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click="(st.status='source') && fsRef.click()">
        <img :src="f.sourceBase64" v-if="f.sourceBase64" />
        <div class="text-center" v-else>{{ $t('mjchat.yourHead') }}</div> 
    </div>
    <div>+</div>
    <div class="h-[80px] w-[80px] rounded-sm border border-gray-400/20  flex justify-center items-center cursor-pointer"  @click="(st.status='target') && fsRef.click()">
         <img :src="f.targetBase64" v-if="f.targetBase64"/>
        <div class="text-center" v-else>{{ $t('mjchat.your2Head') }}</div> 
    </div>
</div>
<div   class="flex justify-center pt-5"><NButton @click="send" type="primary" :disabled="!st.isGo">{{ $t('mjchat.submit') }}</NButton> </div>
<ul class="pt-4" v-html="$t('mjchat.tipInfo')">
    
</ul>
</template>