<script setup lang="ts">
import {NSelect, NInput,NSlider, NButton, useMessage} from "naive-ui"
import { ref ,computed,watch} from "vue";
import {gptConfigStore} from '@/store'

const emit = defineEmits(['close']);
const config = ref({
model:[ 'gpt-4','gpt-3.5-turbo',`gpt-4-1106-preview`,`gpt-3.5-turbo-16k`,'gpt-4-0314','gpt-4-0613','gpt-4-32k-0613' ,'gpt-4-32k','gpt-4-32k-0314',`gpt-3.5-turbo-16k-0613`
,`gpt-4-vision-preview`,`gpt-3.5-turbo-1106` 
,'gpt-3.5-turbo-0301','gpt-3.5-turbo-0613','gpt-4-all','gpt-3.5-net']
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
     <div ><span class="text-red-500">*</span> 模型</div>
    <n-select v-model:value="gptConfigStore.myData.model" :options="modellist" size="small"  class="!w-[50%]"   />
</section>
<section class="mb-4 flex justify-between items-center"  >
    <n-input   placeholder="自定义模型多个用空格隔开，不是必须" v-model:value="gptConfigStore.myData.userModel">
      <template #prefix>
        自定义模型
      </template>
    </n-input>
 </section>
 <section class=" flex justify-between items-center"  >
     <div>上下文数量 
     </div>
     <div class=" flex justify-end items-center w-[80%] max-w-[240px]">
        <div class=" w-[200px]"><n-slider v-model:value="gptConfigStore.myData.talkCount" :step="1" :max="50" /></div>
        <div  class="w-[40px] text-right">{{ gptConfigStore.myData.talkCount }}</div>
    </div>
</section>
<div class="mb-4 text-[12px] text-gray-300/20"> 更多的上下文会使记忆更精确，但会消耗更多的额度</div>

 <section class=" flex justify-between items-center"  >
     <div>回复数 
     </div>
     <div class=" flex justify-end items-center w-[80%] max-w-[240px]">
        <div class=" w-[200px]"><n-slider v-model:value="gptConfigStore.myData.max_tokens" :step="1" :max="config.maxToken" :min="1" /></div>
        <div  class="w-[40px] text-right">{{ gptConfigStore.myData.max_tokens }}</div>
    </div>
</section>
<div class="mb-4 text-[12px] text-gray-300/20"> 回复数越大 ,越有可能消耗更多的额度</div>

 <section class="mb-4"  >
    <div>角色设定</div>
    <div>
     <n-input  type="textarea"  placeholder="给你的会话设置一个专属的角色，不是必须"   v-model:value="gptConfigStore.myData.systemMessage" :autosize="{ minRows: 3 }"
    />
    </div>
 </section>
 <section class=" text-right flex justify-end space-x-2"  >
    <NButton   @click="gptConfigStore.setInit()">恢复默认</NButton>
    <NButton type="primary" @click="save">保存</NButton>
 </section>
</template>