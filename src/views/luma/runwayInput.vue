<script setup lang="ts">
import { mlog, upImg } from '@/api';
import { runwayFetch, runwayUpload } from '@/api/runway';
import { homeStore } from '@/store';
import { useMessage,NInput } from 'naive-ui';
import { onMounted, ref } from 'vue';

const fsRef= ref() ;
const runway= ref({image_prompt:'',seed:1675247627,text_prompt:''});

const ms = useMessage();
async function  selectFile(input:any){
    mlog("selectFile", input.target.files[0])
    const file = input.target.files[0]  

    // let obj={
    // "filename": file.name,
    // "numberOfParts": 1,
    // "type": "DATASET_PREVIEW"
    // }
    let d= await runwayUpload('/uploads','DATASET_PREVIEW')
    mlog("runwayFetch",d)
    // upImg(input.target.files[0]).then(d=>{
    //     //luma.value.image_end_url= d;
    //     fsRef.value=''
    // }).catch(e=>ms.error(e));
    
}


onMounted(() => {
    homeStore.setMyData({ms:ms})
});
</script>
<template>
<div class="px-2"> 
    <div class="pt-1">
      <n-input v-model:value="runway.text_prompt" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </div>

    <div class="pt-1">
        <div class="flex justify-start  items-end">
            <div> 
                <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                    <!-- <img :src="luma.image_url" v-if="luma.image_url" /> -->
                    <div class="text-center"  >{{ $t('video.selectimg') }}</div> 
                </div>
            </div>
        </div>
    </div>
</div>
</template>