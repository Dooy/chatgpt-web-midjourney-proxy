<script setup lang="ts">
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { NImage,NButton,NModal,useMessage,NInput } from 'naive-ui'
import { computed , ref,watch } from 'vue'
import {flechTask ,localGet,mlog, url2base64,mjImgUrl } from '@/api'
import { homeStore } from '@/store'
import aiCanvas from './aiCanvas.vue'
import MarkdownIt from 'markdown-it'
import {t} from "@/locales"

interface Props { 
  chat:Chat.Chat
  ,mdi:MarkdownIt
}
 const { isMobile } = useBasicLayout()
const ms = useMessage();
const props = defineProps<Props>();
const st = ref( { isLoadImg:false, uri_base64:'', bts:[],isShow:false, isCustom:false ,customText:''})

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
    if(b.k=='CustomZoom::'){
         mlog('自定义变焦' , i );
         st.value.isCustom= true;
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

const subCustom = ()=>{
    if(chat.value.opt?.buttons ==undefined ) return;
    let i = getIndex( chat.value.opt?.buttons, {k: 'CustomZoom::' ,n: t('mj.czoom') } );
    let obj={
        action:'CustomZoom',
        version:1, 
        data:{
            "customId": chat.value.opt?.buttons[i].customId, 
            "taskId":  chat.value.mjID
            },
        maskData:{  
            "prompt": st.value.customText ,
        }
    }
    mlog('subCustom', obj );
    homeStore.setMyData({act:'draw',actData:obj});

    st.value.isCustom= false;
    
}

const maskOk=(d:any)=>{
    if(chat.value.opt?.buttons ==undefined ) return;
   
   mlog('maskOk',d  );
    let i = getIndex( chat.value.opt?.buttons, {k:':Inpaint::1',n: t('mj.redraw') } );
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
        ,{k:'high_variation',n: t('mj.high_variation')},
        {k:'low_variation',n:t('mj.low_variation')},
        {k:':Inpaint::1',n:t('mj.redraw')},
        {k:'Outpaint::50',n: t('mj.p15')},
        {k:'Outpaint::75',n: t('mj.p20')}
        ,{k:'CustomZoom::',n: t('mj.czoom')},
        {k:'Outpaint::100',n: t('mj.p100')}
        //MJ::CustomZoom

        ,{k:'Job::PicReader::1',n:'T1'}
        ,{k:'Job::PicReader::2',n:'T2'}
        ,{k:'Job::PicReader::3',n:'T3'}
        ,{k:'Job::PicReader::4',n:'T4'}
        ,{k:'Picread::Retry',n: t('mj.retry')}
        
        ,{k:'PromptAnalyzer::1',n:'T1'}
        ,{k:'PromptAnalyzer::2',n:'T2'}
        ,{k:'PromptAnalyzer::3',n:'T3'}
        ,{k:'PromptAnalyzer::4',n:'T4'}
        ,{k:'PromptAnalyzer::5',n:'T5'}

        //PromptAnalyzer::1
       // ,{k:'Job::PicReader::all',n:'全4张'}
    ]
    ,[
    {k:':variation::1',n:'V1'}
    ,{k:':variation::2',n:'V2'}
    ,{k:':variation::3',n:'V3'}
    ,{k:':variation::4',n:'V4'}
    ,{k:'pan_left',n: t('mj.pan_left')}
    ,{k:'pan_right',n:t('mj.pan_right') }
    ,{k:'pan_up',n:t('mj.pan_up')}
    ,{k:'pan_down',n:t('mj.pan_down')}
    ,{k:'reroll::0',n: t('mjchat.reroll')}
    ,{k:'upsample_v5_2x',n:t('mj.up2')}
    ,{k:'upsample_v5_4x',n:t('mj.up4')} 
    ,{k:'upsample_v6_2x_subtle',n:t('mj.subtle')}//t('mj.up2') 'Subtle'
    ,{k:'upsample_v6_2x_creative',n:t('mj.creative')}  //'Creative'
    ]
]

const getIndex = (arr:any[], ib:any )=> arr.findIndex( (v9:any)=>v9.customId.indexOf(ib.k)>-1 ) ;
const getIndexName=  (arr:any[], ib:any )=> {
  const i= getIndex( arr,ib);
  if(ib.k=='upsample_v5_2x') return ib.n; 

  if(ib.k=='upsample_v5_4x') return ib.n;
  //if(ib.k=='upsample_v6_4x') return ib.n;
  if(ib.k.indexOf('upsample_v6_2x')>-1 ) return ib.n;

  return `${arr[i].emoji} ${ib.n}`;
}

