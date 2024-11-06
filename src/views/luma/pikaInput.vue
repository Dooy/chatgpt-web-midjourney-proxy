<script setup lang="ts">
import { ref } from 'vue';
import { mlog, upImg } from '@/api'; 
import { useMessage,NButton,NInput,NTag,NSelect,NPopover,NSwitch } from 'naive-ui';
 
import { t } from "@/locales"; 
import { pikaFeed, pikaFetch } from '@/api/pika';

let txt2v={
 	"pikaffect": "",
	"promptText": "",
	"model": "1.5",
	"options": {"aspectRatio":1.7777777777777777,"frameRate":24,"camera":{},"parameters":{"guidanceScale":12,"motion":1,"negativePrompt":""},"extend":false}
   
}
let img2v={
 	"pikaffect": "",
	"promptText": "",
	"model": "1.5",
	"options": {"frameRate":24,"camera":{},"parameters":{"guidanceScale":12,"motion":1,"negativePrompt":""},"extend":false}
   ,"image":"https://www.openai-hk.com/res/img/open.png"
}

const vf=[{s:'width: 100%; height: 100%;',label:'1:1',value:1}
,{s:'width: 100%; height: 75%;',label:'4:3',value:1.3333333333333333}
,{s:'width: 75%; height: 100%;',label:'3:4',value:0.75}
,{s:'width: 100%; height: 50%;',label:'16:9',value:1.7777777777777777}
,{s:'width: 50%; height: 100%;',label:'9:16',value:0.5625}
 ];


let ezOption = [
        {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/levitate.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/levitate.jpg",
            title: "Levitate"
            
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/decapitate.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/decapitate.jpg",
            title: "Decapitate"
            
        },{
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/eye-pop.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/eye-pop.jpg",
            title: "Eye-pop"
            
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/tada.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/tada.jpg",
            title: "Ta-da"
            
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/deflate.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/deflate.jpg",
            title: 'Deflate'
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/crumble.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/crumble.jpg",
            title: 'Crumble'
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/dissolve.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/dissolve.jpg",
            title: 'Dissolve'
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/squish.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/squish.jpg",
            title: 'Squish'
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/inflate.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/inflate.jpg",
            title: 'Inflate'
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/melt.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/melt.jpg",
            title: 'Melt',
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/crush.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/crush.jpg",
            title: 'Crush'
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/cake-ify.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/cake-ify.jpg",
            title:'Cake-ify'
        }, {
            video: "https://cdn.pika.art/feature/v1.5/pikaffect/explode.webm",
            poster: "https://cdn.pika.art/feature/v1.5/pikaffect/explode.jpg",
            title: 'Explode',
            //text:'Explode it'
        }];

const pika= ref({image:'',prompt:'',aspectRatio:1.7777777777777777,negativePrompt:'',pe_index:-1});
const fsRef= ref() ; 
const ms = useMessage();
const st= ref({ isLoading:false});

function selectFile(input:any){
   // fsFile.value= input.target.files[0];
    upImg(input.target.files[0]).then(d=>{
        pika.value.image= d;
        fsRef.value=''
    }).catch(e=>ms.error(e));
}
const clearInput = ()=>{
    pika.value.prompt='';
    pika.value.image= ''; 
    fsRef.value='' 
    pika.value.pe_index= -1;
}
const createVideo = async()=>{
    let sb= pika.value.image ? {...img2v} : {...txt2v};
    sb.promptText= pika.value.prompt; 
    sb.options.parameters.negativePrompt= pika.value.negativePrompt;
    if( pika.value.image ){
        sb.image= pika.value.image;
    }else{
        sb.options.aspectRatio= pika.value.aspectRatio;
    }
    if(pika.value.pe_index>=0){
        sb.pikaffect= ezOption[pika.value.pe_index].title
    }
    mlog('sb>> '  ,  sb  );
    st.value.isLoading= true
    try {
        const a:any= await pikaFetch('/generate' , sb  )
        st.value.isLoading= false
        if(a.id){
            pikaFeed( a.id)
        }else{
            ms.error( t('mj.createFail') );//createFail
        }
    } catch (error) {
        st.value.isLoading= false
    } 
}

const selecteffect = (i:number)=>{
    pika.value.pe_index= i ;
    pika.value.prompt= ezOption[i].title+' it';
}
</script>
<template>
<div class="p-2"> 
    <div class=" flex items-center justify-between space-x-1">
        <template  v-for="(item,index) in vf" >
            <section class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"  :class="{'active':pika.aspectRatio==item.value}"  @click="pika.aspectRatio=item.value">
                <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
                    <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
                </div>
                <p class="mb-1 text-center text-sm">{{ item.label }}</p>
            </section>
        </template>
    </div>
    <div class="pt-1" >
      <n-input v-model:value="pika.prompt" 
                :placeholder="$t('video.descpls')"  type="textarea"  size="small"   
                :autosize="{ minRows: 3, maxRows: 12  }"  />
    </div>
    <section class="pt-1 flex justify-between items-center" >
         <div>{{ $t('mj.nohead') }}</div>
          <NInput v-model:value="pika.negativePrompt" size="small"  class="!w-[70%]"  clearable :placeholder="$t('mj.negative_prompt')" />
    </section>
    <div class="pt-2">
        <div class="flex justify-between  items-end">
            <div> 
                <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
                <div   class="h-[80px] w-[80px]   overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" @click=" fsRef.click()">
                    <img :src="pika.image" v-if="pika.image" />
                    <div class="text-center" v-else>{{ $t('video.selectimg') }}</div> 
                </div>
            </div>
            <div>
            <NPopover trigger="hover">
                <template #trigger>
                    <div   class="h-[80px] w-[150px]  relative  overflow-hidden rounded-sm border border-gray-400/20 flex justify-center items-center cursor-pointer" >
                        <template v-if="pika.pe_index>-1">
                            <img :src="ezOption[pika.pe_index].poster"  />
                            <div class="absolute top-1 right-1 text-white/75 text-[14px]" >{{ ezOption[pika.pe_index].title }}</div>
                        </template>
                        <div class="text-center" v-else>{{ $t('mj.selecteff') }}</div> 
                    </div>
                </template>
                <div class="w-[320px] h-[400px] overflow-y-auto overflow-hidden mx-[-4px]">
                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="(item, index) in ezOption" :key="index" >
                            <div class="relative   overflow-hidden cursor-pointer " @click="selecteffect(index)">
                                <video class="h-[72px] w-full rounded-md object-cover"  :src="item.video"  :poster="item.poster" 
                                 autoplay  loop  playsinline ></video>
                                <div class="absolute top-1 right-1 text-white/75 text-[14px]" >{{ item.title }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </NPopover>
            </div>
        </div>
    </div>
    <section class="pt-2 flex justify-end items-end">
            
            <div  class=" cursor-pointer pr-2" @click="clearInput"  v-if="pika.image|| pika.prompt"><NTag type="success" size="small" :bordered="false" round  ><span class="cursor-pointer">{{$t('video.clear')}}</span></NTag></div>
            
            <div class="text-right">

                    <NButton :loading="st.isLoading" type="primary" @click="createVideo()" :disabled="!pika.prompt"  >{{$t('video.generate')}}</NButton>
            </div>
    </section>
</div>
</template>