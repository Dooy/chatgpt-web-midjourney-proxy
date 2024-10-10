<script lang="ts" setup>
import { ref ,watch} from 'vue';
import realtime from './realtime.vue';
import { homeStore } from '@/store';
import { mlog } from '@/api';
const st= ref({ isRealtime:false })

watch(()=>homeStore.myData.act,(n)=>{
    mlog('isRealtime',n)
    if(n=='openRealtime'){
        st.value.isRealtime=true
    }
})
</script>
<template>
    <realtime v-if="st.isRealtime" @close="st.isRealtime=false"/>
</template>