<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { NSelect, NInput,NButton ,useMessage,NEmpty} from 'naive-ui';
//import mytpl from './tpl.json'
import { mytpl } from './tpl';
import { DtoTpl, PostVideo, googleVeoFeed } from './veo';
import imageBase64Array from './image-base64-array.vue';
import { SvgIcon } from '@/components/common';
import { t } from '@/locales';
import { mlog } from '@/api';
import { useRoute } from 'vue-router';
const route = useRoute(); // 获取当前路由对象

//"fal-ai/ltxv-13b-098-distilled/image-to-video"
//const st= ref({"model":"veo3-fast-frames",isLoading:false});
const st= ref({"model":"sora-2",isLoading:false});
const stArr= ref<any[]>([])
const modelsOption= ref<{label:string,value:string}[]>([])
const tplArr= ref<DtoTpl[]>([])

// const modelsOption= computed(()=>{
//     let arr=[{label:'Please select Model',value: ''}];
//     for( let o of mytpl.tpl){
//         arr.push({label: o.model,value: o.model})
//     }
//     return arr
// })

const initStart= ()=>{
    const abc=()=>{
         let arr=[{label:'Please select Model',value: ''}];
            for( let o of mytpl.tpl){
                arr.push({label: o.model,value: o.model})
            }
            return arr
    }
    modelsOption.value= abc()

    const fun2=()=>{
        let arr:DtoTpl[]=[];
        for( let o of mytpl.tpl){
            arr.push(o)
        }
        return arr
    }
    tplArr.value= fun2()



}
initStart();
 
const nowTpl= computed(()=>{
    //let arr:any[]=[];
    stArr.value=[];
    const mtpl= tplArr.value.find(v=> v.model==st.value.model)
    if(!mtpl) return [];
    for( let o of mtpl.field){
        stArr.value.push(o.value??'')
    }
    return mtpl.field 
})

const isDisabled= computed(()=>{
     return st.value.isLoading ||!nowModel.value
})

const ms= useMessage();
const create= async ()=>{
    if(!nowModel.value){
        ms.error(t('video.selectModel') )
        return 
    }
    st.value.isLoading=true
    let data={}
    //const field= nowTpl.value.f
    for(let k in nowTpl.value ){
        if(!stArr.value[k]){
            continue;
        }
        const key=nowTpl.value[k].key;
        data[key]=stArr.value[k]??''

    }
    //console.log('data>>',data,nowModel.value.plat );
    try {
        await PostVideo( nowModel.value, data);
    } catch (error) {
        mlog('err',error )
        ms.error( t('mj.createFail') );
    }
    st.value.isLoading=false
}
const nowModel= computed(()=>{
     return tplArr.value.find(v=> v.model==st.value.model)
})

onMounted(() => {
    console.log("mytpl>>",mytpl)
    if(route.query.model ){
        st.value.model= route.query.model as string
    }
    // ms.error('sdsds')
    //googleVeoFeed('veo3-fast-frames:1757929479-J7A8Cm8JQS')
})


 
</script>
<template>
<div  class="p-2">
    <div  class="pt-1">
       <n-select v-model:value="st.model" :options="modelsOption" size="small" filterable />
    </div>
    <NEmpty :description="$t('video.selectModel')" v-if="!nowModel" class="pt-3">
    </NEmpty>
    <template v-else>
        <template v-for="tp,k in nowTpl">
            <div class="pt-1" v-if="tp.type=='textarea'">
                <n-input
                v-model:value="stArr[k]"
                type="textarea"
                :placeholder="tp.placeholder??''"
                />
            </div>

            <div class="pt-1" v-if="tp.type=='image_base64_url_array'">
                <image-base64-array v-model:value="stArr[k]" upload="1"></image-base64-array>
            </div>
             <div class="pt-1" v-if="tp.type=='image_base64_url'">
                <image-base64-array v-model:value="stArr[k]" :is-one="true"></image-base64-array>
            </div>

            <div class="pt-1" v-if="tp.type=='select'">
                <n-select v-model:value="stArr[k]" :options="tp.options" size="small"></n-select>
            </div>
        </template>
    
        <div class="mt-3 flex justify-end items-center">
            <div class="flex ">
                <n-button type="primary" :block="true" :disabled="isDisabled" @click="create()"  >
                    <SvgIcon icon="mingcute:send-plane-fill" />   
                    {{ $t('video.generate') }} 
                </n-button>
            </div>
        </div>
    </template>

</div>
</template>
