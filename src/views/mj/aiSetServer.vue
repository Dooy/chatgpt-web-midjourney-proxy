<script setup lang="ts">
import { NInput, NButton, useMessage} from "naive-ui"
 
import {gptServerStore} from '@/store'
import { mlog, myTrim,blurClean} from "@/api";
import { t } from '@/locales'

const emit= defineEmits(['close']);
const ms= useMessage();
const save = ()=>{
    gptServerStore.setMyData( gptServerStore.myData );
    ms.success( t('mjchat.success'));
    emit('close');
}
// const blurClean= ()=>{
//   mlog('blurClean');
//   gptServerStore.myData.OPENAI_API_BASE_URL =myTrim( myTrim(gptServerStore.myData.OPENAI_API_BASE_URL.trim(),'/'), '\\' );
//   gptServerStore.myData.OPENAI_API_KEY = gptServerStore.myData.OPENAI_API_KEY.trim();
//   gptServerStore.myData.MJ_SERVER =myTrim( myTrim( gptServerStore.myData.MJ_SERVER.trim(),'/'),'\\');
//   gptServerStore.myData.MJ_API_SECRET = gptServerStore.myData.MJ_API_SECRET.trim();
//   gptServerStore.myData.UPLOADER_URL=  myTrim( myTrim( gptServerStore.myData.UPLOADER_URL.trim(),'/'),'\\');
// }
</script>
<template>
<div id="setserver"> 
<div class="text-right">{{ $t('mj.setOpen') }}</div>
<section class="mb-4 flex justify-between items-center"  >
    <n-input @blur="blurClean"  :placeholder="$t('mj.setOpenPlaceholder') " v-model:value="gptServerStore.myData.OPENAI_API_BASE_URL" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">{{ $t('mj.setOpenUrl') }}:</span>
      </template>
    </n-input>
 </section>

<section class="mb-4 flex justify-between items-center"  >
    <n-input  @blur="blurClean" type="password"  :placeholder="$t('mj.setOpenKeyPlaceholder')" show-password-on="click" v-model:value="gptServerStore.myData.OPENAI_API_KEY" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">OpenAI Api Key:</span>
      </template>
    </n-input>
 </section>


<div  class="text-right" >{{$t('mj.setMj')}}</div>
<section class="mb-4 flex justify-between items-center"  >
    <n-input    :placeholder="$t('mj.setOpenPlaceholder') "  v-model:value="gptServerStore.myData.MJ_SERVER" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">{{$t('mj.setMjUrl')}}</span>
      </template>
    </n-input>
 </section>

<section class="mb-4 flex justify-between items-center"  >
    <n-input type="password"  :placeholder="$t('mj.setMjKeyPlaceholder') " show-password-on="click" v-model:value="gptServerStore.myData.MJ_API_SECRET" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">Midjourney Api Secret:</span>
      </template>
    </n-input>
 </section>

 <div  class="text-right" > {{$t('mj.setUploader')}}</div>
<section class="mb-4 flex justify-between items-center"  >
    <n-input  :placeholder="$t('mj.setOpenPlaceholder')"  v-model:value="gptServerStore.myData.UPLOADER_URL" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">{{$t('mj.setUploaderUrl')}}</span>
      </template>
    </n-input>
 </section>

<section class=" text-right flex justify-end space-x-2"  >
    <NButton   @click="gptServerStore.setInit()">{{$t('mj.setBtBack')}}</NButton>
    <NButton type="primary" @click="save">{{$t('mj.setBtSave')}}</NButton>
 </section>
</div>
</template>
<style>
#setserver .n-input .n-input__input-el{
    text-align: right;
}
</style>