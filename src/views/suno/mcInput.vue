<script setup lang="ts">
import { ref,computed ,onMounted, watch} from 'vue';
import { NTabs ,NTabPane ,NInput,NSwitch ,NTooltip, NTag ,NButton, useMessage,NSelect, NImage, NSlider} from "naive-ui";
import { SvgIcon } from '@/components/common';
import { mlog } from '@/api';
import { sunoFetch ,lyricsFetch, randStyle, FeedTask} from '@/api/suno';
import { t } from '@/locales';
import { homeStore } from '@/store';
import { SunoMedia } from '@/api/sunoStore';
import mcUploaderMp3 from './mcUploadMp3.vue'

const st = ref({type:'custom',isLoading:false})
const exSuno= ref<SunoMedia>()
const des= ref( {
  "gpt_description_prompt": "",
  "make_instrumental": false,
  "mv": "chirp-v3-5",
  "prompt": ""
});
const cs= ref({
  "prompt": "",
  "mv": "chirp-v3-5",
  "title": "",
  "tags": "",
  "continue_at": 120,
  "continue_clip_id": ""

});

const mvOption= [
{label: 'verion: v3.5',value: 'chirp-v3-5'}
,{label:'verion: v3',value: 'chirp-v3-0'}
 ]

const canPost = computed(() => {
   // return true; 
    if( st.value.isLoading ) return false;
    if( st.value.type=='custom'){
        return cs.value.tags && cs.value.title
    }
    if( st.value.type=='description' ){
        mlog('des: ', des.value.gpt_description_prompt , des.value.make_instrumental )
        return cs.value.title &&( des.value.gpt_description_prompt || des.value.make_instrumental)
    }
    return true
})

const ms = useMessage();
onMounted(() => {
    homeStore.setMyData({ms:ms})
});
//生成歌词
const generateLyrics= ()=>{
    //generate/lyrics
    let prompt = cs.value.prompt || cs.value.title;
    if (!prompt){
        ms.error(   t('suno.inputly') )
        return 
    }
    if(st.value.isLoading) {
         ms.info( t('suno.doingly'));
        return;
    }
    st.value.isLoading =true;
    ms.info( t('suno.doingly2') );
    sunoFetch(  '/generate/lyrics/' ,  {prompt}).then(async (r:any )=>{
        mlog('lyrics', r);
        let dz:any = await lyricsFetch( r.id );
         mlog('lyrics rz =>', dz );
        if(dz!=null){  

            cs.value.prompt= dz.text;
            cs.value.title= dz.title;
        }
        st.value.isLoading =false;

    }).catch(()=>  st.value.isLoading =false );
    if( !cs.value.tags ) cs.value.tags= randStyle()
}

const generate= async ()=>{
    st.value.isLoading =false;
    let ids:string[]= ["0d435185-d440-42c8-982a-50205e1cf17d","43e095ba-5f08-4920-bb3d-89dd0defe0b7"];
    ids=["d359a0aa-adf1-4298-9074-005573d7cc84","12e3d62f-8fcc-497b-8365-194657582519"]

    if(st.value.type=='custom'){ 
        if(des.value.make_instrumental) cs.value.prompt='';
        if( cs.value.continue_clip_id!='' && exSuno.value?.metadata?.type=='upload' ){
            //chirp-v3-5-upload
            cs.value.mv='chirp-v3-5-upload'
        }
        let r:any= await sunoFetch(  '/generate' ,  cs.value ) 
        st.value.isLoading =false;

       ids=r.clips.map((r:any)=>r.id);
       mlog('ids ', ids );
       if( cs.value.mv='chirp-v3-5-upload' ) cs.value.mv='chirp-v3-5'
    }else{
        des.value.prompt=cs.value.title;
        let r:any= await sunoFetch(  '/generate/description-mode' ,  des.value )  
        st.value.isLoading =false; 
        ids=r.clips.map((r:any)=>r.id);
    }
    FeedTask(ids)
}





watch(()=>homeStore.myData.act, (n)=>{
    if(n=='suno.extend'){
        mlog("suno.extend", homeStore.myData.actData )
        const s= homeStore.myData.actData as SunoMedia
        exSuno.value= s 
        cs.value.continue_clip_id= s.id
        cs.value.continue_at= Math.ceil(s.metadata.duration/2) 
    }
});

