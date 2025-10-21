<script setup lang="ts">
import { mlog, upImg } from '@/api';
import { t } from '@/locales';
import { useMessage,NImage } from 'naive-ui';
import { computed, onMounted, ref ,watch} from 'vue';
import { SvgIcon } from '@/components/common';
 
interface Props {
  value: any
  upload?: string
  isOne?: boolean
  isFile?: boolean
}
const pp= defineProps<Props>()
// const pp = defineProps({
//   value: {
//     type: Array||String,
//     required: true,
//     default:[]
//   }
//   ,upload:{
//     type:String,
//     default:''
//   }
//   ,isOne:{
//     type:Boolean,
//     default:false
//   }
// })

const emit = defineEmits(['update:value'])

const fsRef= ref() ; 
const ms = useMessage();
interface myFile{
    file?:any
    base64:string
}
const base64Array= ref<myFile[]>([]);   
const selectFile=(input:any)=>{
    const ff=input.target.files[0];
    upImg(input.target.files[0]).then(d=>{
        fsRef.value.value='';
        const index = base64Array.value.findIndex(item => item.base64 == d);
        if(index>-1){
            ms.error(t('mjchat.no2add') )
            return ;
        }
        base64Array.value.push({file: ff ,base64:d});
        changValue()
        //if(base64Array.value.length>1) st.value.isGo=true;
        //if(st)
    }).catch(e=>ms.error(e));
}

const changValue= ()=>{
    
    let arr:any=base64Array.value.map(item=>item.base64)
    if(pp.isFile){
        arr=base64Array.value//.map(item=>item.file)
    }
    emit('update:value', pp.isOne?arr[0]: arr)
    //mlog("changValue", arr)
    
}

//watch(()=>base64Array.value, ,{deep:true})

const max= computed(()=>{
    return pp.isOne?1:3;
})


const updateBase64Array=()=>{
    if(!pp.value){
        return
    }
    base64Array.value=pp.isOne?[{base64: pp.value }]:(pp.value?pp.value.map((v:string)=>{return {base64:v}}):[]);
}
onMounted(()=>{
   updateBase64Array();
})
watch(()=>pp.value, ()=>{
    if(pp.isFile) return ;
    updateBase64Array();
},{deep:true})

</script>
<template>
<div class="flex justify-start items-center flex-wrap myblend">
    <div class="w-[var(--my-blend-img-size)] h-[var(--my-blend-img-size)] mr-2 mt-2 bg-[#ddd] overflow-hidden rounded-sm relative group " v-for="item in base64Array">
        <NImage :src="item.base64" object-fit="cover"></NImage>
        <SvgIcon icon="fluent:delete-12-filled" :class="{'hidden':max>1}"
        class="absolute top-0 right-0 text-red-600 text-[20px] cursor-pointer  group-hover:block "
        @click="base64Array.splice(base64Array.indexOf(item),1)"></SvgIcon>
    </div>
    <div   @click="fsRef.click()" v-if="base64Array.length<max" 
         class="w-[var(--my-blend-img-size)] h-[var(--my-blend-img-size)] mt-2 bg-[#999] overflow-hidden rounded-sm flex justify-center items-center cursor-pointer">
            <SvgIcon icon="mdi:add-bold" class="text-[40px] text-[#fff]"></SvgIcon>
    </div>
</div>
<input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>

</template>

<style scoped>
.myblend{
    --my-blend-img-size:75px
}
</style>