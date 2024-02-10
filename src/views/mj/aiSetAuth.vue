<script setup lang="ts">
import { ref } from 'vue'
import { NTag } from 'naive-ui'
import Permission from '../chat/layout/Permission.vue';
const st = ref({show:false});
</script>
<template>
 
<span class=" text-red-300 mr-2">{{ $t('mj.authErro') }}</span>  
<NTag type="primary"  effect="dark" 
@click="st.show=true" size="small" round style="cursor: pointer; ">{{ $t('mj.authBt') }}</NTag>
 
 <Permission :visible="st.show" @close="st.show=false" />
</template>