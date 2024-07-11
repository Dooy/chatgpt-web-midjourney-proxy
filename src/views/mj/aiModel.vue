<script setup lang="ts">
import { NSelect, NInput, NSlider, NButton, useMessage, NTag } from "naive-ui";
import { ref, computed, watch, onMounted } from "vue";
import { gptConfigStore, homeStore, useChatStore } from '@/store';
import { mlog, chatSetting } from "@/api";
import { t } from "@/locales";

const emit = defineEmits(['close']);
const chatStore = useChatStore();
const uuid = chatStore.active;
const chatSet = new chatSetting(uuid == null ? 1002 : uuid);

const nGptStore = ref(chatSet.getGptConfig());

import axios from 'axios';

// 初始化 ref
const options = ref({});
const selectedValues = ref({});
const selectWidth = ref(0);
const filterText = ref(''); // 新增过滤文本的 ref

// 在组件挂载时获取模型数据
onMounted(() => {
  fetch(`/v1/models`)
    .then(response => {
      if (!response.ok) {
        throw new Error('请求失败');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data.data)) {
        config.value.model = data.data.map(model => model.id);
      } else {
        console.error('返回的数据格式不正确');
      }
    })
    .catch(error => {
      console.error('获取模型列表失败：', error);
    });

  axios.get(`/api/prompts`)
    .then(response => {
      if (response.data.status === 'Success') {
        options.value = response.data.data;
      } else {
        console.error('获取数据失败：', response.data.message);
      }
    })
    .catch(error => {
      console.error('获取数据失败：', error);
    });

  calculateSelectWidth();
  window.addEventListener('resize', calculateSelectWidth);
});

const calculateSelectWidth = () => {
  const containerWidth = document.querySelector('.select-container')?.clientWidth || 0;
  selectWidth.value = containerWidth / 2 - 0; // Subtracting gap
};

const handleSelectChange = (folder: string) => {
  nGptStore.value.systemMessage = selectedValues.value[folder] || "";
  for (const key in selectedValues.value) {
    if (key !== folder) {
      selectedValues.value[key] = null;
    }
  }
};

