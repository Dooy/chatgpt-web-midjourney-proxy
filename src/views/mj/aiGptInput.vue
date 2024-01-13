<script setup lang="ts">
import { ref ,computed,watch } from 'vue';
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { NInput ,NButton,useMessage,NImage,NTooltip, NAutoComplete,NTag,NPopover,NModal } from 'naive-ui'
import { SvgIcon } from '@/components/common';
import { canVisionModel, GptUploader, mlog, upImg,getFileFromClipboard,isFileMp3,countTokens, checkDisableGpt4} from '@/api';
import { gptConfigStore, homeStore,useChatStore } from '@/store';
import { AutoCompleteOptions } from 'naive-ui/es/auto-complete/src/interface';
import { RenderLabel } from 'naive-ui/es/_internal/select-menu/src/interface';
import { useRoute } from 'vue-router' 
import aiModel from "@/views/mj/aiModel.vue"

//import FormData from 'form-data'
const route = useRoute() 
const chatStore = useChatStore()

const emit = defineEmits(['update:modelValue'])
const props = defineProps<{ modelValue:string,disabled?:boolean,searchOptions?:AutoCompleteOptions,renderOption?: RenderLabel }>();
const fsRef = ref()
const st = ref<{fileBase64:string[],isLoad:number,isShow:boolean}>({fileBase64:[],isLoad:0,isShow:false })
const { isMobile } = useBasicLayout()
const placeholder = computed(() => {
  if (isMobile.value)
    return t('chat.placeholderMobile')
  return t('chat.placeholder');//可输入说点什么，也可贴截图或拖拽文件
})



const { uuid } = route.params as { uuid: string }

const dataSources = computed(() => chatStore.getChatByUuid(+uuid))

const handleSubmit = ( ) => {
    if( mvalue.value==''  ) return ;
    if(checkDisableGpt4(gptConfigStore.myData.model)){
        ms.error( t('mj.disableGpt4') );
        return false;
    }
    if( homeStore.myData.isLoader  ) { 
        return ;
    }
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

   const file = input.target.files[0];
   upFile( file );  
}

const myToken =ref({remain:0,modelTokens:'4k'});
const funt = async ()=>{
    const d = await countTokens( dataSources.value, mvalue.value ) 
    myToken.value=d ;
    return d ;
} 
watch(()=>mvalue.value,   funt  )
watch(()=> dataSources.value ,  funt )
watch(()=> gptConfigStore.myData ,  funt,{deep:true} )
watch(()=> homeStore.myData.isLoader ,  funt,{deep:true} )
funt(); 
 
 const upFile= (file:any )=>{
    if(  !canVisionModel(gptConfigStore.myData.model )  ) {
        if( isFileMp3(  file.name ) ){
            mlog('mp3' , file); 
            //  const formData = new FormData( ); 
            // formData.append('file', file);
            // formData.append('model', 'whisper-1'); 

            // GptUploader('/v1/audio/transcriptions',formData).then(r=>{
            //     mlog('语音识别成功', r ); 
            // }).catch(e=>ms.error('上传失败:'+ ( e.message?? JSON.stringify(e)) ));
            homeStore.setMyData({act:'gpt.whisper', actData:{ file , prompt:'whisper' } });
            return ;

        }else{ 
            upImg( file).then(d=>{
                fsRef.value.value='';
                if(st.value.fileBase64.findIndex(v=>v==d)>-1) {
                    ms.error(t('mj.noReUpload')) ;//'不能重复上传'
                    return ;
                }
                st.value.fileBase64.push(d)  
            } ).catch(e=>ms.error(e));
        }
    }else{
        const formData = new FormData( );
        //const file = input.target.files[0];
        formData.append('file', file); 
        ms.info( t('mj.uploading') );
        st.value.isLoad=1;
        GptUploader('/v1/upload',formData).then(r=>{
            //mlog('上传成功', r);
             st.value.isLoad= 0 ;
            if(r.url ){
                ms.info(t('mj.uploadSuccess'));
                if(r.url.indexOf('http')>-1) {
                    st.value.fileBase64.push(r.url)
                }else{
                    st.value.fileBase64.push(location.origin +r.url)
                }
            }else if(r.error) ms.error(r.error);
        }).catch(e=>{
            st.value.isLoad= 0 ;
            ms.error( t('mj.uploadFail')+ ( e.message?? JSON.stringify(e)) )
        });
    }
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
  return  "image/jpeg, image/jpg, image/png, image/gif, .mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm"
})