</script>
<template>
<div class="p-2"> 
    <n-tabs type="segment" animated  v-model:value="st.type">
        <!-- <n-tab-pane name="start" tab=""> 

        </n-tab-pane> -->
        <!-- <NText depth="3" class="text-center">{{ $t('suno.mic') }}</NText> -->
        <n-tab-pane name="description" :tab="$t('suno.description')">
            <div class="pt-1">
                <n-input :placeholder="$t('suno.titlepls')" v-model:value="cs.title">
                <template #prefix>
                     <span>{{$t('suno.title')}}：</span>
                </template>
                </n-input>
            </div>
            <div  class="pt-4 flex justify-between">
                <div>{{$t('suno.desc')}}:</div>
                <div> 
                    <n-switch v-model:value="des.make_instrumental" size="small">
                        <template #checked>
                         {{ $t('suno.noneedly') }}
                        </template>
                        <template #unchecked>
                         {{ $t('suno.noneedly') }}
                        </template>
                    </n-switch>
                </div>
            </div>
            <div  class="pt-1"> 
            <n-input v-model:value="des.gpt_description_prompt" :disabled="des.make_instrumental"
                :placeholder="$t('suno.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
            </div>
            <div  class="pt-1">
                 <n-select v-model:value="des.mv" :options="mvOption" size="small" />
            </div>
        </n-tab-pane>

        <n-tab-pane name="custom" :tab="$t('suno.custom')">
            <div class="pt-1">
                <n-input :placeholder="$t('suno.titlepls')" v-model:value="cs.title">
                <template #prefix>
                     <span>{{$t('suno.title')}}：</span>
                </template>
                </n-input>
            </div>
             <div class="pt-4">
                <n-input :placeholder="$t('suno.stylepls')" v-model:value="cs.tags">
                    <template #prefix>
                        <span>{{$t('suno.style')}}：</span>
                    </template>
                    <template #suffix>
                        <n-tooltip placement="right" trigger="hover">
                            <template #trigger>
                                <div class="cursor-pointer" @click="cs.tags= randStyle()"><SvgIcon  icon="fa:random" class="w-4 h-4" /></div>
                            </template>
                            <div>{{$t('suno.rank')}}</div>
                            
                        </n-tooltip>
                    </template>
                </n-input>
            </div>

            <div  class="pt-4 flex justify-between">
                <div>{{$t('suno.ly')}} :</div>
                <div> 
                    <n-switch v-model:value="des.make_instrumental" size="small">
                        <template #checked>
                        {{ $t('suno.noneedly') }}
                        </template>
                        <template #unchecked>
                         {{ $t('suno.noneedly') }}
                        </template>
                    </n-switch>
                </div>
            </div>
            <div  class="pt-1"> 
                <n-input v-model:value="cs.prompt" :disabled="des.make_instrumental"
                :placeholder="$t('suno.lypls')" type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
            </div>
            <div  class="pt-1">
                <n-select v-model:value="cs.mv" :options="mvOption" size="small" />
            </div>
            <template v-if="cs.continue_clip_id && exSuno">
                <div  class="pt-5">
                    <div class="flex justify-between pb-3">
                        <div class="text-[12px]"> {{ $t('suno.extendAt') }} {{ cs.continue_at }}s</div>
                        <NTag  type="success" size="small" round  ><span class="cursor-pointer" @click="cs.continue_clip_id=''" >清除</span></NTag>

                    </div>
                    <n-slider v-model:value="cs.continue_at" :step="1" :max="Math.ceil( exSuno.metadata.duration)">
                        <template #thumb>
                            <div class="bg-[--n-fill-color] text-[9px]  border-[0px]  px-1 list-none rounded-md">{{ cs.continue_at }}s</div>
                        </template>
                    </n-slider>
                </div>
                <div  class="pt-1"  >
                    <div class="flex relative  justify-between items-start p-2 hover:dark:bg-black hover:bg-gray-200 border-b-[1px] border-gray-500/10 ">
                        <div class="w-[60px] h-[60px] relative  cursor-pointer" >
                            <n-image  lazy  width="100"  :src="exSuno.image_url" preview-disabled  >
                                <template #placeholder>
                                    <div class="w-full h-full justify-center items-center flex"  >
                                    <SvgIcon icon="line-md:downloading-loop" class="text-[40px] text-green-300"   ></SvgIcon>
                                    </div>
                                </template>
                            </n-image>
                        </div>
                        <div class="flex-1  pl-2"> 
                            <div class="flex justify-between line-clamp-1 w-full cursor-pointer"  >
                                <h3>{{exSuno.title}}</h3>
                                <!-- <div class="opacity-80"  >{{exSuno.metadata.tags}}</div> -->
                            </div>
                            <div class="opacity-60 line-clamp-1 w-full text-[12px] cursor-pointer"   v-if="exSuno.metadata && exSuno.metadata.prompt">
                            {{exSuno.metadata.prompt}}
                            </div>
                            <div class="opacity-60 line-clamp-1 w-full text-[12px] cursor-pointer"  v-else>
                            {{$t('suno.noly')}}
                            </div>
                            <div class="text-right text-[14px] flex justify-end items-center space-x-2  ">
                            
                                <div v-if="exSuno.status=='error'" class="text-[8px] flex items-center border-[1px] border-red-500/80 px-1 list-none rounded-md ">失败</div>
                                <template v-if="exSuno.metadata && exSuno.metadata.duration">
                                    <div class="text-[8px] flex items-center border-[1px] border-gray-500/30 px-1 list-none rounded-md" > {{exSuno.metadata.duration.toFixed(1)}}s</div>
                                </template>
                                <div class="text-[8px] flex items-center border-[1px] border-gray-500/30 px-1 list-none rounded-md" v-if="exSuno.major_model_version"> {{exSuno.major_model_version}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </n-tab-pane>
    </n-tabs>

    <div class="pt-4">
        <div class="flex justify-between items-start">
            <div class=" space-x-1">
                  <NTag v-if="st.type=='custom'" type="success" size="small" round  ><span class="cursor-pointer" @click="generateLyrics()" >{{ $t('suno.generately') }}</span></NTag>
                  <!-- <NTag v-if="st.type=='custom'" type="success" size="small" round  ><span class="cursor-pointer" @click="generateLyrics()" >上传音频</span></NTag> -->
                  <mcUploaderMp3 v-if="st.type=='custom'"/>
            </div>
            <NButton type="primary" :disabled="!canPost" @click="generate()"><SvgIcon icon="ri:music-fill"  /> {{$t('suno.generate')}}</NButton> 
        </div>
        
       
    </div>
    <div v-if="st.type=='custom'" class="pt-4 text-[12px]" v-html="t('suno.info')"> </div>

</div>

</template>