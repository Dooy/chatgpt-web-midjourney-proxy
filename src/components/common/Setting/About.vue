<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NSpin } from 'naive-ui'
import pkg from '../../../../package.json'
import { fetchChatConfig ,getLastVersion} from '@/api'
import { useAuthStore } from '@/store'

interface ConfigState {
  timeoutMs?: number
  reverseProxy?: string
  apiModel?: string
  socksProxy?: string
  httpsProxy?: string
  usage?: string
}

const authStore = useAuthStore()

const loading = ref(false)

const config = ref<ConfigState>()
const st = ref({lastVersion:''})

const isChatGPTAPI = computed<boolean>(() => !!authStore.isChatGPTAPI)

async function fetchConfig() {
  try {
    loading.value = true
    const { data } = await fetchChatConfig<ConfigState>()
    config.value = data
  }
  finally {
    loading.value = false
  }
}
const getLastFrom= ()=>{
  const str = localStorage.getItem('lastVersion');
  if(!str) return '';
  const obj = JSON.parse(str);
  if( Date.now()- obj.t>1000*60*60 ){
    return '';
  }
  return obj.v;
}
onMounted( () => {
  fetchConfig();
  
  let t = getLastFrom();
  if(t){
     st.value.lastVersion = t ;
  }else {
    getLastVersion().then(res=>{
      if(  res[0] && res[0].name ){
        st.value.lastVersion = res[0].name;
        localStorage.setItem('lastVersion',JSON.stringify( {v:  res[0].name,t: Date.now() } ))
      }
    });
  }
})
const  isShow = computed(()=>{
  return st.value.lastVersion && st.value.lastVersion != `v${pkg.version}`
});
</script>

<template>
  <NSpin :show="loading">
    <div class="p-4 space-y-4">
      <h2 class="text-xl font-bold">
        Version - {{ pkg.version }}
        <a class="text-red-500" href="https://github.com/Dooy/chatgpt-web-midjourney-proxy" target="_blank" v-if=" isShow  "> (发现更新版本 {{ st.lastVersion }})</a>
        <a class="text-gray-500" href="https://github.com/Dooy/chatgpt-web-midjourney-proxy" target="_blank" v-else-if="st.lastVersion"> (已是最新版本)</a>
      </h2>
      <div class="p-2 space-y-2 rounded-md bg-neutral-100 dark:bg-neutral-700">
        <p>
          此项目开源于
          <a
            class="text-blue-600 dark:text-blue-500"
            href="https://github.com/Dooy/chatgpt-web-midjourney-proxy"
            target="_blank"
          >
            GitHub
          </a>
          ，免费且基于 MIT 协议，没有任何形式的付费行为！
        </p>
        <p>
          如果你觉得此项目对你有帮助，请在 GitHub 帮我点个 Star 或者给予一点赞助，谢谢！
        </p>
      </div>
      <p>{{ $t("setting.api") }}：{{ config?.apiModel ?? '-' }}</p>
      <p v-if="isChatGPTAPI">
        {{ $t("setting.monthlyUsage") }}：{{ config?.usage ?? '-' }}
      </p>
      <p v-if="!isChatGPTAPI">
        {{ $t("setting.reverseProxy") }}：{{ config?.reverseProxy ?? '-' }}
      </p>
      <p>{{ $t("setting.timeout") }}：{{ config?.timeoutMs ?? '-' }}</p>
      <p>{{ $t("setting.socks") }}：{{ config?.socksProxy ?? '-' }}</p>
      <p>{{ $t("setting.httpsProxy") }}：{{ config?.httpsProxy ?? '-' }}</p>
    </div>
  </NSpin>
</template>
