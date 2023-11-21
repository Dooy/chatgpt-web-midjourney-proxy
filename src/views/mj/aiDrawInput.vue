<script setup lang="ts">
//boy, Cyberpunk , Top view , Face Shot (VCU) , Warm light  --style raw  --ar 3:4 --q 0.5 --v 5.2
import { ref,computed,watch,onMounted } from "vue";
import config from "./draw.json";
import {  NSelect,NInput,NButton,NTag,NPopover, useMessage} from 'naive-ui'; 
import {  SvgIcon } from '@/components/common'
import AiMsg from './aiMsg.vue' 
import { mlog, train, upImg } from '@/api' 
//import {copyText3} from "@/utils/format";
import { homeStore } from "@/store";
//import { upImg } from "./mj";

const vf=[{s:'width: 100%; height: 100%;',label:'1:1'}
,{s:'width: 100%; height: 75%;',label:'4:3'}
,{s:'width: 75%; height: 100%;',label:'3:4'}
,{s:'width: 100%; height: 50%;',label:'16:9'}
,{s:'width: 50%; height: 100%;',label:'9:16'}
 ];

const f=ref({bili:-1, quality:'',view:'',light:'',shot:'',style:'',version:'--v 5.2'});
const st =ref({text:'',isDisabled:false,isLoad:false
    ,fileBase64:[]
});
const farr= [
{ k:'style',v:'风格'}
,{ k:'view',v:'视角'}
,{ k:'shot',v:'人物镜头'}
,{ k:'light',v:'灯光'}
,{ k:'quality',v:'画质'}
,{ k:'version',v:'模型版本'}
 ];

const msgRef = ref()
const fsRef= ref() 
const fsRef2 = ref()
const $emit=defineEmits(['drawSent','close']);
const props = defineProps({buttonDisabled:Boolean});

const isDisabled = computed(() => {
    return props.buttonDisabled || st.value.isLoad || st.value.text.trim()==''
})
const ms=   useMessage();
function create( ){
   
   
    st.value.isLoad=true
    train( st.value.text.trim()).then(ps=>{
        const rz={ prompt: st.value.text.trim() , drawText: createPrompt( ps) }
        if( ps  ) drawSent(rz)
        st.value.text=''
        st.value.isLoad=false
    }).catch(err=>{
        msgRef.value.showError(err)
        st.value.isLoad=false
    })

    
} 
function drawSent(rz:any){
    let rz2= rz;
    if(st.value.fileBase64) {
        rz2.fileBase64=st.value.fileBase64
    }
    $emit('drawSent', rz2 )
    st.value.fileBase64= [];
}
function createPrompt(rz:string){
    if( rz =='') {
        msgRef.value.showError('请填写提示词！');
        return '';
    }
     
   
    for(let v of farr){
        if( f.value[v.k]=='') continue;
        if(v.k=='quality') rz +=`  --q ${f.value.quality}`;
        else if(v.k=='version') {
            rz +=` ${f.value.version}`;
        }
        else if( f.value[v.k] ) rz +=` , ${f.value[v.k]}`;
    }
     if(f.value.bili>-1) rz +=` --ar ${vf[f.value.bili].label}`;
    //console.log('rz ', rz );
    //console.log('内容为：',rz, f.value );
    //return '';
    return rz ;
}
 
// const copy=()=>{
//     copyText3( '哦们sd').then(()=>msgRef.value.showMsg('复制成功345！'));
// }
// const copy2= ()=>{
//     copyRef.value.click();
// }
function selectFile(input:any){
    if(st.value.fileBase64.length>=3) {
        ms.error('最多上传3张图片');
        return;
    }
    upImg(input.target.files[0]).then(d=>st.value.fileBase64.push(d) ).catch(e=>msgRef.value.showError(e))
}

//图生文
function selectFile2(input:any){
     
    upImg(input.target.files[0]).then(d=>{
        mlog('f2base64>> ',d );
        let obj={
            action:'img2txt', 
            data:{
                "base64":d
            }
        }
        homeStore.setMyData({act:'draw',actData:obj});
    })
    .catch(e=>msgRef.value.showError(e))
}

const same2=()=>{
     st.value.text= homeStore.myData.actData.prompt;
    f.value.version='';
    f.value.quality='';
}
watch(()=>homeStore.myData.act,(n)=>{
   // n=='copy' && copy2();
    n=='same2' && same2();
});
onMounted(()=>{
    homeStore.myData.act=='same2' && same2();
});




