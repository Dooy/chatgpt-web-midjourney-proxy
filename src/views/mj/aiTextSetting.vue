<script setup lang="ts">

import { homeStore } from '@/store';
import {  computed ,ref } from 'vue'
import aiSetServer from './aiSetServer.vue';
import { NTag,NModal,NButton } from 'naive-ui'
const isHideServer= computed( ()=>homeStore.myData.session.isHideServer )
const st= ref({show:false})
const pp = defineProps<{msgInfo?:string}>();
const emit =defineEmits(['close'])
const closeed=()=>{
    emit('close')
    st.value.show=false
}
</script>
<template>
<div class="whitespace-pre-wrap pb-10" v-if="!isHideServer"> 
<div v-if="pp.msgInfo">
    <div v-html="pp.msgInfo"> </div>
    <div class="pt-3 text-center">
      <NButton type="primary" @click="st.show=true">{{ $t('setting.setting') }} </NButton> 
    </div>
</div>
<template v-else>
    <span class=" text-red-400">{{ $t('mj.setTextInfo') }} </span> <NTag type="primary"  effect="dark" @click="st.show=true" size="small" round style="cursor: pointer; ">{{ $t('setting.setting') }}</NTag>
</template>
</div>
<NModal v-model:show="st.show" :title="$t('mjset.server')" preset="card"  style="width: 95%; max-width: 640px">
    <aiSetServer v-if="st.show" @close="closeed"/>
</NModal>
</template>