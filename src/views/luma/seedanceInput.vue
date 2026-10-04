<script setup lang="ts">
import { SdContent, SeedanceFeed, seedDanceFetch } from '@/api/seedance';
import { ref } from 'vue';
import { NSelect,NInput,NSwitch,NButton} from 'naive-ui';
import { t } from '@/locales';
import { mjFetch, mlog, upImg } from '@/api/mjapi';
import { MinimaxFeed, minimaxFetch } from '@/api/minimax';

const pp = defineProps<{ type?: string }>();

const vf=[{s:'width: 100%; height: 100%;',label:'1:1',value:'1:1'}
,{s:'width: 100%; height: 75%;',label:'4:3',value:'4:3'}
,{s:'width: 75%; height: 100%;',label:'3:4',value:'3:4'}
,{s:'width: 100%; height: 50%;',label:'16:9',value:'16:9'}
,{s:'width: 50%; height: 100%;',label:'9:16',value:'9:16'}
,{s:'width: 100%; height: 40%;',label:'21:9',value:'21:9'}
 ];
 let mvOption= [
{label:t('mjset.model')+':doubao-seedance-2-5-260628',value: 'doubao-seedance-2-5-260628'}
,{label:t('mjset.model')+':doubao-seedance-2-0-260128',value: 'doubao-seedance-2-0-260128'}
,{label:t('mjset.model')+':doubao-seedance-2-0-fast-260128',value: 'doubao-seedance-2-0-fast-260128'} 
,{label:t('mjset.model')+':doubao-seedance-2-0-mini-260615',value: 'doubao-seedance-2-0-mini-260615'} 
 ]

let resolutionOptions=[ {label: t('分辨率')+':480p',value:'480p'},{label: t('分辨率')+':720p',value:'720p'}
 ,{label: t('分辨率')+':1080p',value:'1080p'},{label: t('分辨率')+':4k',value:'4k'}]

 const durationOptions=[ 
 {label:t('mj.duration')+':5s',value:5}
 ,{label:t('mj.duration')+':6s',value:6}
 ,{label:t('mj.duration')+':7s',value:7}
 ,{label:t('mj.duration')+':8s',value:8}
 ,{label:t('mj.duration')+':9s',value:9}
 ,{label:t('mj.duration')+':10s',value:10}
 ,{label:t('mj.duration')+':11s',value:11}
 ,{label:t('mj.duration')+':12s',value:12}
 ,{label:t('mj.duration')+':13s',value:13}
 ,{label:t('mj.duration')+':14s',value:14}
 ,{label:t('mj.duration')+':15s',value:15}
 ]

 const sdText:SdContent={"type":"text","text":"在北京繁忙的人行道上进行的一个随意街头采访。采访者手持一个普通、没有品牌标志的麦克风并问道：你知道豆包的Seedance新模型吗？这是一个好用的视频模型。受访者回答说：是的，我有所了解，它已经可以在openai-hk平台上使用，太好用了。"}
 const sdinput= ref({resolution:'720p',generate_audio:true,duration:5,ratio:'16:9',"model":"doubao-seedance-2-0-mini-260615",content:[sdText]})
 const f= ref({"image":'',"image_tail":'',type:'',isLoading:false});
 const fsRef = ref()
 const imgagRef= ref <string[]>([""]);
 const videoRef= ref <string[]>([""]);
if (pp.type == 'minimax') {
    mvOption=[{label:t('mjset.model')+':MiniMax-H3',value: 'MiniMax-H3'}
    ,{label:t('mjset.model')+':MiniMax-H3-Max',value: 'MiniMax-H3-Max'}
    ];
    resolutionOptions=[ {label: t('分辨率')+':480p',value:'480P'},{label: t('分辨率')+':768p',value:'768P'}
    ,{label: t('分辨率')+':2k',value:'2K'}]
    sdinput.value.model='MiniMax-H3'
    sdinput.value.resolution='768P'
}

 const blurChnage=(key:string)=>{
     console.log("change",key)        
     if (key=='image') {
  
          
         let arr:string[]=[];
         for (let i = 0; i < imgagRef.value.length; i++) {
             const item = imgagRef.value[i];
             if(item!='' && item.startsWith('http')) { 
                 arr.push(imgagRef.value[i])
             }
         }
         imgagRef.value=arr;
         imgagRef.value.push('')           
     }
     if(key=='mp4'){
         let arr:string[]=[];
         for (let i = 0; i < videoRef.value.length; i++) {
             const item = videoRef.value[i];
             if(item!='' && item.startsWith('http')) { 
                 arr.push(videoRef.value[i])
             }
         }
         videoRef.value=arr;
         videoRef.value.push('')    
      
     }
 }

  const selectFile=  async(input:any)=>{
     console.log('selectFile',f.value.type, input.target.files[0])
      upImg(input.target.files[0]).then( async(d)=>{
        
        try{
            d=  await mjFetch('/mj/submit/upload-discord-images' ,{"base64Array":[d]}  );
            if(d.code== 1){
                if( f.value.type=='image'){ 
                    f.value.image= d.result[0];
                }else if( f.value.type=='image_tail'){
                    f.value.image_tail= d.result[0];
                }
            }
             
        }catch(e){
            
        }
      }).finally(()=>{
          fsRef.value.value=''
      });
  }

