<script lang="ts" setup>
import { localGet, mlog } from '@/api';
import { ref } from 'vue'
import {NImage} from 'naive-ui'
const pp = defineProps<{image:string}>();
const images =ref([]);
const load= ()=>{
    localGet(pp.image).then(r=>{
        //images.value= JSON.parse(r);
        if(r){
           // mlog('load', r); 
            images.value= JSON.parse(r);
        }
    }).catch(e=>{})
}
load();
</script>
<template>
<div v-if="images.length" class="flex flex-wrap justify-start items-baseline">
          <div v-for="(img,k ) of  images" :key="k" class="p-1" >
            <NImage :src="img" preview class="w-[130px] rounded" />
          </div>
      </div>
</template>