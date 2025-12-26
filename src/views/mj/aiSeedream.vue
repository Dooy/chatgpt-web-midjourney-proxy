<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import {
  NSelect,
  NInput,
  NInputNumber,
  NButton,
  NSwitch,
  useMessage,
  NSlider,
  NDivider,
  NTabs,
  NTabPane,
} from "naive-ui";
import { SvgIcon } from "@/components/common";
import { upImg } from "@/api";
import { homeStore } from "@/store";
import { t } from "@/locales";
import { seedreamListModels } from "@/api/seedream";

const ms = useMessage();
const fsRef = ref();
const editImageRef = ref();
const editMaskRef = ref();

const images = ref<string[]>([]);
const editImageFile = ref<File | null>(null);
const editMaskFile = ref<File | null>(null);
const editImageUrl = ref<string>("");

const st = ref({
  prompt: "",
  model: "doubao-seedream-4-5-251128",
  mode: "txt2img" as "txt2img" | "img2img" | "multi" | "group" | "edit",
  quality: "default" as "default" | "high",
  aspect: "1:1",
  size: "2048x2048",
  response_format: "url",
  watermark: false,
  max_images: 4,
  n: 1,
  seed: -1,
  optimize_mode: "standard",
  isLoading: false,
});

const modelOptions = ref<{ label: string; value: string }[]>([
  { label: "doubao-seedream-4-5-251128", value: "doubao-seedream-4-5-251128" },
  { label: "doubao-seedream-4-0-250828", value: "doubao-seedream-4-0-250828" },
]);

const sizeOptions = [
  { label: "默认（2048 基准）", value: "default" },
  { label: "高质（4096 基准）", value: "high" },
];

const responseOptions = [
  { label: "url", value: "url" },
  { label: "b64_json", value: "b64_json" },
];

const aspectPresets = [
  { label: "1:1", value: "1:1", s: "width: 100%; height: 100%;" },
  { label: "3:4", value: "3:4", s: "width: 75%; height: 100%;" },
  { label: "4:3", value: "4:3", s: "width: 100%; height: 75%;" },
  { label: "16:9", value: "16:9", s: "width: 100%; height: 56%;" },
  { label: "9:16", value: "9:16", s: "width: 56%; height: 100%;" },
  { label: "2:3", value: "2:3", s: "width: 67%; height: 100%;" },
  { label: "3:2", value: "3:2", s: "width: 100%; height: 67%;" },
];

const seqOptions = [
  { label: "disabled", value: "disabled" },
  { label: "auto", value: "auto" },
];

const nOptions = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
];

const optimizeOptions = [
  { label: "standard（高质量）", value: "standard" },
  { label: "fast（速度优先，4.0 可用）", value: "fast" },
];

const isDisabled = computed(() => {
  if (st.value.isLoading) return true;
  if (st.value.prompt.trim() === "") return true;
  if (st.value.mode === "edit" && !editImageFile.value) return true;
  return false;
});

const handleUpload = (input: any) => {
  if (images.value.length >= 14) {
    ms.error("最多支持 14 张参考图");
    return;
  }
  const file = input.target.files[0];
  upImg(file)
    .then((d) => {
      images.value.push(d);
      fsRef.value.value = "";
    })
    .catch((e) => ms.error(e));
};

const removeImage = (idx: number) => {
  images.value.splice(idx, 1);
};

const handleEditImageUpload = (input: any) => {
  const file = input.target.files[0];
  if (!file) return;

  editImageFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    editImageUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
  editImageRef.value.value = "";
};

const handleEditMaskUpload = (input: any) => {
  const file = input.target.files[0];
  if (!file) return;

  editMaskFile.value = file;
  ms.success("Mask 图片已上传");
  editMaskRef.value.value = "";
};

const removeEditImage = () => {
  editImageFile.value = null;
  editImageUrl.value = "";
};

const removeEditMask = () => {
  editMaskFile.value = null;
};

const buildPayload = () => {
  const extra_body: Record<string, any> = {};
  const sizeValue = st.value.size;
  const payload: any = {
    model: st.value.model,
    prompt: st.value.prompt.trim(),
    size: sizeValue,
    response_format: st.value.response_format,
    n: st.value.n,
    seed: st.value.seed,
  };

  if (st.value.mode === "img2img" && images.value.length > 0) {
    payload.image = images.value[0];
  } else if (st.value.mode === "multi" && images.value.length > 0) {
    payload.image = images.value.length === 1 ? images.value[0] : [...images.value];
  } else if (st.value.mode === "group") {
    if (images.value.length > 0) {
      payload.image = images.value.length === 1 ? images.value[0] : [...images.value];
    }
    payload.n = undefined;
  } else if (st.value.mode === "edit") {
    payload.editImageFile = editImageFile.value;
    payload.editMaskFile = editMaskFile.value;
    return payload;
  }

  extra_body.watermark = st.value.watermark;

  if (st.value.mode === "group") {
    extra_body.sequential_image_generation = "auto";
    extra_body.sequential_image_generation_options = {
      max_images: st.value.max_images,
    };
  } else {
    extra_body.sequential_image_generation = "disabled";
  }

  if (st.value.optimize_mode) {
    extra_body.optimize_prompt_options = { mode: st.value.optimize_mode };
  }

  if (Object.values(extra_body).some((v) => v !== undefined)) {
    payload.extra_body = extra_body;
  }
  return payload;
};

