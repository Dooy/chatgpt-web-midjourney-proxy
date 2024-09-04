<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NSelect,NInput, useMessage,NButton,NTag } from 'naive-ui';
import { IdeoImageData, ideoFetch, mlog, upImg } from '@/api';
import { homeStore } from '@/store';

const vf=[{s:'width: 100%; height: 100%;',label:'1:1',value:'ASPECT_1_1'}
,{s:'width: 100%; height: 75%;',label:'4:3',value:'ASPECT_4_3'}
,{s:'width: 75%; height: 100%;',label:'3:4',value:'ASPECT_3_4'}
,{s:'width: 100%; height: 50%;',label:'16:9',value:'ASPECT_16_9'}
,{s:'width: 50%; height: 100%;',label:'9:16',value:'ASPECT_9_16'}
 ];

 const f= ref({
    "model": "V_2_TURBO",
    "magic_prompt_option": "AUTO",
    "prompt": "",
    "aspect_ratio": "ASPECT_9_16",
    "seed": 123456,
    //"style_type": "REALISTIC",
    "negative_prompt": "",
    //"resolution": "RESOLUTION_576_1408"
  });
const st=ref({bili:0,image_url:'' ,seed:''});
const fsRef= ref() ;
const fsFile= ref<any>();
const ms = useMessage();
function selectFile(input:any){
    fsFile.value= input.target.files[0];
    upImg(input.target.files[0]).then(d=>{
        st.value.image_url= d;
        fsRef.value=''
    }).catch(e=>ms.error(e));
    
}
const createImg= async ()=>{
    if(st.value.seed && !isNaN(parseInt(st.value.seed))){
        f.value.seed= parseInt(st.value.seed);
    }
    f.value.aspect_ratio= vf[st.value.bili].value
    let data:any ={
        image_request:f.value,
        file:fsFile.value,
        model:'ideogram_'+f.value.model.toLocaleLowerCase(),
        prompt: f.value.prompt,
      //  fileBase64:st.value.image_url
    }
    if(st.value.image_url){
        data.fileBase64=   st.value.image_url
    }
    // const d:any = await ideoFetch('/generate ' ,data ) 
    // mlog('img', d ); 
    // const dimg:IdeoImageData= d.data.data  
    let obj= {
        action:'gpt.dall-e-3',
        data:data
    }
    homeStore.setMyData({act:'draw', actData:obj});
}
onMounted(()=>{
    homeStore.setMyData({ms:ms });
})

const clearInput = ()=>{
    st.value.image_url='';
    f.value.prompt='';
    f.value.seed=123456;
    fsFile.value= null;
}
</script>
<template>
<div class="overflow-y-auto bg-[#fafbfc]   dark:bg-[#18181c] h-full ">
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
         <div>{{ $t('dance.model') }}</div>
          <n-select v-model:value="f.model" :options="'V_2,V_2_TURBO,V_1,V_1_TURBO'.split(',').map(v=>({label:v,value:v}))" size="small"  class="!w-[70%]" :clearable="true" />
    </section>
    <section class="mb-4 flex justify-between items-center" >
         <div>Seed</div>
          <NInput  v-model:value="st.seed" size="small"  class="!w-[70%]"  clearable placeholder="种子数字 1~2147483647" />
    </section>
    <section class="mb-4 flex justify-between items-center" >
         <div>{{ $t('mj.nohead') }}</div>
          <NInput v-model="f.negative_prompt" size="small"  class="!w-[70%]"  clearable placeholder="不含物体的文字放这儿" />
    </section>

    <section class="mb-4 flex justify-between items-center" >
         
          <n-input v-model:value="f.prompt" 
                :placeholder="$t('mj.ideopls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </section>
    
    <section class="mb-4 flex justify-between items-end" >
        <div class="relative"> 
            <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
            <div   class="h-[80px] w-[80px]   overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                <img :src="st.image_url" v-if="st.image_url" />
                <div class="text-center" v-else>{{ $t('video.selectimg') }}</div> 
                
            </div>
        </div>
        <div class="text-right">
            <div  class=" cursor-pointer pb-2" @click="clearInput"  v-if="st.image_url|| f.prompt "><NTag type="success" size="small" :bordered="false" round  ><span class="cursor-pointer">{{$t('video.clear')}}</span></NTag></div>

            <NButton type="primary" @click="createImg()" :disabled="!f.prompt"  >{{ $t('mjchat.imgcreate') }}</NButton>
        </div>
    </section>
    
    
</div>
</template>