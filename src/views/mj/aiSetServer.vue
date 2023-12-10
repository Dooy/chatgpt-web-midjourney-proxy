<script setup lang="ts">
import { NInput, NButton, useMessage} from "naive-ui"
 
import {gptServerStore} from '@/store'

const emit= defineEmits(['close']);
const ms= useMessage();
const save = ()=>{
    gptServerStore.setMyData( gptServerStore.myData );
    ms.success('保存成功');
    emit('close');
}
</script>
<template>
<div id="setserver"> 
<div class="text-right">OpenAI 相关</div>
<section class="mb-4 flex justify-between items-center"  >
    <n-input   placeholder="必须包含 http(s)://" v-model:value="gptServerStore.myData.OPENAI_API_BASE_URL" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">OpenAI接口地址:</span>
      </template>
    </n-input>
 </section>

<section class="mb-4 flex justify-between items-center"  >
    <n-input type="password"  placeholder="使用自定义 OpenAI Key 绕过密码访问限制 " show-password-on="click" v-model:value="gptServerStore.myData.OPENAI_API_KEY" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">OpenAI Api Key:</span>
      </template>
    </n-input>
 </section>


<div  class="text-right" >Midjourney 相关</div>
<section class="mb-4 flex justify-between items-center"  >
    <n-input   placeholder="必须包含 http(s)://" v-model:value="gptServerStore.myData.MJ_SERVER" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">Midjourney接口地址:</span>
      </template>
    </n-input>
 </section>

<section class="mb-4 flex justify-between items-center"  >
    <n-input type="password"  placeholder="使用自定义 Api Secret 绕过密码访问限制 " show-password-on="click" v-model:value="gptServerStore.myData.MJ_API_SECRET" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">Midjourney Api Secret:</span>
      </template>
    </n-input>
 </section>

 <div  class="text-right" > 上传相关</div>
<section class="mb-4 flex justify-between items-center"  >
    <n-input   placeholder="必须包含 http(s)://" v-model:value="gptServerStore.myData.UPLOADER_URL" clearable>
      <template #prefix>
        <span class="text-[var(--n-tab-text-color-active)]">上传地址:</span>
      </template>
    </n-input>
 </section>

<section class=" text-right flex justify-end space-x-2"  >
    <NButton   @click="gptServerStore.setInit()">恢复默认</NButton>
    <NButton type="primary" @click="save">保存</NButton>
 </section>
</div>
</template>
<style>
#setserver .n-input .n-input__input-el{
    text-align: right;
}
</style>