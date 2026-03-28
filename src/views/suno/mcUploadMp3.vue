<script setup lang="ts">
import { mlog } from "@/api";
import { FeedTask, sleep, sunoFetch } from "@/api/suno";
import {NTag,NModal} from   "naive-ui";
import { ref } from "vue";
import AiMic from '../mj/aiMic.vue';
import { t } from "@/locales";

const fsRef= ref()
const st = ref({process:'',id:'',isUpload:false,showMic:false});

const  uploadFetch= async ( lid:string)=>{
    for(let i=0;i<50;i++){
        let dt:any = await sunoFetch(`/uploads/audio/${lid}`);
        mlog("ddd",dt )
        let time= (i+1)
        if(time>20) time=20;
        if( dt.status=='complete' || dt.status=='error' ) return dt ;
        await sleep( time*1000 )
        
    }
    return null;
   
}
async function  selectFile(input:any){
    try{
        st.value.isUpload= true
        mlog("uploadFile", input.target.files[0] )
        let fileName = input.target.files[0].name
        let extension = fileName.split('.').pop();
 
        const d:any = await sunoFetch('/uploads/audio',{"extension": extension?extension:"mp3"})
        mlog("init ", d )
        st.value.id= d.id;
        const formData = new FormData();
        for(let p in d.fields){
            formData.append( p,d.fields[p] )
        }
        formData.append('file', input.target.files[0])
        const response = await fetch(d.url , { method: 'POST',   body: formData });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        mlog("uploaded ")
        const f:any = await sunoFetch('/uploads/audio/'+ d.id+'/upload-finish',{"upload_type":"file_upload","upload_filename": input.target.files[0].name })
        mlog("finish ", f )

        const fd:any= await uploadFetch(d.id )
        mlog("uploadFetch ", fd  )
        const ft:any = await sunoFetch('/uploads/audio/'+ d.id+'/initialize-clip',{ })
        mlog("clip ", ft )

        //到这里拿到 就可以结束了
        FeedTask( [ ft.clip_id])
    }catch(e ){

    }
    st.value.isUpload= false
    fsRef.value.value='';

}

const sendMic= async (e:any )=>{
    mlog('sendMic', e );
    st.value.showMic=false;

    try{
        st.value.isUpload= true
        let id=  Math.random().toString(36).slice(2);
        let du = `recorder-${id}.wav`;// (e.stat && e.stat.duration)?(e.stat.duration.toFixed(2)+'s'):'whisper.wav';
         const file = new File([e.blob], du, { type: 'audio/wav' });
       // mlog("uploadFile", input.target.files[0] )
        //let fileName = input.target.files[0].name 
 
        const d:any = await sunoFetch('/uploads/audio',{"extension": "wav"})
        mlog("init ", d )
        st.value.id= d.id;
        const formData = new FormData();
        for(let p in d.fields){
            formData.append( p,d.fields[p] )
        }
        formData.append('file', file)
        const response = await fetch(d.url , { method: 'POST',   body: formData });
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        mlog("uploaded ")
        const f:any = await sunoFetch('/uploads/audio/'+ d.id+'/upload-finish',{"upload_type":"file_upload","upload_filename": du })
        mlog("finish ", f )

        const fd:any= await uploadFetch(d.id )
        mlog("uploadFetch ", fd  )
        const ft:any = await sunoFetch('/uploads/audio/'+ d.id+'/initialize-clip',{ })
        mlog("clip ", ft )

        //到这里拿到 就可以结束了
        FeedTask( [ ft.clip_id])
    }catch(e ){
        console.error("error",e)
    }
    st.value.isUpload= false
    fsRef.value.value='';

    
}
</script>
<template>
    <NTag   type="success" size="small" round  >
        <span class="cursor-pointer"   v-if="st.isUpload">Upload...</span>
        <span class="cursor-pointer" @click="fsRef.click()" v-else>{{ $t('suno.upMps') }}</span>
    </NTag>
    <NTag type="success" size="small" round >
        <span class="cursor-pointer" @click="st.showMic=true" >{{ $t('录音') }}</span>
    </NTag>
    
    <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept=".mp3,audio/*,.m4a,.mp4" />
    
    <!-- <n-modal v-model:show="st.showMic"    :title="t('录音')" preset="card" :mask-closable=false  draggable> -->
    <n-modal :show="st.showMic">
        <n-card style="width: 600px" :title="t('录音')"  size="huge"
        :bordered="false" role="dialog" aria-modal="true" >
            <div v-if="st.showMic" class="  myinputs flex justify-center items-center max-w-[400px]" >
                <AiMic @cancel="st.showMic=false" @send="sendMic" opt="sunoupload"/>
            </div>
        </n-card>
    </n-modal>

</template>
<style    >
 
</style>