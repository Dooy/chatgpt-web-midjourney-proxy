<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { NInput,NButton, useMessage,NTag ,NPopover,NSelect,NSwitch} from 'naive-ui';
import {SvgIcon} from '@/components/common'
import { FeedLumaTask, lumaFetch, mlog, upImg } from '@/api';
import { gptServerStore, homeStore } from '@/store';
import { t } from '@/locales';
import { LumaMedia, lumaHkStore } from '@/api/lumaStore';
import { sleep } from '@/api/suno';

const luma= ref({ "aspect_ratio": "16:9",loop:false, "expand_prompt": true,  "image_url": "",  "user_prompt": "","image_end_url": "", });
const st= ref({isDo:false,version:'relax'})
const ms = useMessage();
const fsRef= ref() ;
const fsRef2 = ref() ;
const exLuma= ref<LumaMedia>()

const vf=[{s:'width: 100%; height: 100%;',label:'1:1'}
,{s:'width: 100%; height: 75%;',label:'4:3'}
,{s:'width: 75%; height: 100%;',label:'3:4'}
,{s:'width: 100%; height: 50%;',label:'16:9'}
,{s:'width: 50%; height: 100%;',label:'9:16'}
 ];

onMounted(() => {
    homeStore.setMyData({ms:ms})
    st.value.version= gptServerStore.myData.IS_LUMA_PRO?'pro':'relax'
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
        //homeStore.myData.is_luma_pro?'/pro':''
        //if(homeStore)
        const is_luma_pro=homeStore.myData.is_luma_pro
        if (is_luma_pro) url= '/pro'+url
        const d:any=  await lumaFetch(url, luma.value);
        mlog("d", d )
        // if(d.id ) FeedLumaTask(d.id )
        // else FeedLumaTask(d[0].id )
        
        const taskID= d.id??d[0].id
        if( is_luma_pro ){
            const hk= new lumaHkStore();
            hk.save({id:taskID,isHK:true})
        }
       
        
        ms.success( t('video.submitSuccess'))
         await sleep(500)
        FeedLumaTask(taskID)
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

function selectFile2(input:any){
    upImg(input.target.files[0]).then(d=>{
        luma.value.image_end_url= d;
        fsRef2.value=''
    }).catch(e=>ms.error(e));
    
}

const clearInput = ()=>{
    luma.value.user_prompt= ''
    luma.value.image_url= ''
    luma.value.image_end_url= ''
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

const isHK= computed(()=> {
    const url= gptServerStore.myData.LUMA_SERVER.toLocaleLowerCase();
    if(url!=''){
     return (url.indexOf('hk')>-1 &&  url.indexOf('pro')==-1 ) ;
    }
   
    return (homeStore.myData.session && homeStore.myData.session.isHk) ;
    
} );
const saveMyDate=(is_pro:boolean)=>{
    homeStore.setMyData({is_luma_pro: is_pro})
    gptServerStore.setMyData({IS_LUMA_PRO: is_pro})
}

watch(()=>isHK.value , (n)=>    saveMyDate( n && st.value.version=='pro' ) ); 
watch(()=>st.value.version , ()=>  saveMyDate(isHK.value && st.value.version=='pro' ) );

const mvOption= [
{label: '版本: relax, 价格实惠',value: 'relax'}
,{label:'版本: pro, 快且无水印',value: 'pro'}
 ]

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

    <div class="pt-1" >
      <n-input v-model:value="luma.user_prompt" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </div>
    <div class="pt-1">
        <div class="flex justify-between items-center">
            <div>
                <n-switch v-model:value="luma.expand_prompt" size="small">
                    <template #checked> 
                    Enhance prompt
                    </template>
                    <template #unchecked> 
                    Enhance prompt
                    </template>
                </n-switch>
            </div>
            <div>
                <n-switch  v-model:value="luma.loop" size="small">
                    <template #checked> 
                    Loop
                    </template>
                    <template #unchecked> 
                    Loop
                    </template>
                </n-switch>
            </div>
        </div>
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

    <div  class="pt-1" v-if="isHK">
        <n-select v-model:value="st.version" :options="mvOption" size="small" />
    </div>
    
    <div class="pt-1">
        <div class="flex justify-start  items-end">
            <div> 
                <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                    <img :src="luma.image_url" v-if="luma.image_url" />
                    <div class="text-center" v-else>{{ $t('video.selectimg') }}</div> 
                </div>
            </div>
            <div class="pl-2"> 
                <input type="file"  @change="selectFile2"  ref="fsRef2" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef2.click()">
                    <img :src="luma.image_end_url" v-if="luma.image_end_url" />
                    <div class="text-center" v-else>{{ $t('video.endImg') }}</div> 
                </div>
            </div>
           
        </div>
    </div>  
     <div class="pt-1">
        <div class="flex justify-between items-end">
            <div class="pb-1 text-right">
                <NTag v-if=" exLuma|| luma.user_prompt!=''||luma.image_url!=''||luma.image_end_url!=''" type="success" size="small" round  ><span class="cursor-pointer" @click="clearInput()" >{{$t('video.clear')}}</span></NTag>
            </div>
            <div>
                <NButton  :loading="st.isDo" type="primary" :disabled="!canPost" @click="generate()"><SvgIcon icon="ri:video-add-line"  /> {{$t('video.generate')}}</NButton> 
            </div>
        </div>  
    </div>
    
    <div class="pt-2 text-[12px]" v-html="$t('video.lumainfo')" v-if="isHK">
       
    </div>
</div>
</template>