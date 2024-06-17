<script setup lang="ts">
import { mlog } from "@/api";
import { FeedTask, sleep, sunoFetch } from "@/api/suno";
import {NTag} from   "naive-ui";
import { ref } from "vue";

const fsRef= ref()
const st = ref({process:'',id:'',isUpload:false});

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
        const d:any = await sunoFetch('/uploads/audio',{"extension":"mp3"})
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
</script>
<template>
    <NTag   type="success" size="small" round  >
        <span class="cursor-pointer"   v-if="st.isUpload">Upload...</span>
        <span class="cursor-pointer" @click="fsRef.click()" v-else>{{ $t('suno.upMps') }}</span>
    </NTag>
    
    <input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept=".mp3" />

</template>