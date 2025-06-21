<script setup lang="ts">
import { ref,computed, onMounted } from 'vue';
import { NTabs ,NTabPane ,NInput,NSwitch ,NTooltip, NTag ,NButton, useMessage,NSelect, NImage, NSlider} from "naive-ui";
import { SvgIcon } from '@/components/common';
import { riffFetch , riffFeed} from '@/api/riff';
import {randStyle} from '@/api/suno';
import { mlog } from '@/api';
import { homeStore } from '@/store';

const st = ref({type:'custom',isLoading:false})

const cs= ref({  "model": "FUZZ-1.1 Pro",  "lyrics": "",  "tag": "", "title":"",instrumental:false  });

const des= ref({ "model":"FUZZ-1.1 Pro",  "topic":"",   "instrumental":false});
const mvOption= [
{label: 'verion: v1.1 Pro',value: 'FUZZ-1.1 Pro'}
,{label:'verion: v1.1',value: 'FUZZ-1.1'}
,{label:'verion: v1 Pro',value: 'FUZZ-1.0 Pro'}
,{label:'verion: v1',value: 'FUZZ-1.0'}
 ]

const canPost = computed(() => {
   // return true; 
    if( st.value.isLoading ) return false;
    if( st.value.type=='custom'){
        return cs.value.tag && cs.value.title
    }
    if( st.value.type=='description' ){
       // mlog('des: ', des.value.gpt_description_prompt , des.value.make_instrumental )
       return des.value.topic 
        
    }
    return true
})
 const generate= async()=>{
    let r:any
    st.value.isLoading =true;
    try {
        if(st.value.type=='custom'){ 
            r= await riffFetch(  '/generate' ,  cs.value )  
        }else{
            r= await riffFetch(  '/generate/topic' ,  des.value ) 
        }
    } catch (error) {
        
    }
    st.value.isLoading =false;
    mlog('r:',r)
    if( r.jobs && r.jobs.length>0){
        let ids='';
        for(let o of r.jobs){
            if(ids!='') ids+=',';
            ids+=o.id
        }
        //mlog('ids:',ids)
        riffFeed(ids )
    }
    //
 }
 const ms = useMessage();
 onMounted(() => {
     //riffFeed('678d5ca5-331f-41df-a6a9-67c7bc567552,3dda982e-7cf6-4268-ae22-e7f86ed7a944')
      homeStore.setMyData({ms:ms})
 })
</script>
<template>
<div class="p-2"> 
    <n-tabs type="segment" animated  v-model:value="st.type">
        <n-tab-pane name="description" :tab="$t('suno.description')">
             
            <div  class="pt-4 flex justify-between">
                <div>{{$t('suno.desc')}}:</div>
                <div> 
                    <n-switch v-model:value="des.instrumental" size="small">
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
                <n-input v-model:value="des.topic"  
                :placeholder="$t('suno.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
            </div>
            <div  class="pt-1">
                 <n-select v-model:value="cs.model" :options="mvOption" size="small" />
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
                <n-input :placeholder="$t('suno.stylepls')" v-model:value="cs.tag">
                    <template #prefix>
                        <span>{{$t('suno.style')}}：</span>
                    </template>
                    <template #suffix>
                        <n-tooltip placement="right" trigger="hover">
                            <template #trigger>
                                <div class="cursor-pointer" @click="cs.tag= randStyle()"><SvgIcon  icon="fa:random" class="w-4 h-4" /></div>
                            </template>
                            <div>{{$t('suno.rank')}}</div>
                            
                        </n-tooltip>
                    </template>
                </n-input>
            </div>

            <div  class="pt-4 flex justify-between">
                <div>{{$t('suno.ly')}} :</div>
                <div> 
                    <n-switch v-model:value="cs.instrumental" size="small">
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
                <n-input v-model:value="cs.lyrics" :disabled="cs.instrumental"
                :placeholder="$t('suno.lypls')" type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
            </div>
            <div  class="pt-1">
                 <n-select v-model:value="cs.model" :options="mvOption" size="small" />
            </div>
         </n-tab-pane>
    </n-tabs>
      <div class="pt-4">
        <div class="flex justify-between items-start">
            <div class=" space-x-1">
                  <!-- <NTag v-if="st.type=='custom'" type="success" size="small" round  ><span class="cursor-pointer" @click="generateLyrics()" >{{ $t('suno.generately') }}</span></NTag> -->
                  <!-- <NTag v-if="st.type=='custom'" type="success" size="small" round  ><span class="cursor-pointer" @click="generateLyrics()" >上传音频</span></NTag> -->
                  <!-- <mcUploaderMp3 v-if="st.type=='custom'"/> -->
            </div>
            <NButton type="primary" :disabled="!canPost" @click="generate()"><SvgIcon icon="ri:music-fill"  /> {{$t('suno.generate')}}</NButton> 
        </div>
        
       
    </div>
</div>
</template>