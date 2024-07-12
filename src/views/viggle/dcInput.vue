<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NSelect,NButton,NDrawer,NDrawerContent,NInput, useMessage, NImage } from 'naive-ui';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import {SvgIcon} from '@/components/common'
import dcTemple from "./dcTemple.vue"
import { gptServerStore, homeStore } from '@/store';
import {  mlog, upImg } from '@/api';
import { FeedViggleTask, ViggleTemplate , viggleFetch } from '@/api/viggle';
import { t } from '@/locales';
import { lumaHkStore } from '@/api/lumaStore';
import { sleep } from '@/api/suno';

const f= ref({ "imageID": "", "bgMode": 2, "modelInfoID": 3,"templateID": "","videoID":'' })
const st= ref({isDo:false,showImg:false,q:'',imgSrc:'',vgSrc:'',vgCoverURL:'',version:'relax'})
const useTem= ref<ViggleTemplate>()
const fsRef= ref() ;
const vsRef= ref() ;
const ms = useMessage();

const { isMobile } = useBasicLayout()


const modelOption= [
{label: t('dance.model')+': V2',value: 2}
,{label:t('dance.model')+': V2-Turbo',value:3}
 ]
 const bgOption= [
     {label:t('dance.bgw') ,value: 0}
    ,{label:t('dance.bgg'),value:1}
    ,{label:t('dance.bgmoban') ,value:2}
    ,{label:t('dance.bgrole') ,value:3}
 ]

const generate= async ()=>{
    ms.loading(t('dance.gring'))
    let d = await viggleFetch( getMyProUrl('/video-task'), f.value); 
    if (d.data && d.data.taskID) {
        if( st.value.version=='pro' ){
            const hk= new lumaHkStore();
            hk.save({id:d.data.taskID,isHK:true})
            await sleep(800)
        }
        FeedViggleTask(d.data.taskID)  
    }
}
const search=()=>{
    
}
const canPost= computed(()=>{
    return (f.value.templateID|| f.value.videoID) && f.value.imageID 
})

const clear=(type:number)=>{
    if(type==1){
        useTem.value=undefined
        f.value.templateID=''
        f.value.videoID=''
    }else if(type==3){
        useTem.value=undefined
        f.value.templateID=''
        f.value.videoID=''
        st.value.vgSrc=''
        st.value.vgCoverURL=''
    }else{
        f.value.imageID=''
        st.value.imgSrc=''
    }
    
}

function getMyProUrl( url:string ){
    // const is_luma_pro=homeStore.myData.is_luma_pro
    if (st.value.version=='pro' ) url= '/pro'+url
    return url ;
}

async function  selectFileVideo(input:any){  
    const formData = new FormData(); 
    formData.append('file', input.target.files[0]) 
    let d:any = await viggleFetch(getMyProUrl( '/asset/video/'+f.value.imageID) , formData,{upFile:true})
    mlog("d Video", d )
    if(d.data ) {
       if( d.data.id ) {
        f.value.videoID= d.data.id
        f.value.templateID='' 
        st.value.vgCoverURL= d.data.coverURL
        st.value.vgSrc= d.data.url
       }
    }
   
}

const selectVideo=()=>{ 
    if(f.value.imageID==''){
        ms.error(t('dance.uprolefirst'))
        return 
    }
    vsRef.value.click()
}

async function  selectFile(input:any){  
    try{
    let ud= await upImg(input.target.files[0]) 
    const formData = new FormData(); 
    formData.append('file', input.target.files[0])
   
    let d:any = await viggleFetch( getMyProUrl('/asset/image'), formData,{upFile:true})
    mlog("d Image", d )
    if(d.data ) {
       if( d.data.id ) {
        f.value.imageID= d.data.id
        st.value.imgSrc= ud;//d.data.url
       }
    }
    fsRef.value=''
    }catch(e ){
         ms.error( t('dance.uprolefail'))
    }
}

const isHK= computed(()=> {
    const url= gptServerStore.myData.VIGGLE_SERVER.toLocaleLowerCase();
    if(url!=''){
     return (url.indexOf('hk')>-1 &&  url.indexOf('pro')==-1 ) ;
    }
   
    return (homeStore.myData.session && homeStore.myData.session.isHk) ;
    
} );

const saveMyDate=(is_pro:boolean)=>{
    homeStore.setMyData({is_viggle_pro: is_pro})
    gptServerStore.setMyData({IS_VIGGLE_PRO: is_pro})
}

watch(()=>isHK.value , (n)=>    saveMyDate( n && st.value.version=='pro' ) ); 
watch(()=>st.value.version , ()=>  saveMyDate(isHK.value && st.value.version=='pro' ) );

