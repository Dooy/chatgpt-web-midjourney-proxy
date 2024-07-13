<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import pkg from '../../../../package.json'
import { fetchChatConfig, getLastVersion } from '@/api'
import { useAuthStore } from '@/store'
import { gptUsage } from "@/api";

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  usage?: string
  remaining?: string
  hard_limit_usd?: string
}

const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()
const st = ref({ lastVersion: '' })

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

async function fetchConfig() {
  try {
    loading.value = true
    const dd = await gptUsage();
    config.value = {
      usage: dd.usage ? `${dd.usage}` : '-',
      remaining: dd.remaining ? `${dd.remaining}` : '-',
      hard_limit_usd: dd.hard_limit_usd ? `${dd.hard_limit_usd}` : '-',
      "apiModel": "ChatGPTAPI",
      "reverseProxy": "-",
      "timeoutMs": 100000,
      "socksProxy": "-",
      "httpsProxy": "-",
    };
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConfig();
})
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
        <p v-html="$t('mj.infoStar')"></p>
      </div>
      <p>{{ $t("setting.api") }}：{{ config?.apiModel ?? '-' }}</p>
      <p v-if="isChatGPTAPI" class=" flex items-center justify-between">
        <div>
          {{ $t("setting.monthlyUsage") }}：{{ config?.usage ?? '-' }}
        </div>
        <div>
          {{ $t("mj.totalUsage") }}：{{ config?.hard_limit_usd ? (+config?.hard_limit_usd).toFixed(2) : '-' }}
        </div>
        <div>
          {{ $t("setting.balance") }}：{{ config?.remaining ?? '-' }}
        </div>
      </p>
      <p v-if="!isChatGPTAPI">
        {{ $t("setting.reverseProxy") }}：{{ config?.reverseProxy ?? '-' }}
      </p>
    </div>
  </NSpin>
</template>