const config = ref({
  model: ['gpt-3.5-turbo-1106'],
  maxToken: 8192
});
const st = ref({ openMore: false });
const voiceList = computed(() => {
  let rz = [];
  for (let o of "alloy,echo,fable,onyx,nova,shimmer".split(/[ ,]+/ig)) rz.push({ label: o, value: o })
  return rz;
});
const modellist = computed(() => {
  let rz = [];
  for (let o of config.value.model) {
    rz.push({ label: o, value: o })
  }
  if (gptConfigStore.myData.userModel) {
    let arr = gptConfigStore.myData.userModel.split(/[ ,]+/ig);
    for (let o of arr) {
      o && rz.push({ label: o, value: o })
    }
  }
  if (homeStore.myData.session.cmodels) {
    let delModel: string[] = [];
    let addModel: string[] = [];
    let isDelAll = false
    homeStore.myData.session.cmodels.split(/[ ,]+/ig).map((v: string) => {
      if (v.indexOf('-') == 0) {
        delModel.push(v.substring(1))
        if (v == '-all') isDelAll = true;
      } else {
        addModel.push(v);
      }
    });
    mlog('cmodels', delModel, addModel);
    if (isDelAll) rz = [];
    rz = rz.filter(v => delModel.indexOf(v.value) == -1);
    addModel.map(o => rz.push({ label: o, value: o }))
    if (rz.length == 0) {
      rz.push({ label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' })
    }
  }

  let uniqueArray: { label: string, value: string }[] = Array.from(
    new Map(rz.map(item => [JSON.stringify(item), item]))
      .values()
  );
  return uniqueArray;
});
const ms = useMessage();
const saveChat = (type: string) => {
  chatSet.save(nGptStore.value);
  gptConfigStore.setMyData(nGptStore.value);
  homeStore.setMyData({ act: 'saveChat' });
  if (type != 'hide') ms.success(t('common.saveSuccess'));
  emit('close');
}

watch(() => nGptStore.value.model, (n) => {
  nGptStore.value.gpts = undefined; // 重置 gpts 数据
  let max = 16384; // 默认最大令牌数
  if (n.toLowerCase().includes('gpt-4-32k')) {
    max = 16384;
  } else if (n.toLowerCase().includes('vision') || n.toLowerCase().includes('gpt-4') || n.toLowerCase().includes('16k') || n.toLowerCase().includes('claude-3') || n.toLowerCase().includes('3.5')) {
    max = 4096 * 2;
  }
  config.value.maxToken = max / 2; // 设置最大令牌数
  if (nGptStore.value.max_tokens > config.value.maxToken) {
    nGptStore.value.max_tokens = config.value.maxToken; // 更新 max_tokens
  }
});

const reSet = () => {
  gptConfigStore.setInit();
  nGptStore.value = gptConfigStore.myData;
}
</script>

<template>
  <section class="mb-2 flex justify-between items-center">
    <div><span class="text-red-500">*</span> {{ $t('mjset.model') }}</div>
    <div class="flex w-[50%]">
      <n-input v-model:value="filterText" placeholder="筛选" class="w-1/2" style="height: 32px;" />
      <n-select v-model:value="nGptStore.model" :options="modellist" size="small" class="w-1/2" style="height: 32px;" />
    </div>
  </section>
  <section class="mb-0 flex justify-between items-center">
    <n-input :placeholder="$t('mjchat.modlePlaceholder')" v-model:value="gptConfigStore.myData.userModel">
      <template #prefix>
        {{ $t('mjchat.myModle') }}
      </template>
    </n-input>
  </section>
  <section class="flex justify-between items-center">
    <div>{{ $t('mjchat.historyCnt') }}</div>
    <div class="flex justify-end items-center w-[80%] max-w-[240px]">
      <div class="w-[200px]"><n-slider v-model:value="nGptStore.talkCount" :step="1" :max="50" /></div>
      <div class="w-[40px] text-right">{{ nGptStore.talkCount }}</div>
    </div>
  </section>
  <div class="mb-0 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mjchat.historyToken') }}</div>
  <section class="flex justify-between items-center">
    <div>{{ $t('mjchat.historyTCnt') }}</div>
    <div class="flex justify-end items-center w-[80%] max-w-[240px]">
      <div class="w-[200px]"><n-slider v-model:value="nGptStore.max_tokens" :step="1" :max="config.maxToken" :min="1" /></div>
      <div class="w-[40px] text-right">{{ nGptStore.max_tokens }}</div>
    </div>
  </section>
  <div class="mb-0 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mjchat.historyTCntInfo') }}</div>
  <section class="mb-0">
    <div>{{ $t('mjchat.role') }}</div>
    <div>
      <n-input type="textarea" :placeholder="$t('mjchat.rolePlaceholder')" v-model:value="nGptStore.systemMessage" :autosize="{ minRows: 1, maxRows: 3 }" style="overflow-y: auto;" />
    </div>
  </section>
  <div class="select-container">
    <div v-for="(items, folder) in options" :key="folder" class="mb-0">
      <h3>{{ folder }}</h3>
      <n-select v-model:value="selectedValues[folder]" :options="items.map(item => ({ label: item.title, value: item.systemRole }))" @update:value="handleSelectChange(folder)" :style="{ maxWidth: selectWidth + 'px' }" />
    </div>
  </div>
  <template v-if="st.openMore">
    <section class="flex justify-between items-center">
      <div>{{ $t('mj.temperature') }}</div>
      <div class="flex justify-end items-center w-[80%] max-w-[240px]">
        <div class="w-[200px]"><n-slider v-model:value="nGptStore.temperature" :step="0.01" :max="1" /></div>
        <div class="w-[40px] text-right">{{ nGptStore.temperature }}</div>
      </div>
    </section>
    <div class="mb-0 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mj.temperatureInfo') }}</div>
    <section class="flex justify-between items-center">
      <div>{{ $t('mj.top_p') }}</div>
      <div class="flex justify-end items-center w-[80%] max-w-[240px]">
        <div class="w-[200px]"><n-slider v-model:value="nGptStore.top_p" :step="0.01" :max="1" /></div>
        <div class="w-[40px] text-right">{{ nGptStore.top_p }}</div>
      </div>
    </section>
    <div class="mb-0 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mj.top_pInfo') }}</div>
    <section class="flex justify-between items-center">
      <div>{{ $t('mj.presence_penalty') }}</div>
      <div class="flex justify-end items-center w-[80%] max-w-[240px]">
        <div class="w-[200px]"><n-slider v-model:value="nGptStore.presence_penalty" :step="0.01" :max="1" /></div>
        <div class="w-[40px] text-right">{{ nGptStore.presence_penalty }}</div>
      </div>
    </section>
    <div class="mb-0 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mj.presence_penaltyInfo') }}</div>
    <section class="flex justify-between items-center">
      <div>{{ $t('mj.frequency_penalty') }}</div>
      <div class="flex justify-end items-center w-[80%] max-w-[240px]">
        <div class="w-[200px]"><n-slider v-model:value="nGptStore.frequency_penalty" :step="0.01" :max="1" /></div>
        <div class="w-[40px] text-right">{{ nGptStore.frequency_penalty }}</div>
      </div>
    </section>
    <div class="mb-0 text-[12px] text-gray-300 dark:text-gray-300/20">{{ $t('mj.frequency_penaltyInfo') }}</div>
    <section class="mb-2 flex justify-between items-center">
      <div>{{ $t('mj.tts_voice') }}</div>
      <n-select v-model:value="nGptStore.tts_voice" :options="voiceList" size="small" class="!w-[50%]" />
    </section>
  </template>
  <div v-else class="text-right cursor-pointer mb-2" @click="st.openMore = true">
    <NTag type="primary" round size="small" :bordered="false" class="!cursor-pointer">More...</NTag>
  </div>
  <section class="text-right flex justify-end space-x-2">
    <NButton @click="reSet()">{{ $t('mj.setBtBack') }}</NButton>
    <NButton type="primary" @click="saveChat('no')">{{ $t('common.save') }}</NButton>
  </section>
</template>

<style scoped>
.select-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
}
</style>
