<script setup lang="ts">
import { ref ,computed,watch} from 'vue';
import {useMessage, NButton,NSelect,NInput, NImage} from 'naive-ui';
import {gptFetch, mlog, upImg} from '@/api'
import { homeStore } from '@/store';
import { SvgIcon } from '@/components/common';
import { t } from '@/locales';

const ms = useMessage();
const config = ref( {
model:[
{  "label": "nano-banana-2", "value": "nano-banana-2" }
,{  "label": "nano-banana-hd", "value": "nano-banana-hd" }
,{  "label": "nano-banana", "value": "nano-banana" }
 ,{  "label": "DALL·E 3", "value": "dall-e-3" }
 ,{  "label": "GPT-Image-1", "value": "gpt-image-1" }
 ,{  "label": "flux-kontext-pro", "value": "flux-kontext-pro" }
 ,{  "label": "flux-kontext-max", "value": "flux-kontext-max" }
 ,{  "label": "DALL·E 2", "value": "dall-e-2" }
 ,{  "label": "Flux", "value": "flux" }
 ,{  "label": "Flux-Dev", "value": "flux-dev" }
 ,{  "label": "Flux-Pro", "value": "flux-pro" }
 ,{  "label": "Flux-Pro-1.1", "value": "flux-pro-1.1" }
 ,{  "label": "Flux-Pro-1.1-Ultra", "value": "flux-pro-1.1-ultra" }
]
});
interface myFile{
    file:any
    base64:string
}
const st =ref({
    isGo:false,
    quality:'medium',
    response_format:'url',
    image_size:'1K',
    aspect_ratio:'4:3'
});
const fsRef= ref();
const base64Array= ref<myFile[]>([]);
const f = ref({size:'1024x1024', prompt:'',"model": "nano-banana-2","n": 1});
const isDisabled= computed(()=>{
    if(st.value.isGo) {
        return true;
    }
    if(f.value.prompt.trim()=='') {
        return true;
    }
    return false;
});

const isNanoBanana2 = computed(()=>{
    return f.value.model === 'nano-banana-2';
});

const isNanoBanana = computed(()=>{
    return f.value.model.includes('banana');
});