const uploadImage=  (type:string)=>{
      f.value.type=type;
      fsRef.value.click();
  }

const createVideo = async()=>{
    for (let i = 0; i < imgagRef.value.length; i++) {
        const item = imgagRef.value[i];
        if(item!='' && item.startsWith('http')) {       
           sdinput.value.content.push({"type":"image_url","role":'reference_image',"image_url":{url:item}})
        }
    }
    for (let i = 0; i < videoRef.value.length; i++) {
        const item = videoRef.value[i];
        if(item!='' && item.startsWith('http')) {       
           sdinput.value.content.push({"type":"video_url","role":'reference_video',"video_url":{url:item}})
        }
    }
    if(f.value.image!=""){
        sdinput.value.content.push({"type":"image_url","role":'first_frame',"image_url":{url:f.value.image}})
    }
    if(f.value.image_tail!=""){
        sdinput.value.content.push({"type":"image_url","role":'last_frame',"image_url":{url:f.value.image}})
    }

    //console.log('sdinput',sdinput.value);
    f.value.isLoading=true;
    try {
        if( pp.type=='minimax' ) {
             mlog('minimax', sdinput.value );
             //const bodydata= sdinput.value;
             //delete bodydata.generate_audio;
            const d:any= await minimaxFetch('/v2/video_generation' , sdinput.value  )
            mlog('minimax', d ); //task_GhE6ZauDF2NxKrpPrBH2LtzkfJEtUAhP
            MinimaxFeed(d.task_id, sdinput.value.content[0].text??'')

        }else{
            const d:any= await seedDanceFetch('/api/v3/contents/generations/tasks' , sdinput.value  )
            mlog('sd', d ); //task_GhE6ZauDF2NxKrpPrBH2LtzkfJEtUAhP
            SeedanceFeed(d.id, sdinput.value.content[0].text??'')
        }
       
    }finally{
        f.value.isLoading=false;
    }
    
    //klingFeed( d.data.task_id , cat ,  f.value.prompt )
     
}
//SeedanceFeed('task_GhE6ZauDF2NxKrpPrBH2LtzkfJEtUAhP','good news')
</script>
<template>
<div class="p-2"> 
    <div class=" flex items-center justify-between space-x-1">
        <template  v-for="(item,index) in vf" >
            <section class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"  :class="{'active':sdinput.ratio==item.value}"  @click="sdinput.ratio=item.value">
                <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
                    <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
                </div>
                <p class="mb-1 text-center text-sm">{{ item.label }}</p>
            </section>
        </template>
    </div>
    <section class="mt-2">
        <n-input v-model:value="sdinput.content[0].text" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </section>
    <section  class="mt-2 flex justify-between items-center" v-if="pp.type!='minimax'" >
        <div>{{ $t('声音') }}</div>
        <n-switch v-model:value="sdinput.generate_audio" size="small"  />
    </section>
    <section class="mt-2 flex justify-between items-center" >
         <!-- <div>{{ $t('mjset.model') }}</div> -->
         <n-select v-model:value="sdinput.model" size="small" :options="mvOption"  class="w-full" />     
    </section>

    <section class="mt-2 flex justify-between items-center" >
         <!-- <div>{{ $t('分辨率') }}</div> -->
         <n-select v-model:value="sdinput.resolution" size="small" :options="resolutionOptions"  class="w-full" />     
    </section>
    <section class="mt-2 flex justify-between items-center" >
         <!-- <div>{{ $t('mj.duration') }}</div> -->
         <n-select v-model:value="sdinput.duration" size="small" :options="durationOptions"  class="w-full" />     
    </section>
   
    <section class="mt-2 flex justify-start  items-end">
        
            <div> 
                <!-- <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/> -->
                <div   class="h-[80px] w-[80px]   overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer"  @click="uploadImage('image')" >
                    <img :src="f.image" v-if="f.image" />
                    <div class="text-center" v-else>{{ $t('首帧') }}</div> 
                    
                </div>
            </div>
            <div class="pl-2"> 
                <!-- <input type="file"  @change="selectFile2"  ref="fsRef2" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/> -->
                <div class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer"  @click="uploadImage('image_tail')"  >
                    <img :src="f.image_tail" v-if="f.image_tail" />
                    <div class="text-center" v-else>{{ $t('尾帧') }}</div> 
                </div>
            </div>
           
    </section>
    <section class="mt-2">
        <div>参考图</div>
        <div v-for="(item,i) in imgagRef" class="mt-1"><n-input size="small" placeholder="https://a.com/a.jpg" v-model:value="imgagRef[i]" @blur="blurChnage('image')" /></div>
    </section>
     <section class="mt-2">
        <div>参考视频</div>
         <div class="mt-1"  v-for="(item,i) in videoRef"><n-input size="small" placeholder="https://a.com/a.mp4"  v-model:value="videoRef[i]" @blur="blurChnage('mp4')" /></div>
    </section>
    <section class="mt-2 flex justify-end items-center"> 
       
        <NButton   :loading="f.isLoading" type="primary" @click="createVideo()" :disabled="!sdinput.content[0].text"  >{{$t('video.generate')}}</NButton>

    </section>
</div>
<input type="file"  @change="selectFile" ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>

</template>