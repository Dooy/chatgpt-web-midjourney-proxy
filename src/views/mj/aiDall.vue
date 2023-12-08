<script setup lang="ts">
import { ref ,computed,watch} from 'vue';
import {useMessage, NButton,NSelect,NInput} from 'naive-ui';
import {gptFetch, mlog, upImg} from '@/api'
import { homeStore } from '@/store';
import { SvgIcon } from '@/components/common';

const ms = useMessage();
const config = ref( {
model:[
{  "label": "DALL·E 3", "value": "dall-e-3" }
 ,{  "label": "DALL·E 2", "value": "dall-e-2" }
]
});
const st =ref({isGo:false });     
const f = ref({size:'1024x1024', prompt:'',"model": "dall-e-3","n": 1});
const isDisabled= computed(()=>{
    if(st.value.isGo) return true;
    if(f.value.prompt.trim()=='') return true;
    return false;
});
const create= async ()=>{
    // const d= await gptFetch('/v1/embeddings',{
    // "input":  f.value.prompt,
    // "model": "text-embedding-ada-002"
    // });
    // mlog('test',d );
    //return ;
    let obj= {
        action:'gpt.dall-e-3',
        data:f.value
    }
    homeStore.setMyData({act:'draw', actData:obj});
    st.value.isGo=true;
}
watch(()=>homeStore.myData.act,(n)=>{
    if(n=='dallReload') {
        st.value.isGo=false;
        f.value.prompt='';
    }
    if(n=='updateChat')  st.value.isGo=false;  
})

const dimensionsList= computed(()=>{
    if(f.value.model=='dall-e-2'){
        return [{ 
                "label": "1024px*1024px",
                "value": "1024x1024"
            }, {
                "label": "512px*512px",
                "value": "512x512"
            }, {
                "label": "256px*256px",
                "value": "256x256"
            }
    ];
    } 
    return [{ 
                "label": "1024px*1024px",
                "value": "1024x1024"
            }, {
                "label": "1792px*1024px",
                "value": "1792x1024"
            }, {
                "label": "1024px*1792px",
                "value": "1024x1792"
            }
     ]
     
})
watch(()=>f.value.model,(n)=>{
    f.value.size='1024x1024';
})
</script>
<template>
<section class="mb-4 flex justify-between items-center"  >
     <div>版本</div>
    <n-select v-model:value="f.model" :options="config.model" size="small"  class="!w-[70%]" :clearable="false" />
</section>
<section class="mb-4 flex justify-between items-center"  >
     <div>尺寸</div>
    <n-select v-model:value="f.size" :options="dimensionsList" size="small"  class="!w-[70%]" :clearable="false" />
</section>
<div class="mb-1">
     <n-input    type="textarea"  v-model:value="f.prompt"   placeholder="提示词" round clearable maxlength="500" show-count 
      :autosize="{   minRows:3, maxRows:10 }" />
</div>

<div class="mb-4 flex justify-end items-center">
    <div class="flex ">
         <n-button type="primary" :block="true" :disabled="isDisabled" @click="create()"  >
            <SvgIcon icon="mingcute:send-plane-fill" />  
            
             生成图片 
            
        </n-button>
    </div>
</div>

<ul class="pt-4">
    说明：
    <li>1 dall-e 是openAi提供的画图模型</li>
    <li>2 openAi的图片有时效性，请做好备份</li> 
    <li>3 注意：1790px的图片价格是双倍</li> 
</ul>
</template>