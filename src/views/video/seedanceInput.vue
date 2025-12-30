<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { NSelect, NInput, NButton, NSwitch, useMessage, NInputNumber, NEmpty, NDivider, NTabs, NTabPane } from 'naive-ui';
import { mytpl } from './tpl';
import { DtoTpl, PostVideo } from './veo';
import imageBase64Array from './image-base64-array.vue';
import { t } from '@/locales';
import { mlog } from '@/api';
import { seedanceListModels } from '@/api/seedance';

const st = ref({
  model: 'doubao-seedance-1-0-pro-250528',
  mode: 'txt2video' as 'txt2video' | 'img2video' | 'img2videoBoth',
  isLoading: false
});
const fieldValues = ref<any[]>([]);
const ms = useMessage();

const tplArr = computed<DtoTpl[]>(() => mytpl.tpl.filter((item) => item.plat === 'seedance'));
const modelsOption = ref<{ label: string; value: string }[]>([]);

// 默认 seedance 模板配置（当找不到精确匹配时使用）
const defaultSeedanceTpl: DtoTpl = {
  model: 'default-seedance',
  plat: 'seedance',
  field: [
    {
      key: 'prompt',
      type: 'textarea',
      placeholder: 'Video Description',
      value: '一辆蓝色的跑车在雨夜的城市街道上飞驰，镜头跟随，水面溅起的水花清晰可见',
    },
    {
      key: 'resolution',
      type: 'select',
      value: '480p',
      options: [
        { label: 'Resolution 480p', value: '480p' },
        { label: 'Resolution 720p', value: '720p' },
        { label: 'Resolution 1080p', value: '1080p' },
      ],
    },
    {
      key: 'ratio',
      type: 'select',
      value: '16:9',
      options: [
        { label: 'Ratio 21:9', value: '21:9' },
        { label: 'Ratio 16:9', value: '16:9' },
        { label: 'Ratio 4:3', value: '4:3' },
        { label: 'Ratio 1:1', value: '1:1' },
        { label: 'Ratio 3:4', value: '3:4' },
        { label: 'Ratio 9:16', value: '9:16' },
        { label: 'Ratio 9:21', value: '9:21' },
        { label: 'Keep Ratio', value: 'keep_ratio' },
        { label: 'Adaptive', value: 'adaptive' },
      ],
    },
    {
      key: 'duration',
      type: 'select',
      value: 5,
      options: [
        { label: 'Duration 5s', value: 5 },
        { label: 'Duration 10s', value: 10 },
      ],
    },
    {
      key: 'camerafixed',
      type: 'switch',
      value: false,
      placeholder: 'Camera Fixed',
    },
    {
      key: 'watermark',
      type: 'switch',
      value: false,
      placeholder: 'Watermark',
    },
    {
      key: 'seed',
      type: 'number',
      value: 0,
      min: 0,
      max: 2147483647,
    },
    {
      key: 'return_last_frame',
      type: 'switch',
      value: false,
      placeholder: 'Return Last Frame',
    },
    {
      key: 'first_frame',
      type: 'image_base64_url',
      placeholder: '可选：首帧图片',
    },
    {
      key: 'last_frame',
      type: 'image_base64_url',
      placeholder: '可选：尾帧图片',
    },
  ],
};

const ratioPresets = [
  { label: "21:9", value: "21:9", s: "width: 100%; height: 43%;" },
  { label: "16:9", value: "16:9", s: "width: 100%; height: 56%;" },
  { label: "4:3", value: "4:3", s: "width: 100%; height: 75%;" },
  { label: "1:1", value: "1:1", s: "width: 100%; height: 100%;" },
  { label: "3:4", value: "3:4", s: "width: 75%; height: 100%;" },
  { label: "9:16", value: "9:16", s: "width: 56%; height: 100%;" },
  { label: "9:21", value: "9:21", s: "width: 43%; height: 100%;" },
  { label: "Keep", value: "keep_ratio", s: "width: 75%; height: 100%;" },
  { label: "Auto", value: "adaptive", s: "width: 75%; height: 100%;" },
];

