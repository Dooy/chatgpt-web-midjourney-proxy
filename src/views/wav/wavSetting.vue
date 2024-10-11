<script setup lang="ts">
import { gptServerStore } from '@/store';
import { NInput, NButton, NSwitch,NSelect ,useMessage} from 'naive-ui';
import { computed } from 'vue';
import {instructions} from '@/api';
import { t } from '@/locales';

const blurClean=()=>{
}
const ms= useMessage();
const emit= defineEmits(['close']);
const save = ()=>{
    gptServerStore.setMyData( gptServerStore.myData );
    ms.success( t('mjchat.success'));
    emit('close');
}

const voiceList= computed(()=>{
    let rz=[]; //'alloy','shimmer','echo'
    for(let o of "alloy,echo,shimmer".split(/[ ,]+/ig))rz.push({label:o,value:o}) 
    return rz;
});
</script>
<template>
    <div  class="w-full  ">
        <div class="p-2">
            <div class="flex justify-between items-baseline ">
                <div class="pb-1">
                <n-switch v-model:value="gptServerStore.myData.REALTIME_IS_WHISPER" size="small" >
                    <template #checked>whisper-1 ON </template> 
                    <template #unchecked>whisper-1 Off</template>
                </n-switch>
                </div>
                <div class="text-right">{{ $t('mj.setOpen') }}</div>

                </div>

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
            <section class="mb-4 flex justify-between items-center"  >
                <div >{{ $t('mj.tts_voice') }}</div>
                <n-select v-model:value="gptServerStore.myData.TTS_VOICE" :options="voiceList" size="small"  class="!w-[50%]"   />
            </section>

            <section class="mb-4"  >
                <div>{{ $t('mjchat.role') }}</div>
                <div>
                    <n-input  type="textarea"  :placeholder="instructions"   
                    v-model:value="gptServerStore.myData.REALTIME_SYSMSG" :autosize="{ minRows: 3 }"
                    />
                </div>
            </section>

            <section class=" text-right flex justify-end space-x-2"  >
                <!-- <NButton   @click="gptServerStore.setInit()">{{$t('mj.setBtBack')}}</NButton> -->
                <NButton type="primary" @click="save">{{$t('mj.setBtSave')}}</NButton>
            </section>
        </div>
    </div>
</template>