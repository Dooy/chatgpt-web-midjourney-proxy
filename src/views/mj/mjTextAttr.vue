<script lang="ts" setup>
import { localGet } from '@/api';
import { ref } from 'vue'
import {NImage} from 'naive-ui'
import { SvgIcon } from '@/components/common';


const pp = defineProps<{image:string}>();
const images =ref([]);
const load= ()=>{
    localGet(pp.image).then((r:any)=>{
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
            <NImage :src="img" preview class=" rounded" :class="[images.length<=1?'w-[330px]':'w-[130px]']" >
                <template #placeholder>
                 <a class="w-full h-full flex items-center justify-center  text-neutral-500" :href="img" target="_blank" >
                    <SvgIcon icon="mdi:download" />{{$t('mjchat.attr')}} {{ k+1 }}
                </a>
                </template>
            </NImage>
          </div>
      </div>
</template>