// 获取 ratio 字段的索引和值
const ratioFieldIndex = computed(() => {
  if (!currentTpl.value) return -1;
  return currentTpl.value.field.findIndex((f) => f.key === 'ratio');
});

const ratioValue = computed({
  get: () => {
    const idx = ratioFieldIndex.value;
    if (idx === -1) return '16:9';
    return fieldValues.value[idx] || '16:9';
  },
  set: (val: string) => {
    const idx = ratioFieldIndex.value;
    if (idx !== -1) {
      fieldValues.value[idx] = val;
    }
  },
});

// 过滤掉 ratio 字段，在循环中不再单独渲染
const filteredFields = computed(() => {
  if (!currentTpl.value) return [];

  let fields = currentTpl.value.field
    .map((f, idx) => ({ ...f, originalIndex: idx }))
    .filter((f) => f.key !== 'ratio');

  // 根据模式过滤字段
  if (st.value.mode === 'txt2video') {
    // 文生视频：不显示 first_frame 和 last_frame
    fields = fields.filter((f) => f.key !== 'first_frame' && f.key !== 'last_frame');
  } else if (st.value.mode === 'img2video') {
    // 图生视频：只显示 first_frame
    fields = fields.filter((f) => f.key !== 'last_frame');
  }
  // img2videoBoth: 显示 first_frame 和 last_frame

  return fields;
});

const currentTpl = computed<DtoTpl>(() => {
  // 先尝试精确匹配
  const exactMatch = tplArr.value.find((item) => item.model === st.value.model);
  if (exactMatch) return exactMatch;

  // 尝试模糊匹配（忽略版本号后缀）
  const modelBase = st.value.model.replace(/-\d{6}$/, ''); // 去掉日期后缀如 -250528
  const fuzzyMatch = tplArr.value.find((item) => item.model.replace(/-\d{6}$/, '') === modelBase);
  if (fuzzyMatch) return fuzzyMatch;

  // 都匹配不到则使用默认模板
  return defaultSeedanceTpl;
});

const resetFieldValues = () => {
  fieldValues.value = (currentTpl.value?.field || []).map((f) => f.value ?? '');
};

watch(
  () => st.value.model,
  () => {
    resetFieldValues();
  },
);

const loadModels = async () => {
  const localModels = tplArr.value.map((o) => o.model);
  modelsOption.value = localModels.map((m) => ({ label: m, value: m }));

  try {
    const list = await seedanceListModels();
    if (Array.isArray(list) && list.length > 0) {
      modelsOption.value = list.map((id) => ({ label: id, value: id }));
      if (!list.includes(st.value.model)) {
        st.value.model = list[0];
      }
    }
  } catch (error: any) {
    // 保底使用本地模型
    mlog('seedance list models error', error);
  }

  if (!st.value.model && modelsOption.value.length) {
    st.value.model = modelsOption.value[0].value;
  }
  resetFieldValues();
};

onMounted(() => {
  loadModels();
});

const isDisabled = computed(() => st.value.isLoading || !currentTpl.value);

const pickDataFromFields = () => {
  if (!currentTpl.value) return {};
  const data: Record<string, any> = {};
  currentTpl.value.field.forEach((f, idx) => {
    const val = fieldValues.value[idx];
    const shouldSkip =
      val === undefined || val === null || val === '' || (Array.isArray(val) && !val.length);
    if (shouldSkip && typeof val !== 'boolean' && val !== 0) return;
    data[f.key] = val;
  });
  return data;
};

const create = async () => {
  if (!currentTpl.value) {
    ms.error(t('video.selectModel'));
    return;
  }
  st.value.isLoading = true;
  const data = pickDataFromFields();
  try {
    await PostVideo(currentTpl.value, data);
  } catch (error) {
    mlog('seedance create error', error);
    ms.error(t('mj.createFail'));
  }
  st.value.isLoading = false;
};
</script>

