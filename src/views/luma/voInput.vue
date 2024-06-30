<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { NInput,NButton, useMessage,NTag ,NPopover} from 'naive-ui';
import {SvgIcon} from '@/components/common'
import { FeedLumaTask, lumaFetch, mlog, upImg } from '@/api';
import { homeStore } from '@/store';
import { t } from '@/locales';
import { LumaMedia } from '@/api/lumaStore';

const luma= ref({ "aspect_ratio": "16:9", "expand_prompt": true,  "image_url": "",  "user_prompt": "" });
const st= ref({isDo:false})
const ms = useMessage();
const fsRef= ref() ;
const exLuma= ref<LumaMedia>()

const vf=[{s:'width: 100%; height: 100%;',label:'1:1'}
,{s:'width: 100%; height: 75%;',label:'4:3'}
,{s:'width: 75%; height: 100%;',label:'3:4'}
,{s:'width: 100%; height: 50%;',label:'16:9'}
,{s:'width: 50%; height: 100%;',label:'9:16'}
 ];

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
        let url= '/generations/';
        if(exLuma.value) url= `/generations/${exLuma.value.id}/extend`
        const d:any=  await lumaFetch(url, luma.value);
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
    exLuma.value= undefined
}

//luma.extend
watch(()=>homeStore.myData.act, (n)=>{
    if(n=='luma.extend'){
        mlog("luma.extend", homeStore.myData.actData )
        const s= homeStore.myData.actData as LumaMedia
        exLuma.value= s 
        // cs.value.continue_clip_id= s.id
        // cs.value.continue_at= Math.ceil(s.metadata.duration/2) 
    }
});
</script>

<template>
<div class="p-2"> 
    <div class=" flex items-center justify-between space-x-1">
            <template  v-for="(item,index) in vf" >
            <section class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"  :class="{'active':luma.aspect_ratio==item.label}"  @click="luma.aspect_ratio=item.label">
                <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
                    <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
                </div>
                <p class="mb-1 text-center text-sm">{{ item.label }}</p>
            </section>
            </template>

    </div>
    <div class="pt-1">
      <n-input v-model:value="luma.user_prompt" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </div>
    <div v-if="exLuma" class="pt-1">
        <div class="flex justify-between items-center">
            <div  >
                <n-popover trigger="hover">
                    <template #trigger>
                    <div class="line-clamp-1">{{ $t('video.extend') }}:{{exLuma.prompt}}</div>
                    </template>
                    <div class=" max-w-[300px]">{{exLuma.prompt}}</div>
                </n-popover>
            </div>
        </div>
        <div class="relative flex items-center justify-center bg-white bg-opacity-10 rounded-[5px] overflow-hidden aspect-[16/8.85] ">
                <video v-if="exLuma.video?.url|| exLuma.video?.download_url" :src="exLuma.video?.download_url? exLuma.video?.download_url:exLuma.video?.url" @error="$event.target.src=exLuma.video?.url" loop  playsinline  controls class="w-full h-full object-cover"></video>    
        </div>
            
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
                  <NTag v-if=" exLuma|| luma.user_prompt!=''||luma.image_url!=''" type="success" size="small" round  ><span class="cursor-pointer" @click="clearInput()" >{{$t('video.clear')}}</span></NTag>
                </div>
                <div>
                    <NButton :loading="st.isDo" type="primary" :disabled="!canPost" @click="generate()"><SvgIcon icon="ri:video-add-line"  /> {{$t('video.generate')}}</NButton> 
                </div>
            </div>
        </div>
    </div>    
</div>
</template>