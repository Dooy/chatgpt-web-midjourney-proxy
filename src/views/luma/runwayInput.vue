<script setup lang="ts">
import { mlog, upImg } from '@/api';
import { runwayFeed, runwayFetch, runwayUpload } from '@/api/runway';
import { gptServerStore, homeStore } from '@/store';
import { useMessage,NInput,NButton, NTag,NSelect } from 'naive-ui';
import { computed, onMounted, ref, watch } from 'vue';
import { SvgIcon } from '@/components/common';
import { t } from '@/locales';

const fsRef= ref() ;
const runway= ref<{image_prompt?:string,seed:number,text_prompt:string}>({image_prompt:'',seed:1675247627,text_prompt:''});
const st= ref({isDo:false,uploading:false, version:'gen2',time:5});
const ms = useMessage();
async function  selectFile(input:any){
    mlog("selectFile", input.target.files[0])
    const file = input.target.files[0]  

    st.value.uploading= true
    try{
    let d= await runwayUpload( file,'DATASET_PREVIEW')
    mlog("runwayFetch",d)
    runway.value.image_prompt= d.url
    }catch(e :any){
       ms.error(e )
    }
     st.value.uploading= false
    
}
function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const canPost = computed(() => {
    return (runway.value.image_prompt!='' || runway.value.text_prompt!='' ) && !st.value.isDo
})

const generate= async ()=>{
    st.value.isDo= true
    //runway.value.seed= getRandomInt(1675247627, 3275247627)
    let seed= getRandomInt(1375247627, 3975247627);
    try{
        let obj={
            "taskType": "gen2",
            "internal": false,
            "options": {
                "name": `Gen-2 ${seed}`,
                "seconds": 4,
                "gen2Options": {
                "mode": "gen2",
                "seed": seed,
                "interpolate": true,
                "upscale": false,
                "watermark": true,
                "motion_score": 22,
                "use_motion_score": true,
                "use_motion_vectors": false,
                "text_prompt":  runway.value.text_prompt,
                "image_prompt": runway.value.image_prompt, 
                "init_image": runway.value.image_prompt
                },
                "exploreMode": false,
                "assetGroupName": "Generative Video"
            },
           // "asTeamId": 17485144
        }

//         {
//   "name": "Gen-3 Alpha 2584627205, 笑起来, Cropped - cqkrcrc8j3",
//   "seconds": 5,
//   "text_prompt": "笑起来",
//   "seed": 2584627205,
//   "exploreMode": true,
//   "watermark": false,
//   "enhance_prompt": true,
//   "init_image": "https://d2jqrm6oza8nb6.cloudfront.net/previews/21fb66fc-c9d0-4c92-863d-623b77ab742b.webp?_jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXlIYXNoIjoiNjI5MzQ4YTc0ODIwYWZiMiIsImJ1Y2tldCI6InJ1bndheS1kYXRhc2V0cyIsInN0YWdlIjoicHJvZCIsImV4cCI6MTcyMjY0MzIwMH0.x5f94vMk6Yt4dQTw4ueBnWOJ1EFRqOAp_vaLUcT5bs0",
//   "resolution": "720p",
//   "assetGroupName": "Generative Video"
// }
        let gen3= {
                "taskType": "europa",
                "internal": false,
                "options": {
                    "name": `Gen-3 Alpha  ${seed}`,
                    "seconds": st.value.time,
                    "text_prompt":runway.value.text_prompt,
                    "seed":seed,
                    "exploreMode": true,
                    "watermark": false,
                    "enhance_prompt": true,
                    "width": 1280,
                    "height": 768,
                    "assetGroupName": "Generative Video",
                    "init_image": runway.value.image_prompt,
                    "resolution": '720p'// runway.value.image_prompt,
                },
            //    "asTeamId": 17511575
        }

        if( obj.options.gen2Options.image_prompt==''){
            delete obj.options.gen2Options.image_prompt;
            delete obj.options.gen2Options.init_image;
        }
        if( gen3.options.init_image=='' ){
            delete gen3.options.init_image;
            //delete gen3.options.resolution;
        } 
        const d=  await runwayFetch('/tasks', st.value.version=='europa'? gen3: obj) 
        mlog("runwayGen2",d) 
        d.task && d.task.id&& runwayFeed(d.task.id)
    }catch(e:any){
        ms.error(e)
    }
    st.value.isDo=false

}

const mvOption= [
{label: t('video.rwgen2'),value: 'gen2'}
,{label:t('video.rwgen3'),value: 'europa'}
 ]
 const timeOption= [
{label: 'Duration: 5s',value: 5}
,{label:'Duration: 10s',value: 10}
 ]

 

const clearInput=()=>{
    runway.value.image_prompt ='' 
    runway.value.text_prompt =''
}
watch(()=>st.value.version,(n:string)=>{
    gptServerStore.setMyData({RRUNWAY_VERSION:n})
})
onMounted(() => {
    homeStore.setMyData({ms:ms})
    st.value.version= gptServerStore.myData.RRUNWAY_VERSION?gptServerStore.myData.RRUNWAY_VERSION: 'gen2'
});
</script>
<template>
<div class="px-2"> 
    <div  class="pt-1"  >
        <n-select v-model:value="st.version" :options="mvOption" size="small" />
    </div>
    <div class="pt-1">
      <n-input v-model:value="runway.text_prompt" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </div>
    <div  class="pt-1" v-if="st.version=='europa'" >
        <n-select v-model:value="st.time" :options="timeOption" size="small" />
    </div>

    <div class="pt-1">
        <div class="flex justify-between  items-end">
            <div> 
                <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                
                <!-- <div v-if="st.version=='europa'"
                 class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center"
                >
                 {{ $t('video.nosup') }} 
                </div> -->
                <div   class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                  
                   
                    <SvgIcon icon="line-md:uploading-loop" class="text-[60px] text-green-300"  v-if="st.uploading"  ></SvgIcon>
                    <img :src="runway.image_prompt" v-else-if="runway.image_prompt" />
                    <div class="text-center"  v-else >{{ $t('video.selectimg') }}</div> 
                   
                </div>
            </div>
            <div class="text-right">
                 <div class="pb-1 text-right">
                    <NTag v-if="runway.text_prompt!='' || runway.image_prompt!=''" type="success" size="small" round  ><span class="cursor-pointer" @click="clearInput()" >{{$t('video.clear')}}</span></NTag>
                </div>
                <NButton  :loading="st.isDo" type="primary" :disabled="!canPost" @click="generate()"><SvgIcon icon="ri:video-add-line"  /> {{$t('video.generate')}}</NButton> 
            </div>
        </div>
    </div>

    <div class="pt-2 text-[12px]" v-html="$t('video.runwayinfo')">
        
    </div>
</div>
</template>