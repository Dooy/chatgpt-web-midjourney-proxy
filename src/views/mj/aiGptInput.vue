<script setup lang="ts">
import { ref ,computed } from 'vue';
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { NInput ,NButton,useMessage,NImage,NTooltip, NAutoComplete } from 'naive-ui'
import { SvgIcon } from '@/components/common';
import { canVisionModel, GptUploader, mlog, upImg } from '@/api';
import { gptConfigStore, homeStore } from '@/store';
import { AutoCompleteOptions } from 'naive-ui/es/auto-complete/src/interface';
import { RenderLabel } from 'naive-ui/es/_internal/select-menu/src/interface';
 

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue:string,disabled?:boolean,searchOptions?:AutoCompleteOptions,renderOption?: RenderLabel }>();
const fsRef = ref()
const st = ref<{fileBase64:string[]}>({fileBase64:[]})
const { isMobile } = useBasicLayout()
const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder')
})

const handleSubmit = ( ) => {
    let obj={
        prompt: mvalue.value,
        fileBase64:st.value.fileBase64
    }
    homeStore.setMyData({act:'gpt.submit', actData:obj });
    mvalue.value='';
    st.value.fileBase64=[];
    return false;
}
const ms= useMessage();
const mvalue = computed({
  get() { return props.modelValue  },
  set(value) {  emit('update:modelValue', value) }
})
function selectFile(input:any){
 if(  !canVisionModel(gptConfigStore.myData.model )  ) {
    upImg(input.target.files[0]).then(d=>{
        fsRef.value.value='';
        if(st.value.fileBase64.findIndex(v=>v==d)>-1) {
            ms.error('不能重复上传')
            return ;
        }
        st.value.fileBase64.push(d)  
    } ).catch(e=>ms.error(e));
 }else{
    const formData = new FormData( );
    const file = input.target.files[0];
    formData.append('file', file); 
    ms.info('上传中...');
    GptUploader('/v1/upload',formData).then(r=>{
        //mlog('上传成功', r);
        if(r.url ){
             ms.info('上传成功');
            if(r.url.indexOf('http')>-1) {
                st.value.fileBase64.push(r.url)
            }else{
                st.value.fileBase64.push(location.origin +r.url)
            }
        }else if(r.error) ms.error(r.error);
    }).catch(e=>ms.error('上传失败:'+ ( e.message?? JSON.stringify(e)) ));
 }
//   let url= gptGetUrl('/test/2023/upload');
//   axios.post( url , formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//         }).then(response => {
//         console.log('上传成功', response.data);
//         }).catch(error => {
//         console.error('上传失败', error);
//         });

}
 

function handleEnter(event: KeyboardEvent) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
  else {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault()
      handleSubmit()
    }
  }
}

const acceptData = computed(() => {
  if(  canVisionModel(gptConfigStore.myData.model) ) return "*/*";
  return  "image/jpeg, image/jpg, image/png, image/gif"
})
</script>
<template>
<div class="  myinputs" >

    <input type="file" id="fileInput"  @change="selectFile"  class="hidden" ref="fsRef"   :accept="acceptData"/>

    <div class="flex items-base justify-start pb-1 flex-wrap-reverse" v-if="st.fileBase64.length>0 "> 
        <div class="w-[60px] h-[60px] rounded-sm bg-slate-50 mr-1 mt-1 text-red-300 relative group" v-for="(v,ii) in st.fileBase64">
         <NImage :src="v" object-fit="cover" class="w-full h-full" >
            <template #placeholder>
                <a class="w-full h-full flex items-center justify-center  text-neutral-500" :href="v" target="_blank" >
                    <SvgIcon icon="mdi:download" />附{{ ii+1 }}
                </a>
            </template>
         </NImage> 
         <SvgIcon icon="mdi:close" class="hidden group-hover:block absolute top-[-5px] right-[-5px] rounded-full bg-red-300 text-white cursor-pointer" @click="st.fileBase64.splice(st.fileBase64.indexOf(v),1)"></SvgIcon>
        </div>
    </div>
    <NAutoComplete v-model:value="mvalue" :options="searchOptions" :render-label="renderOption">
        <template #default="{ handleInput, handleBlur, handleFocus }">
        <NInput ref="inputRef"  v-model:value="mvalue"    type="textarea"
            :placeholder="placeholder"  :autosize="{ minRows: 1, maxRows: isMobile ? 4 : 8 }"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
            @keypress="handleEnter"    >
            <template #prefix>
                <div  class=" relative; w-[22px]">
                    <n-tooltip trigger="hover">
                    <template #trigger>
                    <SvgIcon icon="ri:attachment-line" class="absolute bottom-[10px] left-[8px] cursor-pointer" @click="fsRef.click()"></SvgIcon>
                    </template>
                    <div v-if="canVisionModel(gptConfigStore.myData.model)">
                       <span>上传图片、附件<br/>能上传图片、PDF、EXCEL等文档</span>
                    </div>
                    <div v-else>
                         <span>上传图片<br/>会自动调用 gpt-4-vision-preview 模型<br>注意：会有额外的图片费用</span>
                    </div>
                    </n-tooltip>
                </div>
                
            </template>
            <template #suffix>
                <div  class=" relative; w-[40px] ">
                    <div class="absolute bottom-[-3px] right-[0px] ">
                        <NButton type="primary" :disabled="disabled"  @click="handleSubmit" >
                            <template #icon>
                            <span class="dark:text-black">
                                <SvgIcon icon="ri:send-plane-fill" />
                            </span>
                            </template>
                        </NButton>
                    </div>
                </div>
            </template>
        </NInput>
        </template>
    </NAutoComplete>
         <!-- translate-y-[-8px]       -->
</div>
</template>
<style    >
.myinputs .n-input .n-input-wrapper{
     @apply items-stretch; 
    
}
</style>