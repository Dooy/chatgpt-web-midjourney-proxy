<script setup lang="ts">
import { ref,computed ,onMounted} from 'vue';
import { NTabs ,NTabPane ,NInput,NSwitch ,NTooltip, NTag ,NButton, useMessage,NSelect} from "naive-ui";
import { SvgIcon } from '@/components/common';
import { mlog } from '@/api';
import { sunoFetch ,lyricsFetch, randStyle, FeedTask} from '@/api/suno';
import { t } from '@/locales';
import { homeStore } from '@/store';

const st = ref({type:'custom',isLoading:false})
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
        let r:any= await sunoFetch(  '/generate' ,  cs.value ) 
        st.value.isLoading =false;

       ids=r.clips.map((r:any)=>r.id);
        mlog('ids ', ids );
    }else{
        des.value.prompt=cs.value.title;
        let r:any= await sunoFetch(  '/generate/description-mode' ,  des.value )  
        st.value.isLoading =false; 
        ids=r.clips.map((r:any)=>r.id);
    }
    FeedTask(ids)
}

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
        </n-tab-pane>
    </n-tabs>

    <div class="pt-4">
        <div class="flex justify-between items-start">
            <div>
                  <NTag v-if="st.type=='custom'" type="success" size="small" round  ><span class="cursor-pointer" @click="generateLyrics()" >{{ $t('suno.generately') }}</span></NTag>
            </div>
            <NButton type="primary" :disabled="!canPost" @click="generate()"><SvgIcon icon="ri:music-fill"  /> {{$t('suno.generate')}}</NButton> 
        </div>
    </div>
</div>

</template>