<script setup lang="ts">
import {useMessage, NButton,NInput,NTag,NRadioGroup,NRadioButton} from 'naive-ui';
 
import { getRandomInt, runwayMlFeed, runwayMlFeedById, runwayMlFetch } from '@/api/runwayml';
import { computed, onMounted, ref } from 'vue';
import { mlog, upImg } from '@/api';
import { homeStore } from '@/store';
import { t } from '@/locales';

 
const ms = useMessage();
const f= ref({
    "promptImage": [
       {"uri":"","position":"last"}
    ],
    "seed": 4294967295,
    "model": "gen3a_turbo",
    "promptText": "",
    "watermark": false,
    "duration": 5,
    "ratio": "1280:768"
  }
);
const luma=ref({image_url:'',image_end_url:''});
const st= ref({isLoading:false })
const vf=[ 
{s:'width: 100%; height: 50%;',label: t('mj.rml_heng'),value:'1280:768'}
,{s:'width: 50%; height: 100%;',label:t('mj.rml_shu'),value:'768:1280'}
 ];
 const duanConfig=[
{key:5,value: '5s'},
{key:10,value:'10s'}
]

const fsRef= ref() ;
const fsRef2 = ref() ;

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
onMounted(() => {
    homeStore.setMyData({ms:ms})
    
});
const clearInput = ()=>{
    f.value.promptImage=[];
    f.value.promptText= '';
    luma.value.image_end_url= '';
    luma.value.image_url= '';
    fsRef.value=''
    fsRef2.value=''
}
const canPost= computed(()=>{
    return f.value.promptText && luma.value.image_url
});

const create= async ()=>{ 
    f.value.promptImage=[];
    f.value.promptImage.push({uri:luma.value.image_url,"position":"first"});
    if(luma.value.image_end_url ) f.value.promptImage.push({uri:luma.value.image_end_url,"position":"last"});
    f.value.seed= getRandomInt(1375247627, 3975247627);
    st.value.isLoading=true
    //mlog('create', f.value  )
    try {
         let d:any= await runwayMlFetch('/v1/image_to_video', f.value)
         runwayMlFeed(d.id ,{model:'gen3a_turbo',promptText:f.value.promptText })
    } catch (error) {
        
    }
    st.value.isLoading=false 
}
</script>
<template> 
<div>
    <section class="mb-2">
         <div class=" flex items-center justify-between space-x-1">
            <template  v-for="(item,index) in vf" >
            <section class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"  :class="{'active':item.value==f.ratio}"  @click=" f.ratio=item.value ">
                <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
                    <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
                </div>
                <p class="mb-1 text-center text-sm">{{ item.label }}</p>
            </section>
            </template>

        </div>
    </section>
    <section class="mb-2 flex justify-between items-center" >
         
          <n-input v-model:value="f.promptText " 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </section>
    <section class="mb-2">
        <div class="flex justify-start  items-top">
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
            <div class="pl-2">
                <n-radio-group v-model:value="f.duration" name="radiobuttongroup1" size="small">
                    <n-radio-button   v-for="song in duanConfig"  :key="song.key" :value="song.key" :label="song.value"> </n-radio-button>  
                </n-radio-group>
            </div>
           
        </div>
    </section>  
    <section class="mb-4 flex justify-between items-end" >
        <div class="relative"> 
            <div  class=" cursor-pointer pb-2" @click="clearInput"  v-if="luma.image_end_url|| luma.image_url || f.promptText"><NTag type="success" size="small" :bordered="false" round  ><span class="cursor-pointer">{{$t('video.clear')}}</span></NTag></div>
        </div>
        <div class="text-right">

            <NButton :loading="st.isLoading" type="primary" @click="create()"  :disabled="!canPost"  >{{$t('video.generate')}}</NButton>
        </div>
    </section>

       <div v-html="t('mj.rml_info')"  class="mb-4  text-[12px]"></div>

</div>
</template>