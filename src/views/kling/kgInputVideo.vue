<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {useMessage, NButton,NInput,NTag,NSelect} from 'naive-ui';
import { clearImageBase64, mlog, upImg } from '@/api';
import { homeStore } from '@/store';
import { klingFeed, klingFetch } from '@/api/kling';
import { t } from '@/locales';

const f= ref({prompt:'',negative_prompt:'',image:'',image_tail:'',aspect_ratio:'1:1',mode:'std', duration:'5'});
const st= ref({bili:0,isLoading:false,camera_type:''});

const fsRef= ref() ; 
const fsRef2= ref() ; 
const ms = useMessage();


const vf=[
{s:'width: 100%; height: 100%;',label:'1:1',value:'1:1'}
,{s:'width: 100%; height: 50%;',label:'16:9',value:'16:9'}
,{s:'width: 50%; height: 100%;',label:'9:16',value:'9:16'}
 ];

const modeOptions=[ {label:t('mj.std'),value:'std'},{label:t('mj.pro'),value:'pro'}]
const durationOptions=[ {label:'5s',value:'5'},{label:'10s',value:'10'}]
const cameraOption=[ {label: t('mj.cnull'),value:''},{label: t('mj.down_back'),value:'down_back'}
,{label:t('mj.forward_up'),value:'forward_up'},{label:t('mj.right_turn_forward'),value:'right_turn_forward'},{label:t('mj.left_turn_forward'),value:'left_turn_forward'}
]


function selectFile(input:any){
   // fsFile.value= input.target.files[0];
    upImg(input.target.files[0]).then(d=>{
        f.value.image= d;
        fsRef.value=''
    }).catch(e=>ms.error(e));
}
function selectFile2(input:any){ 
    
    upImg(input.target.files[0]).then(d=>{
        f.value.image_tail= d;
        fsRef2.value=''
        if(f.value.image==''){
            ms.info( t('mj.needImg'))
        }
    }).catch(e=>ms.error(e));
}


const clearInput = ()=>{
    f.value.prompt='';
    f.value.image= '';
    f.value.image_tail= '';
    fsRef.value=''
    fsRef2.value=''
}

const createImg = async ()=>{
    st.value.isLoading= true
    f.value.aspect_ratio= vf[st.value.bili].value
    try {
        let cat= 'text2video'; 
        let abc:any  = {...f.value};
        //if(abc.image) abc.image= clearImageBase64( abc.image )
        if(f.value.image!=''){
            cat='image2video'
            abc.image= clearImageBase64( abc.image )
            if( f.value.image_tail) abc.image_tail= clearImageBase64( f.value.image_tail )
        }else if( st.value.camera_type ){
            abc.camera_control={ type:st.value.camera_type }
        }
        //  mlog('abc>> ',  abc  );
        // return 
        const d:any= await klingFetch('/v1/videos/'+ cat , abc  )
        mlog('img', d );
        klingFeed( d.data.task_id , cat ,  f.value.prompt )
    } catch (error) {
    }  
    st.value.isLoading= false
}

onMounted(() => {
    homeStore.setMyData({ms:ms})
});
 
</script>
<template>
<div class="overflow-y-auto  h-full ">
    <section class="mb-4">
         <div class=" flex items-center justify-between space-x-1">
            <template  v-for="(item,index) in vf" >
            <section class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"  :class="{'active':index==st.bili}"  @click="st.bili=index">
                <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
                    <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
                </div>
                <p class="mb-1 text-center text-sm">{{ item.label }}</p>
            </section>
            </template>

        </div>
    </section> 
    
    <section class="mb-4 flex justify-between items-center" >
         <div>{{ $t('mj.mode') }}</div>
         <n-select v-model:value="f.mode" size="small" :options="modeOptions"  class="!w-[70%]" />
         
    </section>
    <section class="mb-4 flex justify-between items-center" >
         <div>{{ $t('mj.duration') }}</div>
         <n-select v-model:value="f.duration" size="small" :options="durationOptions"  class="!w-[70%]" />
         
    </section>
     <section class="mb-4 flex justify-between items-center" >
         <div>{{ $t('mj.camera_type') }}</div>
         <n-select v-model:value="st.camera_type" size="small" :options="cameraOption"  class="!w-[70%]" />
         
    </section>

    <section class="mb-4 flex justify-between items-center" >
         <div>{{ $t('mj.nohead') }}</div>
          <NInput v-model:value="f.negative_prompt" size="small"  class="!w-[70%]"  clearable :placeholder="$t('mj.negative_prompt')" />
    </section>

     <section class="mb-4 flex justify-between items-center" >
         
          <n-input v-model:value="f.prompt" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </section>

    <div class="mb-4">
        <div class="flex justify-start  items-end">
            <div> 
                <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div   class="h-[80px] w-[80px]   overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                    <img :src="f.image" v-if="f.image" />
                    <div class="text-center" v-else>{{ $t('video.selectimg') }}</div> 
                    
                </div>
            </div>
            <div class="pl-2"> 
                <input type="file"  @change="selectFile2"  ref="fsRef2" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef2.click()">
                    <img :src="f.image_tail" v-if="f.image_tail" />
                    <div class="text-center" v-else>{{ $t('video.endImg') }}</div> 
                </div>
            </div>
           
        </div>
    </div>  

    
    <section class="mb-4 flex justify-between items-end" >
        <div class="relative"> 
            <div  class=" cursor-pointer pb-2" @click="clearInput"  v-if="f.image|| f.prompt || f.image_tail"><NTag type="success" size="small" :bordered="false" round  ><span class="cursor-pointer">{{$t('video.clear')}}</span></NTag></div>
        </div>
        <div class="text-right">

            <NButton :loading="st.isLoading" type="primary" @click="createImg()" :disabled="!f.prompt"  >{{$t('video.generate')}}</NButton>
        </div>
    </section>

    <ul class="text-[12px]" v-html="$t('mj.klingInfo')">
    
    </ul>
</div>
</template>