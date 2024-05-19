<script lang="ts" setup>
import { computed, onMounted, onUnmounted, onUpdated, ref } from 'vue'
import MarkdownIt from 'markdown-it'
import mdKatex from '@traptitech/markdown-it-katex'
import mila from 'markdown-it-link-attributes'
import hljs from 'highlight.js'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { t } from '@/locales'
import { copyToClip } from '@/utils/copy'

import mjText from '@/views/mj/mjText.vue'
import dallText from '@/views/mj/dallText.vue'
import ttsText from '@/views/mj/ttsText.vue'
import whisperText from '@/views/mj/whisperText.vue'
import MjTextAttr from '@/views/mj/mjTextAttr.vue'
import aiTextSetting from '@/views/mj/aiTextSetting.vue'
import aiSetAuth from '@/views/mj/aiSetAuth.vue'
import { isApikeyError, isAuthSessionError, isTTS, mlog } from '@/api'

interface Props {
  inversion?: boolean
  error?: boolean
  text?: string
  loading?: boolean
  asRawText?: boolean
  chat:Chat.Chat
}

const props = defineProps<Props>()

const { isMobile } = useBasicLayout()

const textRef = ref<HTMLElement>()

const mdi = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language))
    if (validLang) {
      const lang = language ?? ''
      return highlightBlock(hljs.highlight(code, { language: lang }).value, lang)
    }
    return highlightBlock(hljs.highlightAuto(code).value, '')
  },
})

mdi.use(mila, { attrs: { target: '_blank', rel: 'noopener' } })
mdi.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })

const wrapClass = computed(() => {
  return [
    'text-wrap',
    'min-w-[20px]','max-w-[810px]',
    'rounded-md',
    isMobile.value ? 'p-2' : 'px-3 py-2',
    props.inversion ? 'bg-[#d2f9d1]' : 'bg-[#f4f6f8]',
    props.inversion ? 'dark:bg-[#a1dc95]' : 'dark:bg-[#1e1e20]',
    props.inversion ? 'message-request' : 'message-reply',
    { 'text-red-500': props.error },
  ]
})

const text = computed(() => {
  let value = props.text ?? ''
  if (!props.asRawText){
    value = value.replace(/\\\( *(.*?) *\\\)/g, '$$$1$$');
    //value = value.replace(/\\\((.*?)\\\)/g, '$$$1$$');
    value = value.replace(/\\\[ *(.*?) *\\\]/g, '$$$$$1$$$$');
    //
    value= value.replaceAll('\\[',"$$$$")
    value= value.replaceAll('\\]',"$$$$")   
    //mlog('replace', value)
    return mdi.render(value)
  }
  return value
})

function highlightBlock(str: string, lang?: string) {
  return `<pre class="code-block-wrapper"><div class="code-block-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">${t('chat.copyCode')}</span></div><code class="hljs code-block-body ${lang}">${str}</code></pre>`
}

function addCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement?.nextElementSibling?.textContent
        if (code) {
          copyToClip(code).then(() => {
            btn.textContent = '复制成功'
            setTimeout(() => {
              btn.textContent = '复制代码'
            }, 1000)
          })
        }
      })
    })
  }
}

function removeCopyEvents() {
  if (textRef.value) {
    const copyBtn = textRef.value.querySelectorAll('.code-block-header__copy')
    copyBtn.forEach((btn) => {
      btn.removeEventListener('click', () => {})
    })
  }
}

onMounted(() => {
  addCopyEvents()
})

onUpdated(() => {
  addCopyEvents()
})

onUnmounted(() => {
  removeCopyEvents()
})
</script>

<template>
  <div class="text-black" :class="wrapClass">
    <div ref="textRef" class="leading-relaxed break-words">
      <div v-if="!inversion">
        <aiTextSetting v-if="!inversion && isApikeyError(text)"/>
        <aiSetAuth v-if="!inversion && isAuthSessionError(text)" />
          
        <dallText :chat="chat" v-if="chat.model=='dall-e-3' || chat.model=='dall-e-2'" class="whitespace-pre-wrap" />
        <mjText v-if="chat.mjID" class="whitespace-pre-wrap" :chat="chat" :mdi="mdi"></mjText>
        <ttsText v-else-if="chat.model && isTTS(chat.model) && chat.text=='ok'" :chat="chat"/>
        <template v-else>
          <div v-if="!asRawText" class="markdown-body" :class="{ 'markdown-body-generate': loading }" v-html="text" />
          <div v-else class="whitespace-pre-wrap" v-text="text" />
        </template>
      </div>
      <whisperText v-else-if="text=='whisper' && chat.opt?.lkey "  :chat="chat" />
      <div v-else-if="asRawText" class="whitespace-pre-wrap" v-text="text" />
      <div v-else class="markdown-body "  style="--color-fg-default:#24292f"  v-html="text" />
      <!-- <div v-else class="whitespace-pre-wrap" v-text="text" /> -->
      <MjTextAttr :image="chat.opt?.images[0]" v-if="chat.opt?.images"></MjTextAttr>
      <whisperText v-if="chat.model && chat.model.indexOf('whisper')>-1 && chat.opt?.lkey " :isW="true"  :chat="chat" class="w-full" />
      <ttsText v-if="!inversion && chat.opt?.duration && chat.opt?.duration>0 && chat.opt?.lkey " :isW="true"  :chat="chat" class="w-full" />

      

    </div>
  </div>
</template>

<style lang="less">
@import url(./style.less);
</style>
