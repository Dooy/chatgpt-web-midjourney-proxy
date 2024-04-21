<script setup lang="ts">
import {watch,ref  } from 'vue'
import {SunoMedia} from '@/api/sunoStore';
import { homeStore } from '@/store';
import { NImage,NEmpty } from 'naive-ui';
import {SvgIcon} from '@/components/common'

const pObj= ref<SunoMedia>()
watch(()=>homeStore.myData.act, (n)=>{
    if(n=='goPlay'){
        let data = homeStore.myData.actData 
        pObj.value = data as SunoMedia
        

    }
})
</script>
<template>
<div v-if="pObj">
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
            <div class="">{{$t('suno.style')}}：{{ pObj.metadata.tags }}</div>
        </div>
    </div>
   
    <pre class=" text-wrap p-2">{{ pObj.metadata.prompt }}</pre>
</div>
<div class=" flex w-full h-full justify-center items-center" v-else >
    <n-empty :description="$t('suno.emputy')" ></n-empty>
</div>

</template>