<script lang="ts" setup>
import { localGet, mlog } from "@/api";
import { ref } from "vue";
import { NImage } from "naive-ui";
import { SvgIcon } from "@/components/common";

const pp = defineProps<{ image: string }>();
const images = ref<{ fileName: string; fileBase64: string }[]>([]);
const files = ref<{ fileName: string; fileBase64: string }[]>([]);

const isImage = (url:string) => {
  const extensions = [".jpeg", ".jpg", ".png", ".gif", ".webp"];
  url = url.toLowerCase();
  return extensions.some((ext) => url.endsWith(ext));
};

const loadImages = async () => {
  //mlog("loadImages", pp.image);
  try {
    const response = await localGet(pp.image);
    if (response) {
      const parsedData = JSON.parse(response);
      if (
        Array.isArray(parsedData.fileName) &&
        Array.isArray(parsedData.fileBase64)
      ) {
        const combinedData = parsedData.fileName.map(
          (name: string, index: number) => ({
            fileName: name,
            fileBase64: parsedData.fileBase64[index],
          })
        );

        images.value = combinedData.filter((file) => isImage(file.fileName));
        files.value = combinedData.filter((file) => !isImage(file.fileName));
      }
    }
  } catch (error) {
    console.error("Failed to load images:", error);
  }
};

loadImages();
</script>

<template>
  <div v-if="images.length" class="flex flex-wrap justify-start items-baseline p-1">
    <div v-for="(img, k) of images" :key="k">
      <NImage :src="img.fileBase64" preview class="rounded" :class="[images.length <= 1 ? 'w-[250px]' : 'w-[130px]']">
        <template #placeholder>
          <a class="w-full h-full flex items-center justify-center text-neutral-500" :href="img.fileBase64"
            target="_blank">
            <SvgIcon icon="mdi:download" />{{ img.fileName }}
          </a>
        </template>
      </NImage>
    </div>
  </div>
  <div v-if="files.length" class="block justify-start items-baseline p-1">
    <div v-for="(file, k) of files" :key="k" :class="[
      'w-full h-full block items-center text-xs text-neutral-500',
      { 'mb-1': k !== files.length - 1 },
    ]">
      <a :href="file.fileBase64" target="_blank" class="flex items-center">
        <SvgIcon icon="mdi:download" class="mr-2" />
        <n-ellipsis style="max-width: 280px">
          {{ file.fileName }}
        </n-ellipsis>
      </a>
    </div>
  </div>
</template>