const create= async ()=>{
    let obj= {
        action:'gpt.dall-e-3',
        data:{} //f.value
    }
    obj.data= { ...f.value}

    if(isNanoBanana.value){
        obj.data.aspect_ratio = st.value.aspect_ratio;
        obj.data.response_format = st.value.response_format;

        if(isNanoBanana2.value){
            obj.data.image_size = st.value.image_size;
        }

        delete obj.data.size;

        if(base64Array.value.length>0){
            obj.data.image = base64Array.value.map(item => item.base64);
        }
    }

    if(isCanImageEdit.value && !isNanoBanana.value){
        obj.data= {...obj.data ,quality:st.value.quality};
    }
    if (isCanImageEdit.value && base64Array.value.length>0 && !isNanoBanana.value){
        obj.data= {...obj.data, 'base64Array':base64Array.value,quality:st.value.quality};
        mlog("data", '我加东西了：',  base64Array.value  )
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


const qualityOption=  computed(()=>{
    return [
{label:'High',value: 'high'}
,{label:'Medium',value: 'medium'}
,{label:'Low',value: 'low'}
]
});

const responseFormatOption= computed(()=>{
    return [
{label:'URL',value: 'url'}
,{label:'Base64',value: 'b64_json'}
]
});

const imageSizeOption= computed(()=>{
    return [
{label:'1K',value: '1K'}
,{label:'2K',value: '2K'}
,{label:'4K',value: '4K'}
]
});

const aspectRatioOption= computed(()=>{
    return [
{label:'4:3',value: '4:3'}
,{label:'3:4',value: '3:4'}
,{label:'16:9',value: '16:9'}
,{label:'9:16',value: '9:16'}
,{label:'2:3',value: '2:3'}
,{label:'3:2',value: '3:2'}
,{label:'1:1',value: '1:1'}
,{label:'4:5',value: '4:5'}
,{label:'5:4',value: '5:4'}
,{label:'21:9',value: '21:9'}
]
});

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
    if(f.value.model=='gpt-image-1'){
        return [{
                    "label": "1024px*1024px",
                    "value": "1024x1024"
                }, {
                    "label": "1536px*1024px",
                    "value": "1536x1024"
                }, {
                    "label": "1024px*1536px",
                    "value": "1024x1536"
                }
        ];
    }
    if(f.value.model.includes('banana') && !f.value.model.includes('hd')){
     return [{
                    "label": "4:3",
                    "value": "4x3"
                }, {
                    "label": "3:4",
                    "value": "3x4"
                }, {
                    "label": "16:9",
                    "value": "16x9"
                }, {
                    "label": "9:16",
                    "value": "9x16"
                }, {
                    "label": "2:3",
                    "value": "2x3"
                }, {
                    "label": "3:2",
                    "value": "3x2"
                }
                , {
                    "label": "1:1",
                    "value": "1024x1024"
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
watch(()=>f.value.model,(n, oldVal)=>{
    f.value.size='1024x1024';

    if(isNanoBanana.value && !oldVal?.includes('banana')){
        st.value.aspect_ratio = '4:3';
    }
})

watch(()=>st.value.aspect_ratio,(n, oldVal)=>{
    mlog('aspect_ratio:', n);
})
const isCanImageEdit= computed(()=>{
    if(f.value.model=='dall-e-2') return true;
    if(f.value.model=='gpt-image-1') return true;
    if(f.value.model.indexOf('kontext')>-1) return true;
    if(f.value.model.indexOf('banana')>-1) return true;
    return false;
})

const selectFile=(input:any)=>{
    const ff=input.target.files[0];
    upImg(input.target.files[0]).then(d=>{
        fsRef.value.value='';
        const index = base64Array.value.findIndex(item => item.base64 == d);
        if(index>-1){
            ms.error(t('mjchat.no2add') )
            return ;
        }
        base64Array.value.push({file: ff ,base64:d});
    }).catch(e=>ms.error(e));
}

const removeImage=(item: myFile)=>{
    const index = base64Array.value.indexOf(item);
    if(index>-1){
        base64Array.value.splice(index,1);
    }
}

</script>
<template>
<section class="mb-4 flex justify-between items-center">
     <div>{{ $t('mjchat.version') }} </div>
    <n-select v-model:value="f.model" :options="config.model" filterable tag size="small"  class="!w-[70%]" :clearable="false" />
</section>

<!-- Nano-banana 专属选项 -->
<template v-if="isNanoBanana">
    <section class="mb-4 flex justify-between items-center">
        <div>
            {{ $t('mjchat.aspectRatio') }}
            <span v-if="isNanoBanana2" class="text-xs text-gray-500 ml-2">({{ $t('mjchat.nanoBananaSupport') }})</span>
        </div>
        <n-select v-model:value="st.aspect_ratio" :options="aspectRatioOption" size="small" class="!w-[70%]" :clearable="false" />
    </section>

    <section class="mb-4 flex justify-between items-center">
        <div>{{ $t('mjchat.responseFormat') }}</div>
        <n-select v-model:value="st.response_format" :options="responseFormatOption" size="small" class="!w-[70%]" :clearable="false" />
    </section>

    <section class="mb-4 flex justify-between items-center" v-if="isNanoBanana2">
        <div>
            {{ $t('mjchat.imageSize') }}
            <span class="text-xs text-orange-500 ml-1">({{ $t('mjchat.onlyNanoBanana2') }})</span>
        </div>
        <n-select v-model:value="st.image_size" :options="imageSizeOption" size="small" class="!w-[70%]" :clearable="false" />
    </section>
</template>

<!-- 其他模型的传统选项 -->
<template v-else>
    <section class="mb-4 flex justify-between items-center">
         <div>{{ $t('mjchat.size') }}</div>
        <n-select v-model:value="f.size" :options="dimensionsList"  filterable tag size="small"  class="!w-[70%]" :clearable="false" />
    </section>
    <section class="mb-4 flex justify-between items-center" v-if="isCanImageEdit" >
         <div>Quality</div>
        <n-select v-model:value="st.quality" :options="qualityOption"  filterable tag size="small"  class="!w-[70%]" :clearable="false" />
    </section>
</template>

<div class="mb-1">
     <n-input    type="textarea"  v-model:value="f.prompt"   :placeholder="$t('mjchat.prompt')" round clearable maxlength="500" show-count
      :autosize="{   minRows:3, maxRows:10 }" />
</div>

<!-- 参考图上传 -->
<div class="mb-1" v-if="isCanImageEdit">
    <div class="mb-2 text-sm text-gray-600 dark:text-gray-400">
        <template v-if="isNanoBanana">
            {{ $t('mjchat.refImages') }}
            <span class="text-xs">({{ $t('mjchat.refImagesDesc') }})</span>
        </template>
        <template v-else>
            {{ $t('mjchat.refImages') }}
        </template>
    </div>
    <div class="flex justify-start items-center flex-wrap myblend">

    <div class="w-[var(--my-blend-img-size)] h-[var(--my-blend-img-size)] mr-2 mt-2 bg-[#ddd] overflow-hidden rounded-sm relative group " v-for="item in base64Array">
        <NImage :src="item.base64" object-fit="cover"></NImage>
        <SvgIcon icon="fluent:delete-12-filled"
        class="absolute top-0 right-0 text-red-600 text-[20px] cursor-pointer hidden group-hover:block "
        @click="removeImage(item)"></SvgIcon>
    </div>

        <div   @click="fsRef.click()" v-if="base64Array.length<3"
         class="w-[var(--my-blend-img-size)] h-[var(--my-blend-img-size)] mt-2 bg-[#999] overflow-hidden rounded-sm flex justify-center items-center cursor-pointer">
            <SvgIcon icon="mdi:add-bold" class="text-[40px] text-[#fff]"></SvgIcon>
        </div>

    </div>
</div>

<div class="mb-4 flex justify-end items-center">
    <div class="flex ">
         <n-button type="primary" :block="true" :disabled="isDisabled" @click="create()"  >
            <SvgIcon icon="mingcute:send-plane-fill" />
             {{ $t('mjchat.imgcreate') }}
        </n-button>
    </div>
</div>

<ul class="pt-4" v-html="$t('mjchat.dalleInfo')">

</ul>

<input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>

</template>

<style scoped>
.myblend{
    --my-blend-img-size:75px
}
</style>
