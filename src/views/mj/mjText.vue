<script setup lang="ts">
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { NImage,NButton,NModal,useMessage } from 'naive-ui'
import { computed , ref,watch } from 'vue'
import {flechTask ,localGet,mlog, url2base64 } from '@/api'
import { homeStore } from '@/store'
import aiCanvas from './aiCanvas.vue'
interface Props { 
  chat:Chat.Chat
}
 const { isMobile } = useBasicLayout()
const ms = useMessage();
const props = defineProps<Props>();
const st = ref( { isLoadImg:false, uri_base64:'', bts:[],isShow:false })

const reload= ()=>{
    flechTask(chat.value);
}
const sub= (type:string,index:number)=>{
     
    let text= chat.value.opt?.promptEn+` ${type} ${index}`;
    let obj={
        action:'change',
        version:1,text,
        data:{
            "action": type,
            "index": index, 
            "taskId":  chat.value.mjID
            }
    }
    homeStore.setMyData({act:'draw',actData:obj});
}
//const st= ref({isLoad:false,});
////实现本地保存图片
// const saveImg= (myChat:Chat.Chat)=>{
//     //homeStore.setMyData({act:'saveImg',actData:chat.value.opt?.promptEn});
//     if(myChat.opt?.progress=='IMAGINE'){
        
//     }else{
//         st.value.isLoad=true;
//     }
// }
const chat = computed(() =>props.chat);

const subV2= (b:{k:string,n:string})=>{
    if(chat.value.opt?.buttons ==undefined ) return;
    //mlog('subV2', b );
    let i = getIndex( chat.value.opt?.buttons, b);
    mlog('subV2', b,i ,  chat.value.opt?.buttons[i] );
    if(b.k== ':Inpaint::1' ){
        mlog('局部重绘！' , i );
        st.value.isShow =true;
        return ;
    }
     let obj={
        action:'changeV2',
        version:1, 
        data:{
            "customId": chat.value.opt?.buttons[i].customId, 
            "taskId":  chat.value.mjID
            }
    }
    homeStore.setMyData({act:'draw',actData:obj});

}

const maskOk=(d:any)=>{
    if(chat.value.opt?.buttons ==undefined ) return;
   
   mlog('maskOk',d  );
    let i = getIndex( chat.value.opt?.buttons, {k:':Inpaint::1',n:'局部重绘'} );
    let obj={
        action:'mask',
        version:1, 
        data:{
            "customId": chat.value.opt?.buttons[i].customId, 
            "taskId":  chat.value.mjID
            },
        maskData:{ 
  "maskBase64": d.mask ,
  "prompt": d.prompt ,
   //"taskId": "14001934816969359" 
        }
    }
   homeStore.setMyData({act:'draw',actData:obj});
   //imageSend({t:'V',v: 23,chat:props?.chat,  data:{ mask:d.mask,prompt:d.prompt} })
   st.value.isShow= false;
}
//专业版本按钮
const bt= [ 
    [
    {k:':upsample::1',n:'U1'}
    ,{k:':upsample::2',n:'U2'}
    ,{k:':upsample::3',n:'U3'}
    ,{k:':upsample::4',n:'U4'} 
        ,{k:'high_variation',n:'强变化'},
        {k:'low_variation',n:'弱变化'},
        {k:':Inpaint::1',n:'局部重绘'},
        {k:'Outpaint::50',n:'变焦1.5倍'},
        {k:'Outpaint::75',n:'变焦2倍'},
        {k:'Outpaint::100',n:'方正'}

        ,{k:'Job::PicReader::1',n:'T1'}
        ,{k:'Job::PicReader::2',n:'T2'}
        ,{k:'Job::PicReader::3',n:'T3'}
        ,{k:'Job::PicReader::4',n:'T4'}
        ,{k:'Picread::Retry',n:'重分析'}
       // ,{k:'Job::PicReader::all',n:'全4张'}
    ]
    ,[
    {k:':variation::1',n:'V1'}
    ,{k:':variation::2',n:'V2'}
    ,{k:':variation::3',n:'V3'}
    ,{k:':variation::4',n:'V4'}
    ,{k:'pan_left',n:'向左'}
    ,{k:'pan_right',n:'向右'}
    ,{k:'pan_up',n:'向上'}
    ,{k:'pan_down',n:'向下'}
    ,{k:'reroll::0',n:'重绘'}
    ,{k:'upsample_v5_2x',n:'高清2倍'}
    ,{k:'upsample_v5_4x',n:'高清4倍'} 
    ]
]

const getIndex = (arr:any[], ib:any )=> arr.findIndex( (v9:any)=>v9.customId.indexOf(ib.k)>-1 ) ;
const getIndexName=  (arr:any[], ib:any )=> {
  const i= getIndex( arr,ib);
  if(ib.k=='upsample_v5_2x') return ib.n;
  return `${arr[i].emoji} ${ib.n}`;
}

