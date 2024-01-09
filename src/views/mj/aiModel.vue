<script setup lang="ts">
import {NSelect, NInput,NSlider, NButton, useMessage} from "naive-ui"
import { ref ,computed,watch} from "vue";
import {gptConfigStore, homeStore} from '@/store'
import { mlog } from "@/api";

const emit = defineEmits(['close']);
const config = ref({
model:[ 'gpt-4','gpt-3.5-turbo',`gpt-4-1106-preview`,`gpt-3.5-turbo-16k`,'gpt-4-0314','gpt-4-0613','gpt-4-32k-0613' ,'gpt-4-32k','gpt-4-32k-0314',`gpt-3.5-turbo-16k-0613`
,`gpt-4-vision-preview`,`gpt-3.5-turbo-1106` 
,'gpt-3.5-turbo-0301','gpt-3.5-turbo-0613','gpt-4-all','gpt-3.5-net','tts-1']
,maxToken:2048
}); 
const modellist = computed(() => { //
    let rz =[ ];
    for(let o of config.value.model){
        rz.push({label:o,value:o})
    }
    if(gptConfigStore.myData.userModel){
        let arr = gptConfigStore.myData.userModel.split(/[ ,]+/ig);
        //  let uniqueArray  = arr.filter((value, index, self) => {
        //     return self.indexOf(value) === index;
        // });
        for(let o of arr ){
             rz.push({label:o,value:o})
        }
    }
    //服务端的 CUSTOM_MODELS 设置
    if( homeStore.myData.session.cmodels ){
        let delModel:string[] = [];
        let addModel:string[]=[];
        homeStore.myData.session.cmodels.split(/[ ,]+/ig).map( (v:string)=>{
            if(v.indexOf('-')==0){
                delModel.push(v.substring(1))
            }else{
                addModel.push(v);
            }
        });
        mlog('cmodels',delModel,addModel);
        rz= rz.filter(v=> delModel.indexOf(v.value)==-1 );
        addModel.map(o=>rz.push({label:o,value:o}) )
    }

    let uniqueArray: { label: string, value: string }[] = Array.from(
        new Map(rz.map(item => [JSON.stringify(item), item]))
        .values()
    );
    return uniqueArray ;
});
const ms= useMessage();
const save = ()=>{ 
    gptConfigStore.setMyData( gptConfigStore.myData );
    ms.success('保存成功');
    emit('close');
}
 
watch(()=>gptConfigStore.myData.model,(n)=>{
    gptConfigStore.myData.gpts=undefined;
    let max=4096;
    if( n.indexOf('vision')>-1){
        max=4096;
    }else if( n.indexOf('gpt-4')>-1 ||  n.indexOf('16k')>-1 ){ //['16k','8k','32k','gpt-4'].indexOf(n)>-1
        max=4096*2;
    }
    config.value.maxToken=max/2;
    if(gptConfigStore.myData.max_tokens> config.value.maxToken ) gptConfigStore.myData.max_tokens= config.value.maxToken;
})
//
//const f= ref({model:gptConfigStore.myData.model});
</script>
<template>
<section class="mb-4 flex justify-between items-center"  >
     <div ><span class="text-red-500">*</span>  {{ $t('mjset.model') }}</div>
    <n-select v-model:value="gptConfigStore.myData.model" :options="modellist" size="small"  class="!w-[50%]"   />
</section>
<section class="mb-4 flex justify-between items-center"  >
    <n-input   :placeholder="$t('mjchat.modlePlaceholder')" v-model:value="gptConfigStore.myData.userModel">
      <template #prefix>
        {{ $t('mjchat.myModle') }}
      </template>
    </n-input>
 </section>
 <section class=" flex justify-between items-center"  >
     <div> {{ $t('mjchat.historyCnt') }}
     </div>
     <div class=" flex justify-end items-center w-[80%] max-w-[240px]">
        <div class=" w-[200px]"><n-slider v-model:value="gptConfigStore.myData.talkCount" :step="1" :max="50" /></div>
        <div  class="w-[40px] text-right">{{ gptConfigStore.myData.talkCount }}</div>
    </div>
</section>
<div class="mb-4 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mjchat.historyToken') }}</div>

 <section class=" flex justify-between items-center"  >
     <div> {{ $t('mjchat.historyTCnt') }} 
     </div>
     <div class=" flex justify-end items-center w-[80%] max-w-[240px]">
        <div class=" w-[200px]"><n-slider v-model:value="gptConfigStore.myData.max_tokens" :step="1" :max="config.maxToken" :min="1" /></div>
        <div  class="w-[40px] text-right">{{ gptConfigStore.myData.max_tokens }}</div>
    </div>
</section>
<div class="mb-4 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mjchat.historyTCntInfo') }}  </div>

 <section class="mb-4"  >
    <div>{{ $t('mjchat.role') }}</div>
    <div>
     <n-input  type="textarea"  :placeholder=" $t('mjchat.rolePlaceholder') "   v-model:value="gptConfigStore.myData.systemMessage" :autosize="{ minRows: 3 }"
    />
    </div>
 </section>
 <section class=" text-right flex justify-end space-x-2"  >
    <NButton   @click="gptConfigStore.setInit()">{{ $t('mj.setBtBack') }}</NButton>
    <NButton type="primary" @click="save">{{ $t('mj.setBtSave') }}</NButton>
 </section>
</template>