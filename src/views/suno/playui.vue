<script setup lang="ts">
import { mlog } from '@/api';
import { homeStore } from '@/store';
import { ref ,watch} from 'vue'
import { NSlider } from 'naive-ui';
const sp= ref({v:10, max:0 ,status:'',idDrop:false });
const updatev=(v:number)=>{
    homeStore.setMyData({act:'playUpdate',actData:{ v}})
}

const $emit= defineEmits(['update'] );
 

watch(()=>homeStore.myData.act2, (n)=>{
    if(n=='playStatus'){
        if( sp.value.idDrop ) return
       let data:any = homeStore.myData.actData
        mlog('playStatus' , data );
        if(data && data.d && data.d.duration  ){
            sp.value.max = data.d.duration
            sp.value.v = data.d.currentTime ;// parseInt( data.d.currentTime ) 
           
        }
        if( data )   sp.value.status = data.a 
        $emit('update', sp.value)
       

    }
})
watch(()=>homeStore.myData.act, (n)=>{
     if(n=='playStatus'){
         let data:any = homeStore.myData.actData
         if(data)   sp.value.status = data.a 
          $emit('update', sp.value)
     }
});

</script>
<template>
<div class="sss"    style="--n-rail-height:2px">
<n-slider :on-dragend="()=>sp.idDrop=false" :on-dragstart="()=>sp.idDrop=true" 
            class="w-full" v-model:value="sp.v" :step="1" v-if="sp.max" :max="sp.max" 
            :on-update:value="updatev"
            :format-tooltip="(v)=>v.toFixed(1)+'s'" />
</div>
</template>
<style>
.sss .n-slider .n-slider-rail{
    height: 2px!important;
}
.sss .n-slider-handle{
height: 12px!important;
width: 12px!important;
 }
</style>