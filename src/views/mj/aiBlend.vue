<script setup lang="ts">
import {computed, ref} from 'vue';
import {useMessage, NButton,NImage,NSelect} from 'naive-ui';
import {upImg} from '@/api'
import { homeStore } from '@/store';
import { SvgIcon } from '@/components/common';
import config from "./draw.json";
import { t } from "@/locales";

const ms = useMessage();
const fsRef= ref() ;
const st= ref({status:'',isGo:false,dimensions:'SQUARE'})
const base64Array= ref<string[]>([]);
const selectFile=(input:any)=>{
    upImg(input.target.files[0]).then(d=>{
        fsRef.value.value='';
        const index = base64Array.value.findIndex(item => item == d);
        if(index>-1){
            ms.error(t('mjchat.no2add') )
            return ;
        }
        base64Array.value.push(d);
        if(base64Array.value.length>1) st.value.isGo=true;
        //if(st)
    }).catch(e=>ms.error(e));
}
const send= ()=>{
    if(base64Array.value.length<2){
        ms.error( t('mjchat.add2more') )
        return ;
    }
    let obj={
            action:'blend',
            data:{
                base64Array:base64Array.value
                ,"botType": "MID_JOURNEY",
                dimensions:st.value.dimensions?st.value.dimensions:'SQUARE'
            }
        }
        homeStore.setMyData({act:'draw',actData:obj});
        st.value.isGo=false;
}
const drawlocalized = computed(() => {
	let localizedConfig = {};
	Object.keys(config).forEach((key) => {
		localizedConfig[key] = config[key].map((option) => {
			// 假设 labelKey 如 "draw.qualityList.general"
			let path = option.labelKey; // 直接使用 labelKey 作为路径
			return {
				...option,
				label: t(path), // 从 i18n 中获取本地化的标签
			};
		});
	});
	return localizedConfig;
});
</script>
<template>

<input type="file"  @change="selectFile"  ref="fsRef" style="display: none" accept="image/jpeg, image/jpg, image/png, image/gif"/>
<section class="mb-4 flex justify-between items-center"  >
     <div>{{ $t('mjchat.size') }}</div>
    <n-select v-model:value="st.dimensions" :options="drawlocalized.dimensionsList" size="small"  class="!w-[70%]" :clearable="true" />
</section>
<div class="flex justify-start items-center flex-wrap myblend">
    <div class="w-[var(--my-blend-img-size)] h-[var(--my-blend-img-size)] mr-2 mt-2 bg-[#ddd] overflow-hidden rounded-sm relative group " v-for="item in base64Array">
        <NImage :src="item" object-fit="cover"></NImage>
        <SvgIcon icon="fluent:delete-12-filled"
        class="absolute top-0 right-0 text-red-600 text-[20px] cursor-pointer hidden group-hover:block "
        @click="base64Array.splice(base64Array.indexOf(item),1)"></SvgIcon>
    </div>
    <div class="w-[var(--my-blend-img-size)] h-[var(--my-blend-img-size)] mt-2 bg-[#999] overflow-hidden rounded-sm flex justify-center items-center cursor-pointer"
     @click="fsRef.click()" v-if="base64Array.length<6">
        <SvgIcon icon="mdi:add-bold" class="text-[40px] text-[#fff]"></SvgIcon>
    </div>
</div>
<div   class="flex justify-end pt-5"><NButton @click="send" type="primary" :disabled="!st.isGo">{{$t('mjchat.blendStart')}}</NButton> </div>

<ul class="pt-4" v-html="$t('mjchat.blendInfo')">

</ul>

</template>
<style scoped>
.myblend{
    --my-blend-img-size:80px
}
</style>