const load = async (isFlash=false )=>{
     changCustom();
     if(!chat.value.mjID) return ;
     let key= 'img:'+chat.value.mjID;
    try {
        if(chat.value.opt?.imageUrl){
            //await loadImg(chat.value.opt?.imageUrl);
            let base64 = await localGet(key );  
            if(!base64 || isFlash ) {
                const ubase64=  await url2base64( mjImgUrl(  chat.value.opt?.imageUrl ) ,key );
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
            ms.success( t('mj.fail1'));
            return ;
         }
         st.value.isLoadImg=false;
         load( true );
         if( !actData.noShow ) ms.success( t('mj.success1'));
    }
})
const text = computed(() => {
  const value =  props.chat.opt?.properties?.finalZhPrompt 
 return props.mdi.render(value)
   
})


const changCustom = ()=>{
    mlog('changCustom', chat.value.opt); //prompt
    st.value.customText=chat.value.opt?.prompt??'';
    
    st.value.customText +="  --zoom 1.8";
}

// const imageUrl= computed( ()=>{
//     if(chat.value.opt?.imageUrl) return chat.value.opt?.imageUrl;
//     return ''
// });

load();
</script>
<template>
<div v-if="st.isLoadImg">
    <div v-if="chat.opt?.status=='FAILURE'"> 
        <div>{{ $t('mjchat.failReason') }}<p>{{ chat.opt?.failReason }}</p></div>
    </div>
    <template  v-else-if="chat.opt?.progress">
        <div v-if="chat.opt?.action=='SHORTEN'" class="markdown-body" v-html="text" > 
             
        </div> 
        <div v-else-if="chat.opt?.action!='IMAGINE'" class="py-2 text-[#666]  whitespace-pre-wrap">{{ chat.opt?.promptEn }} (<span v-html="chat.opt?.action"></span>)</div> 
        <NImage v-if="chat.opt.imageUrl" :src="st.uri_base64?st.uri_base64: mjImgUrl( chat.opt.imageUrl)" class=" rounded-sm " :class="[isMobile?'':'!max-w-[500px]']"  /> 
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
                    <NButton type="warning" @click="sub('REROLL',1)"  size="small" v-if="chat.opt?.action==='IMAGINE'">{{ $t('mjchat.reroll') }}</NButton>

                </div>
            </template>
        </div>
        <div v-else-if="!chat.loading"> <NButton type="primary" @click="reload()">{{ $t('mjchat.reload') }}</NButton></div>
        <div v-else-if="chat.opt.progress" class="py-2 min-w-[200px]"> {{$t('mjchat.progress')}}{{chat.opt.progress}}</div>
        <div v-else class="py-2"> {{ $t('mjchat.wait') }}</div>
        <!-- <div v-html="chat.opt?.action"></div> -->
    </template>
    <div v-else> 
     {{ $t('mjchat.wait2',{id:chat.mjID}) }}
        <div v-if="!chat.loading"> <NButton type="primary" @click="reload()">{{ $t('mjchat.reload') }}</NButton></div>

    </div>
    <div class=" hidden">{{ chat.dateTime }}</div>

    <NModal v-model:show="st.isShow"   preset="card"  :title="$t('mjchat.redrawEditing')" style="max-width: 800px;" @close="st.isShow=false" >
        <aiCanvas :chat="chat" :base64="st.uri_base64" v-if="st.isShow" @success="maskOk" />
    </NModal>
    <NModal v-model:show="st.isCustom"   preset="card"  :title="$t('mj.customTitle')" style="max-width: 600px;" @close="st.isCustom=false" >
         <n-input    type="textarea"  v-model:value="st.customText"    round   maxlength="2000" show-count 
      :autosize="{   minRows:3, maxRows:8 }" />
           <div class="pt-2 flex justify-between items-center">  
                <div class="text-neutral-500">{{ $t('mj.zoominfo') }}</div>   
                <NButton type="primary"    size="small" @click="subCustom">{{ $t('mjchat.submit') }}</NButton> 
          </div>
    </NModal>
</div>
<div v-else class="w-[200px] h-[150px] flex flex-col justify-center items-center" >
    <div class="p-4">{{ $t('mjchat.loading') }}</div>
    
    <NButton type="primary" v-if="chat.opt?.imageUrl" ><a :href=" mjImgUrl(chat.opt?.imageUrl)" target="_blank">{{ $t('mjchat.openurl') }}</a></NButton> 
</div>



</template>

<style>
.markdown-body img.maxCss,img.maxCss ,.maxCss img  { max-width: 400px!important; max-height: 400px!important;}
.mmWidth{ max-width: 600px;}
html.dark .markdown-body pre code { color:#abb2bf; }
</style>