watch(()=>homeStore.myData.act, (n)=>{
    //canPost.value= n.modelInfoID!=0 && n.bgMode!=0
    if(n=='viggle.useVideo'){
        mlog("viggle.useVideo", homeStore.myData.actData )
        useTem.value= homeStore.myData.actData as ViggleTemplate
        st.value.showImg=false
        f.value.templateID= useTem.value.id
        f.value.videoID= '' 
    }
})
const mvOption= [
{label: '版本: watermark, 价格实惠',value: 'relax'}
,{label:'版本: pro, 无水印',value: 'pro'}
 ]


//homeStore.setMyData({ms}) 
onMounted(() => {
    homeStore.setMyData({ms:ms})
    st.value.version= gptServerStore.myData.IS_VIGGLE_PRO?'pro':'relax'
});

</script>
<template>
<div class="p-2"> 
    <div>
         <n-select v-model:value="f.modelInfoID" :options="modelOption" size="small" />
    </div>
    <div class="pt-2">
         <n-select v-model:value="f.bgMode" :options="bgOption" size="small" />
    </div>
    <div class="pt-2 flex justify-center items-center w-full relative">
        <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
        <div class="absolute right-1 top-3 z-40"  v-if="st.imgSrc" >
                    <NButton strong secondary round size="small" type="success" @click="clear(2)" >{{$t('common.clear')}}</NButton> 
        </div>
        <div class="h-[180px] w-full overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
            <NImage :src="st.imgSrc" v-if="st.imgSrc" object-fit="contain" />
            <div class="text-center"  v-else> 
                <NButton  type="primary" size="small">+{{ $t('dance.character') }}</NButton>
            </div> 
        </div>
    </div>

    <div class="pt-2 " v-if="useTem">
         <div class="relative h-[180px]" > 
                <div class="absolute right-1 top-1 z-40"  >
                    <NButton strong secondary round size="small" type="success" @click="clear(1)" >{{$t('common.clear')}}</NButton> 
                </div>
                <div class=" absolute w-full h-full top-0 left-0 z-1"   >
                
                <video controls   playsinline loop :poster="useTem.processedCoverURL" 
                 class="  rounded-lg bg-[#242424] object-contain w-full h-full transition-all"      :src="useTem.processedURL" ></video>
                </div>
            </div>
    </div>
     <div class="pt-2 " v-else-if="st.vgSrc">
         <div class="relative h-[180px]" > 
                <div class="absolute right-1 top-1 z-40"  >
                    <NButton strong secondary round size="small" type="success" @click="clear(3)" >{{$t('common.clear')}}</NButton> 
                </div>
                <div class=" absolute w-full h-full top-0 left-0 z-1"   >
                
                <video controls   playsinline loop :poster="st.vgCoverURL" 
                 class="  rounded-lg bg-[#242424] object-contain w-full h-full transition-all"      :src="st.vgSrc" ></video>
                </div>
            </div>
    </div>
    

    <div class="pt-2 flex justify-center items-center w-full" v-else>
        <input type="file"  @change="selectFileVideo"  ref="vsRef" style="display: none" accept=".mp4" />

        <div class="h-[180px] w-full overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center " >
            <!-- <img :src="luma.image_url" v-if="luma.image_url" /> -->
            <div class="text-center"  >
            <div class="cursor-pointer p-2" @click="selectVideo">{{$t('dance.upvideo')}}  </div> 
            <NButton  type="primary" size="small" @click="st.showImg=true">{{$t('dance.usevideo')}} </NButton>
            </div> 
        </div>
    </div>

    <div  class="pt-2" v-if="isHK">
        <n-select v-model:value="st.version" :options="mvOption" size="small" />
    </div>
    
    <div class="pt-2 flex justify-center items-center w-full">
         <NButton block :loading="st.isDo" type="primary" :disabled="!canPost" @click="generate()"><SvgIcon icon="ri:video-add-line"  /> {{$t('video.generate')}}</NButton> 
    </div>
    
   <div   class="pt-4 text-[12px]" v-html="t('dance.info')"> </div>
</div>

 <n-drawer v-model:show="st.showImg"   :placement="isMobile?'bottom':'right'"  :class="isMobile?['!h-[90vh]']: ['!w-[80vw]']" style="--n-body-padding:0">
    <n-drawer-content  class="mydrawer" :closable="isMobile">
        <template #header>
            <div class="flex justify-between items-center w-full"> 
            <div class="pr-4">{{$t('dance.moban')}}</div>
            <div class=" max-w-[400px]">
                <n-input round :placeholder="t('dance.moban2')" clearable v-model:value="st.q" @keydown.enter="search()" >
                    <template #prefix>
                        <SvgIcon icon="uil:search"/>
                    </template>
                    <template #suffix>
                        <div class="cursor-pointer" @click="search()">{{ $t('mjchat.search')}}</div>
                    </template>
                </n-input>
            </div>
            </div>
        </template>
        <dcTemple :q="st.q" @toq="(d)=>st.q= d.q" @close="st.showImg=false"/>
    </n-drawer-content>
</n-drawer>
</template>