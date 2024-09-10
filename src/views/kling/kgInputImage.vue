<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {useMessage, NButton,NInput,NTag} from 'naive-ui';
import { mlog, upImg } from '@/api';
import { homeStore } from '@/store';
import { klingFeed, klingFetch } from '@/api/kling';

const f= ref({prompt:'',negative_prompt:'',image:'',image_fidelity:0.5,n:1,aspect_ratio:'1:1'});
const st= ref({bili:0,isLoading:false});

const fsRef= ref() ; 
const ms = useMessage();


const vf=[{s:'width: 100%; height: 100%;',label:'1:1',value:'1:1'}
,{s:'width: 100%; height: 75%;',label:'4:3',value:'4:3'}
,{s:'width: 75%; height: 100%;',label:'3:4',value:'3:4'}
,{s:'width: 100%; height: 50%;',label:'16:9',value:'16:9'}
,{s:'width: 50%; height: 100%;',label:'9:16',value:'9:16'}
 ];


 function selectFile(input:any){
   // fsFile.value= input.target.files[0];
    upImg(input.target.files[0]).then(d=>{
        f.value.image= d;
        fsRef.value=''
    }).catch(e=>ms.error(e));
    
}

const clearInput = ()=>{
    f.value.prompt='';
    f.value.image= '';
    fsRef.value=''
}

const createImg = async ()=>{
    st.value.isLoading= true
    f.value.aspect_ratio= vf[st.value.bili].value
    try {
        const d:any= await klingFetch('/v1/images/generations ' ,f.value )
        mlog('img', d );
        klingFeed( d.data.task_id ,'image',  f.value.prompt )
    } catch (error) {
    }  
    st.value.isLoading= false
}

onMounted(() => {
    homeStore.setMyData({ms:ms})
});
//Cl6NIGbYLVQAAAAAALp
//klingFeed('Cl6NIGbYLVQAAAAAALp-jw','image',"测试啊").then(d=>mlog('d>>',d ) ) 
//klingFeed('Cl6NIGbYLVQAAAAAALXTmA','image',"大雪纷飞").then(d=>mlog('d>>',d ) ) 
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
         <div>{{ $t('mj.nohead') }}</div>
          <NInput v-model="f.negative_prompt" size="small"  class="!w-[70%]"  clearable :placeholder="$t('mj.negative_prompt')" />
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
                <img :src="f.image" v-if="f.image" />
                <div class="text-center" v-else>{{ $t('video.selectimg') }}</div> 
                
            </div>
        </div>
        <div class="text-right">
            <div  class=" cursor-pointer pb-2" @click="clearInput"  v-if="f.image|| f.prompt "><NTag type="success" size="small" :bordered="false" round  ><span class="cursor-pointer">{{$t('video.clear')}}</span></NTag></div>

            <NButton :loading="st.isLoading" type="primary" @click="createImg()" :disabled="!f.prompt"  >{{ $t('mjchat.imgcreate') }}</NButton>
        </div>
    </section>
</div>
</template>