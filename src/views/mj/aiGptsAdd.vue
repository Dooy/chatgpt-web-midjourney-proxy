<script setup lang="ts">
import { ref, watch } from 'vue'
import { SvgIcon } from "@/components/common";
import { NInput,useMessage } from 'naive-ui';
import { t } from '@/locales';
import { mlog, myFetch } from '@/api';


const ms = useMessage();
const st= ref({q:'',gid:''});
const doAdd=async ()=>{
    mlog('q=',st.value.q,  st.value.gid );
    if( !st.value.gid ){
        ms.error( t('mjchat.gidError')); //
        return 
    }
    const gptUrl= `https://gpts.ddaiai.com/open/gptsapi/add/${ st.value.gid }`; 
    const d = await myFetch(gptUrl );
    if(d.error!=0) return ms.error( d.error_des);
    //data.gpts
    let msg= t('mjchat.success3') +' '+ d.data?.gpts?.name
    ms.success( msg );
    mlog('rz=',d);
}
function extractGStrings(input: string): string[] { 
    const pattern = /g-[^/]+/g; 
    const matches = input.match(pattern); 
    return matches ? matches : [];
}

// // 测试字符串
// const inputString = "00/g/g-hRCqiqVlM-tutor-me/abdsdsd";

// // 提取匹配的子字符串
// const result = extractGStrings(inputString);
watch(()=>st.value.q, (n)=>{
    st.value.gid='';
    if(n) {
        st.value.gid= extractGStrings(n)[0]??'';
    }
})
</script>
<template>

 
    <n-input round :placeholder="$t('mjchat.addPlaceholder')" clearable v-model:value="st.q" @keydown.enter="doAdd()" >
        <template #prefix>
            <SvgIcon icon="ri:function-add-line"/>
        </template>
        <template #suffix>
            <div class="cursor-pointer" @click="doAdd()">
            {{ $t('mjchat.addGPTS') }}
            </div>
        </template>
    </n-input>
    <div v-if="st.gid" class="px-4 text-white/25 text-[12px]">gid:{{ st.gid }}</div>
 
</template>