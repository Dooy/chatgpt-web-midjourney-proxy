<script setup lang="ts">
import {watch,ref  } from 'vue'
import {SunoMedia} from '@/api/sunoStore';
import { homeStore } from '@/store';
import { NImage,NEmpty } from 'naive-ui';
import {SvgIcon} from '@/components/common'
import { udioTask } from '@/api/udioStore';

//const pObj= ref<SunoMedia>()
const pObj= ref({image_large_url:'',title:'',tags:'',prompt:'' })
watch(()=>homeStore.myData.act, (n)=>{
    if(n=='goPlay'){
        let data = homeStore.myData.actData 
        const a = data as SunoMedia
        pObj.value.image_large_url= a.image_large_url
        pObj.value.tags= a.metadata.tags??''
        pObj.value.prompt= a.metadata.prompt??''
        pObj.value.title= a.title
        
    } 
    if( n=="goPlayUdio"){
         let data = homeStore.myData.actData
        //mlog('goPlayUdio' , data );
        let a = data as udioTask
        pObj.value.image_large_url= a.image_path
        pObj.value.tags= a.tags?a.tags.join(','):''
        pObj.value.prompt= a.lyrics || a.prompt
        pObj.value.title= a.title
    }
})
</script>
<template>
<div v-if="pObj.title||pObj.image_large_url">
    <div class="w-full  relative h-[300px]">
        <NImage :src="pObj.image_large_url" class="w-full h-full">
             <template #placeholder>
                      <div class="w-full h-full justify-center items-center flex"  >
                       <SvgIcon icon="line-md:downloading-loop" class="text-[60px] text-green-300"   ></SvgIcon>
                      </div>
                </template>
        </NImage>
        <div class="absolute bottom-0 right-0 p-2 text-white text-right"> 
            <h2 class=" text-xl">{{ pObj.title }}</h2>
            <div class="">{{$t('suno.style')}}：{{ pObj.tags }}</div>
        </div>
    </div>
   
    <pre class=" whitespace-pre-wrap p-2">{{ pObj.prompt }}</pre>
</div>
<div class=" flex w-full h-full justify-center items-center" v-else >
    <n-empty :description="$t('suno.emputy')" ></n-empty>
</div>

</template>