const create = () => {
  if (isDisabled.value) return;
  const payload = buildPayload();
  const action = st.value.mode === "edit" ? "gpt.seedream.edit" : "gpt.seedream";
  homeStore.setMyData({
    act: "draw",
    actData: { action, data: payload },
  });
  st.value.isLoading = true;
};

const loadModels = async () => {
  try {
    const list = await seedreamListModels();
    if (Array.isArray(list) && list.length > 0) {
      modelOptions.value = list.map((id: string) => ({ label: id, value: id }));
      if (!list.includes(st.value.model)) {
        st.value.model = list[0];
      }
    }
  } catch (error: any) {
    ms.error(error?.message || "加载模型失败");
  }
};

onMounted(() => {
  loadModels();
  applyAspectSize();
});

watch(
  () => homeStore.myData.act,
  (n) => {
    if (n === "updateChat") {
      st.value.isLoading = false;
    }
  },
);

const applyAspectSize = () => {
  const base = st.value.quality === "high" ? 4096 : 2048;
  const [wRatio, hRatio] = st.value.aspect.split(":").map((v) => Number(v));
  const maxSide = Math.max(wRatio, hRatio);
  const width = Math.round((base * wRatio) / maxSide);
  const height = Math.round((base * hRatio) / maxSide);
  st.value.size = `${width}x${height}`;
};
</script>