//const config=
</script>
<template>
<AiMsg ref="msgRef" />
<input type="file"  @change="selectFile" ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
<input type="file"  @change="selectFile2" ref="fsRef2" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>

<div class="overflow-y-auto bg-[#fafbfc] p-4 dark:bg-[#18181c] h-full ">
    
    <section class="mb-4">
        <div class="mr-1 text-sm mb-2">图片比例</div>
        <div class=" flex items-center justify-between space-x-1">
            <template  v-for="(item,index) in vf" >
            <section class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"  :class="{'active':index==f.bili}"  @click="f.bili=index">
                <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
                    <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
                </div>
                <p class="mb-1 text-center text-sm">{{ item.label }}</p>
            </section>
            </template>
             
        </div>
    </section>
    <section class="mb-4 flex justify-between items-center" v-for=" v in farr">
     <div>{{ v.v }}</div>
     
    <n-select v-model:value="f[v.k]" :options="config[v.k+'List']" size="small"  class="!w-[60%]" :clearable="true" />
    </section>
    <div class="mb-1">
     <n-input    type="textarea"  v-model:value="st.text"   placeholder="提示词" round clearable maxlength="500" show-count 
      :autosize="{   minRows:2, maxRows:5 }" />
    </div>
    <div class="mb-4 flex justify-between items-center">
        <div class="flex justify-start items-center">
             <NPopover trigger="hover">
                <template #trigger>
                <n-tag type="error" round size="small" style="cursor: pointer; " :bordered="false" @click="fsRef.click()"   v-if="st.fileBase64.length">
                <div style="display: flex;">  <SvgIcon icon="mdi:file-chart-check-outline" />含有垫图  </div>
                </n-tag>
                <n-tag type="warning" round size="small" style="cursor: pointer; " :bordered="false" @click="fsRef.click()"   v-else="st.fileBase64">
                <div style="display: flex;">  <SvgIcon icon="mdi:file-document-plus-outline" /> 自传垫图  </div>
                </n-tag>
                </template>
                <div  style="max-width: 240px;">垫图说明：<br/>
                1.垫图可使用自己的图片作为基础，让MJ来绘图<br/>
                2.可以使用多张垫图 最多3张， 单张图片不超过1M<br/>
                3.<a class="text-green-500 cursor-pointer"  @click="fsRef.click()" >+添加</a><br/>
                <!-- 2.垫图耗时长所以会扣除<b style="color: green;">2张</b>图片的额度，请谨慎使用 -->
                <div  v-if="st.fileBase64.length>0" class="flex justify-start items-baseline">
                    <div class="p-1" v-for="(v ) in st.fileBase64">
                        <img  class="w-[60px]" :src="v">
                        <br/> 
                        <NButton size="small" @click="st.fileBase64= st.fileBase64.filter((item)=>item!=v) " type="warning" >删除</NButton>
                    </div>
                    
                </div>
                </div>
             </NPopover>

             <div class="pl-1">
               <NPopover trigger="hover">
                    <template #trigger>
                        <n-tag type="warning" round size="small" style="cursor: pointer; " :bordered="false" @click="fsRef2.click()"    >
                            <div style="display: flex;">  <SvgIcon icon="fluent:image-edit-16-regular" /> 图生文  </div>
                        </n-tag>
                    </template>
                     <div  style="max-width: 240px;">不知如何写提示词？可以看看用图生文！<br/>图片进去，提示词出来
                     </div>
                </NPopover>
            </div>
        </div>
        

        <div class="flex ">
         <n-button type="primary" :block="true" :disabled="isDisabled"  @click="create()">
            <SvgIcon icon="mingcute:send-plane-fill" />  
            
            <template v-if="st.isLoad"> 翻译中...</template>
            <template v-else> 生成图片</template>
            
        </n-button>
        </div>
    </div>
    <!-- <div class="mb-4 flex justify-between items-center">
        <div @click="copy()" ref="copyRef">复制</div>
        <div @click="copy2()"  >复制2</div> 
    </div> -->

   

</div>
</template>
<style>
    .aspect-item.active, .aspect-item.active .aspect-box{
        border-color:#86dfba ;
         
    }
</style>