<template>
  <div class="p-2">
    <!-- 比例选择器 - 放在最上面 -->
    <section class="mb-4" v-if="ratioFieldIndex !== -1">
      <div class="flex items-center justify-between space-x-1">
        <template v-for="item in ratioPresets" :key="item.value">
          <section
            class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"
            :class="{ active: ratioValue === item.value }"
            @click="ratioValue = item.value"
          >
            <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
              <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
            </div>
            <p class="mb-1 text-center text-sm">{{ item.label }}</p>
          </section>
        </template>
      </div>
    </section>

    <!-- 模型选择器 -->
    <section class="mb-4 flex justify-between items-center">
      <div>{{ $t('dance.model') }}</div>
      <n-select v-model:value="st.model" :options="modelsOption" size="small" filterable class="!w-[70%]" />
    </section>

    <!-- 模式选择器 -->
    <n-divider title-placement="left">{{ $t('seedance.mode') }}</n-divider>
    <n-tabs type="segment" size="small" v-model:value="st.mode">
      <n-tab-pane name="txt2video" :tab="$t('seedance.txt2video')">
        <div class="text-xs text-gray-500 pb-1">{{ $t('seedance.txt2videoDesc') }}</div>
      </n-tab-pane>
      <n-tab-pane name="img2video" :tab="$t('seedance.img2video')">
        <div class="text-xs text-gray-500 pb-1">{{ $t('seedance.img2videoDesc') }}</div>
      </n-tab-pane>
      <n-tab-pane name="img2videoBoth" :tab="$t('seedance.img2videoBoth')">
        <div class="text-xs text-gray-500 pb-1">{{ $t('seedance.img2videoBothDesc') }}</div>
      </n-tab-pane>
    </n-tabs>

    <n-empty :description="$t('video.selectModel')" v-if="!currentTpl" class="pt-3" />
    <template v-else>
      <n-divider title-placement="left">{{ $t('mj.basicSetting') }}</n-divider>
      <template v-for="tp in filteredFields" :key="tp.key">
        <div class="pt-1" v-if="tp.type === 'textarea'">
          <n-input v-model:value="fieldValues[tp.originalIndex]" type="textarea" :placeholder="tp.placeholder ?? ''" />
        </div>

        <n-divider v-if="tp.key === 'resolution'" title-placement="left">{{ $t('mj.imageSetting') }}</n-divider>
        <div class="pt-1" v-if="tp.type === 'select'">
          <n-select v-model:value="fieldValues[tp.originalIndex]" :options="tp.options" size="small" />
        </div>

        <n-divider v-if="tp.key === 'first_frame'" title-placement="left">{{ $t('video.referenceFrame') }}</n-divider>
        <div class="pt-1" v-if="tp.type === 'image_base64_url'">
          <image-base64-array v-model:value="fieldValues[tp.originalIndex]" :is-one="true" upload="1" />
        </div>

        <div class="pt-1" v-if="tp.type === 'image_base64_file'">
          <image-base64-array v-model:value="fieldValues[tp.originalIndex]" :is-file="true" :is-one="true" upload="1" />
        </div>

        <div class="pt-1" v-if="tp.type === 'image_base64_url_array'">
          <image-base64-array v-model:value="fieldValues[tp.originalIndex]" upload="1" />
        </div>

        <div class="pt-1" v-if="tp.type === 'switch'">
          <div class="flex items-center justify-between">
            <span class="text-[13px] opacity-80">{{ tp.placeholder }}</span>
            <n-switch v-model:value="fieldValues[tp.originalIndex]" size="small" />
          </div>
        </div>

        <div class="pt-1" v-if="tp.type === 'number'">
          <n-input-number v-model:value="fieldValues[tp.originalIndex]" size="small" :min="tp.min" :max="tp.max" />
        </div>
      </template>

      <div class="mt-3 flex justify-end items-center">
        <div class="flex">
          <n-button type="primary" :block="true" :disabled="isDisabled" @click="create">
            {{ $t('video.generate') }}
          </n-button>
        </div>
      </div>
    </template>
    <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
      {{ $t('video.seedanceDesc') }}
    </div>
  </div>
</template>