<template>
  <div class="p-1 space-y-3">
    <!-- 比例选择器 - 放在最上面 -->
    <section class="mb-4">
      <div class="flex items-center justify-between space-x-1">
        <template v-for="item in aspectPresets" :key="item.value">
          <section
            class="aspect-item flex-1 rounded border-2 dark:border-neutral-700 cursor-pointer"
            :class="{ active: st.aspect === item.value }"
            @click="st.aspect = item.value; applyAspectSize();"
          >
            <div class="aspect-box-wrapper mx-auto my-2 flex h-5 w-5 items-center justify-center">
              <div class="aspect-box rounded border-2 dark:border-neutral-700" :style="item.s"></div>
            </div>
            <p class="mb-1 text-center text-sm">{{ item.label }}</p>
          </section>
        </template>
      </div>
      <div class="text-xs text-gray-500 mt-1">{{ $t('seedream.currentSize') }}{{ st.size }}</div>
    </section>

    <section class="flex justify-between items-center">
      <div>{{ $t('dance.model') }}</div>
      <n-select
        v-model:value="st.model"
        :options="modelOptions"
        size="small"
        filterable
        tag
        class="!w-[70%]"
      />
    </section>

    <n-divider title-placement="left">{{ $t('seedream.mode') }}</n-divider>
    <n-tabs type="segment" size="small" v-model:value="st.mode">
      <n-tab-pane name="txt2img" :tab="$t('seedream.txt2img')">
        <div class="text-xs text-gray-500 pb-1">{{ $t('seedream.txt2imgDesc') }}</div>
      </n-tab-pane>
      <n-tab-pane name="img2img" :tab="$t('seedream.img2img')">
        <div class="text-xs text-gray-500 pb-1">{{ $t('seedream.img2imgDesc') }}</div>
      </n-tab-pane>
      <n-tab-pane name="multi" :tab="$t('seedream.multi')">
        <div class="text-xs text-gray-500 pb-1">{{ $t('seedream.multiDesc') }}</div>
      </n-tab-pane>
      <n-tab-pane name="group" :tab="$t('seedream.group')">
        <div class="text-xs text-gray-500 pb-1">{{ $t('seedream.groupDesc') }}</div>
      </n-tab-pane>
      <n-tab-pane name="edit" :tab="$t('seedream.edit')">
        <div class="text-xs text-gray-500 pb-1">{{ $t('seedream.editDesc') }}</div>
      </n-tab-pane>
    </n-tabs>

    <section class="flex justify-between items-center">
      <div>{{ $t('seedream.resolution') }}</div>
      <div class="w-[70%] space-y-1">
        <n-select v-model:value="st.quality" :options="sizeOptions" size="small" @update:value="applyAspectSize" />
      </div>
    </section>

    <section class="flex justify-between items-center" v-if="st.mode !== 'group'">
      <div>{{ $t('seedream.count') }}</div>
      <n-select
        v-model:value="st.n"
        :options="nOptions"
        size="small"
        class="!w-[70%]"
      />
    </section>

    <section class="flex justify-between items-center">
      <div>{{ $t('mj.seed') }}</div>
      <n-input-number
        v-model:value="st.seed"
        :min="-1"
        :max="9999999"
        size="small"
        class="!w-[70%]"
      />
    </section>

    <section class="flex justify-between items-center">
      <div>{{ $t('seedream.optimizePrompt') }}</div>
      <n-select
        v-model:value="st.optimize_mode"
        :options="optimizeOptions"
        size="small"
        class="!w-[70%]"
      />
    </section>

    <section class="flex justify-between items-center">
      <div>{{ $t('seedream.responseFormat') }}</div>
      <n-select
        v-model:value="st.response_format"
        :options="responseOptions"
        size="small"
        class="!w-[70%]"
      />
    </section>

    <section class="flex justify-between items-center">
      <div>{{ $t('seedream.watermark') }}</div>
      <n-switch v-model:value="st.watermark" size="small" />
    </section>

    <section class="flex justify-between items-center" v-if="st.mode === 'group'">
      <div>{{ $t('seedream.groupCount') }}</div>
      <div class="w-[70%]">
        <n-slider v-model:value="st.max_images" :step="1" :min="1" :max="10" />
      </div>
    </section>

    <n-divider title-placement="left">{{ $t('seedream.refImages') }}</n-divider>
    <div v-if="st.mode !== 'edit'">
      <div class="mb-1 flex justify-between items-center">
        <span>{{ $t('seedream.refImagesOptional') }}</span>
        <NButton size="small" @click="fsRef.click()">
          <SvgIcon icon="ri:upload-line" class="mr-1" /> {{ $t('video.upload') }}
        </NButton>
      </div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(img, idx) in images"
          :key="idx"
          class="w-[76px] h-[76px] relative rounded border border-dashed border-neutral-400 overflow-hidden"
        >
          <img :src="img" class="w-full h-full object-cover" />
          <SvgIcon
            icon="fluent:delete-12-regular"
            class="absolute top-0 right-0 text-red-500 cursor-pointer bg-white/80"
            @click="removeImage(idx)"
          />
        </div>
      </div>
    </div>

    <!-- 编辑模式专属 UI -->
    <template v-if="st.mode === 'edit'">
      <div class="mb-3">
        <div class="mb-1 flex justify-between items-center">
          <span class="text-sm font-medium">{{ $t('seedream.editImage') }}</span>
          <NButton size="small" @click="editImageRef.click()">
            <SvgIcon icon="ri:upload-line" class="mr-1" /> {{ $t('video.upload') }}
          </NButton>
        </div>
        <div v-if="editImageUrl" class="relative inline-block">
          <img :src="editImageUrl" class="max-w-full h-auto rounded border border-neutral-300" />
          <SvgIcon
            icon="fluent:delete-12-regular"
            class="absolute top-2 right-2 text-red-500 cursor-pointer bg-white/80 p-1 rounded"
            @click="removeEditImage()"
          />
        </div>
        <div v-else class="text-sm text-gray-400 text-center py-4 border border-dashed rounded">
          {{ $t('seedream.editImagePlaceholder') }}
        </div>
      </div>

      <div class="mb-3">
        <div class="mb-1 flex justify-between items-center">
          <span class="text-sm font-medium">{{ $t('seedream.maskImage') }} ({{ $t('seedream.optional') }})</span>
          <NButton size="small" @click="editMaskRef.click()">
            <SvgIcon icon="ri:upload-line" class="mr-1" /> {{ $t('video.upload') }}
          </NButton>
        </div>
        <div v-if="editMaskFile" class="text-sm text-green-600">
          ✓ {{ $t('seedream.maskUploaded') }}
        </div>
        <div v-else class="text-sm text-gray-400 text-center py-4 border border-dashed rounded">
          {{ $t('seedream.maskImagePlaceholder') }}
        </div>
      </div>
    </template>

    <div>
      <n-input
        type="textarea"
        v-model:value="st.prompt"
        :placeholder="$t('mjchat.prompt')"
        round
        clearable
        maxlength="1500"
        show-count
        :autosize="{ minRows: 4, maxRows: 10 }"
      />
    </div>

    <div class="flex justify-end">
      <n-button type="primary" :disabled="isDisabled" @click="create">
        <SvgIcon icon="mingcute:send-plane-fill" class="mr-1" />
        <template v-if="st.isLoading">{{ $t("mjchat.submiting") }}</template>
        <template v-else>{{ $t("mjchat.imgcreate") }}</template>
      </n-button>
    </div>

    <!-- 底部说明文字 -->
    <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
      {{ $t('seedream.description') }}
    </div>

    <input
      type="file"
      @change="handleUpload"
      ref="fsRef"
      style="display: none"
      accept="image/jpeg, image/jpg, image/png, image/gif"
    />
    <input
      type="file"
      @change="handleEditImageUpload"
      ref="editImageRef"
      style="display: none"
      accept="image/jpeg, image/jpg, image/png, image/gif"
    />
    <input
      type="file"
      @change="handleEditMaskUpload"
      ref="editMaskRef"
      style="display: none"
      accept="image/jpeg, image/jpg, image/png, image/gif"
    />
  </div>
</template>
