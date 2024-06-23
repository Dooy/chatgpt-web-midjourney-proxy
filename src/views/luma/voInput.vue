<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { NInput,NButton, useMessage,NTag } from 'naive-ui';
import {SvgIcon} from '@/components/common'
import { FeedLumaTask, lumaFetch, mlog, upImg } from '@/api';
import { homeStore } from '@/store';
import { t } from '@/locales';

const luma= ref({ "aspect_ratio": "16:9", "expand_prompt": true,  "image_url": "",  "user_prompt": "" });
const st= ref({isDo:false})
const ms = useMessage();
const fsRef= ref() ;
onMounted(() => {
    homeStore.setMyData({ms:ms})
});

const canPost = computed(() => {
    return luma.value.user_prompt!='' && !st.value.isDo
})
const generate= async ()=>{
    mlog("generate", luma.value )
    st.value.isDo= true
    if(!canPost){
        ms.error( t('video.plsInput') )
        return ;
    }
    try{
        const d:any=  await lumaFetch('/generations/', luma.value);
        mlog("d", d )
        if(d.id ) FeedLumaTask(d.id )
        else FeedLumaTask(d[0].id )
        ms.success( t('video.submitSuccess'))
    }catch(e){
        
    }
    st.value.isDo= false
    //FeedLumaTask('33ace512-9a46-40ab-9d08-a05eff989831')
}

function selectFile(input:any){
     
    upImg(input.target.files[0]).then(d=>{
        luma.value.image_url= d;
        fsRef.value=''
    }).catch(e=>ms.error(e));
    
}

const clearInput = ()=>{
    luma.value.user_prompt= ''
    luma.value.image_url= ''
}
 
</script>

<template>
<div class="p-2"> 
    <div>
      <n-input v-model:value="luma.user_prompt" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </div>
    
    <div class="pt-1">
        <div class="flex justify-between  items-end">
            <div> 
                <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                    <img :src="luma.image_url" v-if="luma.image_url" />
                    <div class="text-center" v-else>{{ $t('video.selectimg') }}</div> 
                </div>
            </div>
            <div>
                <div class="pb-1 text-right">
                  <NTag v-if="luma.user_prompt!=''||luma.image_url!=''" type="success" size="small" round  ><span class="cursor-pointer" @click="clearInput()" >{{$t('video.clear')}}</span></NTag>
                </div>
                <div>
                    <NButton :loading="st.isDo" type="primary" :disabled="!canPost" @click="generate()"><SvgIcon icon="ri:video-add-line"  /> {{$t('video.generate')}}</NButton> 
                </div>
            </div>
        </div>
    </div>    
</div>
</template>