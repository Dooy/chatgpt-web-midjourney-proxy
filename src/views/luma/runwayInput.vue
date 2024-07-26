<script setup lang="ts">
import { mlog, upImg } from '@/api';
import { runwayFeed, runwayFetch, runwayUpload } from '@/api/runway';
import { gptServerStore, homeStore } from '@/store';
import { useMessage,NInput,NButton, NTag,NSelect } from 'naive-ui';
import { computed, onMounted, ref, watch } from 'vue';
import { SvgIcon } from '@/components/common';

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
                    "assetGroupName": "Generative Video"
                },
            //    "asTeamId": 17511575
        }

        if( obj.options.gen2Options.image_prompt==''){
            delete obj.options.gen2Options.image_prompt;
            delete obj.options.gen2Options.init_image;
        }
        const d=  await runwayFetch('/tasks', st.value.version=='europa'? gen3: obj) 
        mlog("runwayGen2",d)
        //f31e6774-6a66-41fa-988c-560fb35dada7
        //4e01d4b4-e1a8-4c0e-8d7d-1c90568086f2 error
        //d1274699-2dcc-49b5-86c2-19416e8b6a54
        d.task && d.task.id&& runwayFeed(d.task.id)
    }catch(e:any){
        ms.error(e)
    }
    st.value.isDo=false

}

const mvOption= [
{label: '版本: Gen-2, 价格实惠',value: 'gen2'}
,{label:'版本: Gen-3 Alpha',value: 'europa'}
 ]
 const timeOption= [
{label: 'Duration: 5s',value: 5}
,{label:'Duration: 10s',value: 10}
 ]

// runwayFeed('4e01d4b4-e1a8-4c0e-8d7d-1c90568086f2')
// runwayFeed('d1274699-2dcc-49b5-86c2-19416e8b6a54')
// runwayFeed('f31e6774-6a66-41fa-988c-560fb35dada7')

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
                
                <div v-if="st.version=='europa'"
                 class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center"
                >
                 暂不支持 
                </div>
                <div  v-else class="h-[80px] w-[80px] overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                  
                   
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

    <div class="pt-2 text-[12px]">
        说明：
        <ul>
            <li>1. Runway 图片与视频都有有效期</li>
            <li>2. 请在生成视频后30分钟内将mp4保存到本地</li>
        </ul>
    </div>
</div>
</template>