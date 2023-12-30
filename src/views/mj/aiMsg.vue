<template>

</template>
<script lang="ts" setup>
import {  ref ,h} from 'vue';
import {useNotification} from "naive-ui";
import { t } from '@/locales'
const notification = useNotification();
const count = ref(0);

function increment() {
	count.value++;
}
function showMsg(str:string){
	notification.success({
		title:  t('mjchat.successTitle'),//"成功",
		//description: "From the Beach Boys",
		content: () => h('div',{innerHTML:str,class:'ddmsg'  } ),
		duration: 2500,
		keepAliveOnHover: true
	});
}

function showError(str:string){
	notification.info({
		//title: "错误",
		content:() => h('div',{innerHTML:str ,class:'ddmsg' } ),
		duration: 3000,
		keepAliveOnHover: true
	});
}

defineExpose({ count, increment,showMsg,showError });

</script>

<style>
 html.dark .ddmsg{ background-color: rgb(72, 72, 78)}
</style>