const drop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  if( !e.dataTransfer || e.dataTransfer.files.length==0 ) return;
  const files =    e.dataTransfer.files;
  upFile(files[0]);
  //mlog('drop', files);
}
const paste=   (e: ClipboardEvent)=>{
    let rz =   getFileFromClipboard(e); 
    if(rz.length>0 ) upFile(rz[0]);
}
</script>
<template>
<div class="  myinputs"  @drop="drop" @paste="paste">

    <input type="file" id="fileInput"  @change="selectFile"  class="hidden" ref="fsRef"   :accept="acceptData"/>
    <div class="w-full relative">
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
        <div class="absolute bottom-0 right-0 z-1">
            <NPopover trigger="hover">
                <template #trigger>
                    <NTag type="info" round size="small" style="cursor: pointer; " :bordered="false" >
                        <div class="opacity-60 flex"  >  
                        <SvgIcon icon="material-symbols:token-outline"  /> {{ $t('mj.remain') }}{{ myToken.remain }}/{{ myToken.modelTokens }}
                        </div>
                    </NTag>
                </template>
                <div class="w-[300px]">
                {{ $t('mj.tokenInfo1') }}
                <p class="py-1" v-text="$t('mj.tokenInfo2')"> </p>
                <p class=" text-right">
                <NButton @click="st.isShow=true" type="info" size="small">{{ $t('setting.setting') }}</NButton>
                </p>
                </div>
                  
            </NPopover>
          
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
                    <SvgIcon icon="line-md:uploading-loop" class="absolute bottom-[10px] left-[8px] cursor-pointer" v-if="st.isLoad==1"></SvgIcon>
                    <SvgIcon icon="ri:attachment-line" class="absolute bottom-[10px] left-[8px] cursor-pointer" @click="fsRef.click()" v-else></SvgIcon>
                    </template>
                    <div v-if="canVisionModel(gptConfigStore.myData.model)" v-html="$t('mj.upPdf')">
                        
                    </div>
                    <div v-else v-html="$t('mj.upImg')"> 
                    </div>
                    </n-tooltip>
                </div>
                
            </template>
            <template #suffix>
                <div  class=" relative; w-[40px] ">
                    <div class="absolute bottom-[-3px] right-[0px] ">
                         
                        <!-- <NButton type="primary"  v-if="homeStore.myData.isLoader " >
                            <template #icon>
                            <span class="dark:text-black"> 
                                <SvgIcon icon="ri:stop-circle-line" />
                            </span>
                            </template>
                        </NButton> -->
                        <NButton type="primary" :disabled="disabled || homeStore.myData.isLoader "     @click="handleSubmit" >
                         
                            <template #icon>
                            <span class="dark:text-black">
                                <SvgIcon icon="ri:stop-circle-line" v-if="homeStore.myData.isLoader" /> 
                                <SvgIcon icon="ri:send-plane-fill"   v-else/> 
                                
                                 
                                
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

<NModal v-model:show="st.isShow"   preset="card"  :title="$t('mjchat.modelChange')" class="!max-w-[620px]" @close="st.isShow=false" >  
        <aiModel @close="st.isShow=false"/>
</NModal>
</template>
<style    >
.myinputs .n-input .n-input-wrapper{
     @apply items-stretch; 
    
}
</style>