const load = async ()=>{
     
     if(!chat.value.mjID) return ;
     let key= 'img:'+chat.value.mjID;
    try {
        if(chat.value.opt?.imageUrl){
            //await loadImg(chat.value.opt?.imageUrl);
            let base64 = await localGet(key );  
            if(!base64) {
                const ubase64=  await url2base64(chat.value.opt?.imageUrl ,key );
                base64= ubase64.base64;
                mlog('图片已保存>>', ubase64.key )
            }
            st.value.uri_base64=base64;
        }
    } catch (error) {
        mlog('图片保存失败',error);
    }
    
    st.value.isLoadImg=true;
}

watch(()=>homeStore.myData.act,(n)=>{
    const actData :any= homeStore.myData.actData;
    if(n=='mjReload' &&  actData.mjID== chat.value.mjID ){ //&& actData.mjID==chat.value.mjID
         mlog('mjReload', actData.mjID, chat.value.mjID , chat.value.opt?.imageUrl);
         if( !st.value.isLoadImg){
            ms.success('客官不要太急嘛，正在加载呢');
            return ;
         }
         st.value.isLoadImg=false;
         load();
         if( !actData.noShow ) ms.success('图片刷新成功！');
    }
})
load();
</script>
<template>
<div v-if="st.isLoadImg">
    
    <template   v-if="chat.opt?.progress">
        <div v-if="chat.opt?.action!='IMAGINE'" class="py-2 text-[#666]  whitespace-pre-wrap">{{ chat.opt?.promptEn }} (<span v-html="chat.opt?.action"></span>)</div> 
        <NImage v-if="chat.opt.imageUrl" :src="st.uri_base64?st.uri_base64:chat.opt.imageUrl" class=" rounded-sm " :class="[isMobile?'':'!max-w-[500px]']"  /> 
        <div v-if="chat.opt?.status=='SUCCESS' " class=" space-y-2"  >
            <template v-if="chat.opt?.buttons">
                <div v-for="(bts,ii) in bt" class=" flex justify-start items-center flex-wrap "> 
                    <template v-for="ib in bts" >
                    <div class="p-1" v-if="   getIndex(chat.opt?.buttons, ib) >-1"> 
                        <NButton  @click="subV2(ib)" size="small" :type="ii==1?'warning':'primary'" >{{  getIndexName(chat.opt?.buttons, ib)  }}  </NButton>
                    </div>
                    </template>
                </div>
            </template>
            <template v-else-if="chat.opt?.action==='UPSCALE' || 'DESCRIBE'===chat.opt?.action"></template>
            <template v-else>
                <div class="flex space-x-2">
                    <NButton type="primary" @click="sub('UPSCALE',1)" size="small">U1</NButton>
                    <NButton type="primary" @click="sub('UPSCALE',2)"  size="small">U2</NButton>
                    <NButton type="primary" @click="sub('UPSCALE',3)"  size="small">U3</NButton>
                    <NButton type="primary" @click="sub('UPSCALE',4)"  size="small">U4</NButton>
                </div>
                <div class="flex space-x-2">
                    <NButton type="warning" @click="sub('VARIATION',1)"  size="small">V1</NButton>
                    <NButton type="warning" @click="sub('VARIATION',2)"  size="small">V2</NButton>
                    <NButton type="warning" @click="sub('VARIATION',3)"  size="small">V3</NButton>
                    <NButton type="warning" @click="sub('VARIATION',4)"  size="small">V4</NButton>
                    <NButton type="warning" @click="sub('REROLL',0)"  size="small" v-if="chat.opt?.action==='IMAGINE'">重绘</NButton>

                </div>
            </template>
        </div>
        <div v-else-if="!chat.loading"> <NButton type="primary" @click="reload()">重新获取</NButton></div>
        <div v-else-if="chat.opt.progress" class="py-2 min-w-[200px]"> 进度：{{chat.opt.progress}}</div>
        <div v-else class="py-2"> 任务已经提交请等待...</div>
        <!-- <div v-html="chat.opt?.action"></div> -->
    </template>
    <div v-else-if="chat.opt?.status=='FAILURE'"> 
        <div>失败原因：<p>{{ chat.opt?.failReason }}</p></div>
    </div>
    <div v-else> 
    任务 {{ chat.mjID }} 已经提交请等待 
        <div v-if="!chat.loading"> <NButton type="primary" @click="reload()">重新获取</NButton></div>

    </div>
    <div class=" hidden">{{ chat.dateTime }}</div>

    <NModal v-model:show="st.isShow"   preset="card"  title="局部重绘编辑" style="max-width: 800px;" @close="st.isShow=false" >
        <aiCanvas :chat="chat" :base64="st.uri_base64" v-if="st.isShow" @success="maskOk" />
    </NModal>
</div>
<div v-else class="w-[200px] h-[150px] flex flex-col justify-center items-center" >
    <div class="p-4">正在载入图片</div>
    
    <NButton type="primary"  ><a :href="chat.opt?.imageUrl" target="_blank">直接打开链接</a></NButton> 
</div>



</template>

<style>
.markdown-body img.maxCss,img.maxCss ,.maxCss img  { max-width: 400px!important; max-height: 400px!important;}
.mmWidth{ max-width: 600px;}
</style>