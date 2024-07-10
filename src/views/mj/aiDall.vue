<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { NButton, NSelect, NInput } from 'naive-ui';
import { mlog } from '@/api'
import { homeStore } from '@/store';
import { SvgIcon } from '@/components/common';


//添加模型
const config = ref({
    model: [
        { "label": "dall-e-3", "value": "dall-e-3" },
        
        { "label": "dalle3", "value": "dalle3" },
        
    ],
    style: [
        { "label": "3D模型", "value": "3d-model" },
        { "label": "胶片", "value": "analog-film", selected: true },
        { "label": "动漫", "value": "anime" },
        { "label": "电影化的", "value": "cinematic" },
        { "label": "漫画书", "value": "comic-book" },
        { "label": "数字艺术", "value": "digital-art" },
        { "label": "增强", "value": "enhance" },
        { "label": "奇幻艺术", "value": "fantasy-art" },
        { "label": "等轴测", "value": "isometric" },
        { "label": "线描", "value": "line-art" },
        { "label": "低多边形", "value": "low-poly" },
        { "label": "霓虹朋克", "value": "neon-punk" },
        { "label": "折纸", "value": "origami" },
        { "label": "摄影的", "value": "photographic" },
        { "label": "像素艺术", "value": "pixel-art" },
        { "label": "纹理", "value": "texture" },
        { "label": "手工陶土", "value": "craft-clay" }
    ],
    n: [
        { "label": "1张", "value": 1 },
        { "label": "2张", "value": 2 },
        { "label": "3张", "value": 3 },
        { "label": "4张", "value": 4 },
        { "label": "5张", "value": 5 }
    ]
});

//增加功能
import config1 from "./draw.json";
import { t } from "@/locales"
const farr = [
    { k: 'style', v: t('mjchat.tStyle') }
    , { k: 'view', v: t('mjchat.tView') }
    , { k: 'shot', v: t('mjchat.tShot') }
    , { k: 'light', v: t('mjchat.tLight') }
];
const drawlocalized = computed(() => {
    let localizedConfig = {};
    Object.keys(config1).forEach((key) => {
        localizedConfig[key] = config1[key].map((option) => {
            // 假设 labelKey 如 "draw.qualityList.general"
            let path = option.labelKey; // 直接使用 labelKey 作为路径
            return {
                ...option,
                label: t(path), // 从 i18n 中获取本地化的标签
            };
        });
    });
    return localizedConfig;
});

const st = ref({ isGo: false, shot: '', light: '', style: '', view: '', text: '' });

const f = ref({ 
    size: '1024x1024', 
    prompt: '', 
    "model": "dall-e-3", 
    "n": 1,
    style: 'analog-film'
});
const isDisabled = computed(() => {
    if (st.value.isGo) return true;
    if (f.value.prompt.trim() == '') return true;
    return false;
});
const create = async () => {
    // const d= await gptFetch('/v1/embeddings',{
    // "input":  f.value.prompt,
    // "model": "text-embedding-ada-002"
    // });
    // mlog('test',d );
    //return ;
    st.value.text = createPrompt(f.value.prompt);
    let obj = {
        action: 'gpt.dall-e-3',
        //data:f.value

        //增加功能
        data: {
            prompt: st.value.text,
            model: f.value.model,
            size: f.value.size,
            style: f.value.style,
            n: f.value.n,
        }
    };
    let obj1 = {
        action: 'gpt.dall-e-3',
        data: {
            prompt: st.value.text,
            model: f.value.model,
            size: f.value.size,
        }
    };
    if (f.value.model == 'dall-e-3') {
        homeStore.setMyData({ act: 'draw', actData: obj1 });
    } else {
        homeStore.setMyData({ act: 'draw', actData: obj });
    }
    st.value.isGo = true;
}
watch(() => homeStore.myData.act, (n) => {
    if (n == 'dallReload') {
        st.value.isGo = false;
        f.value.prompt = '';
    }
    if (n == 'updateChat') st.value.isGo = false;
})

const dimensionsList = computed(() => {
    if (f.value.model == 'dall-e-2') {
        return [{
            "label": "1024px*1024px",
            "value": "1024x1024"
        }, {
            "label": "512px*512px",
            "value": "512x512"
        }, {
            "label": "256px*256px",
            "value": "256x256"
        }
        ];
    }
    return [{
        "label": "1024px*1024px",
        "value": "1024x1024"
    }, {
        "label": "1792px*1024px",
        "value": "1792x1024"
    }, {
        "label": "1024px*1792px",
        "value": "1024x1792"
    }
    ]

})
watch(() => f.value.model, () => {
    f.value.size = '1024x1024';
})

//增加功能
function createPrompt(rz: string) {
    let rzp = '' //参数组合字符串
    let rzk = ''; //描述词组合字符串
    for (let v of farr) {
        if (!st.value[v.k] || st.value[v.k] == null || st.value[v.k] == '') continue;
        mlog('k ', rz, f.value);
        if (st.value[v.k]) rzk += `${st.value[v.k]},`;
    }

    mlog('createPrompt ', rz, st.value);
    rz = rzk + rz + rzp;
    return rz;
}
const clearAll = () => {
    st.value.shot = '';
    st.value.light = '';
    st.value.style = '';
    st.value.view = '';
}
</script>
<template>
    <section class="mb-4 flex justify-between items-center">
        <div>{{ $t('mjchat.version') }} </div>
        <n-select v-model:value="f.model" :options="config.model" size="small" class="!w-[70%]" :clearable="false" />
    </section>
    <div class="mb-4 flex justify-between items-center">
        <div>自定义模型</div>
        <n-input type="textarea" v-model:value="f.model" size="small" class="!w-[70%]" :clearable="false"
            :autosize="{ minRows: 1, maxRows: 1 }" />
    </div>
    <section class="mb-4 flex justify-between items-center">
        <div>{{ $t('mjchat.size') }}</div>
        <n-select v-model:value="f.size" :options="dimensionsList" size="small" class="!w-[70%]" :clearable="false" />
    </section>
    <section class="mb-4 flex justify-between items-center">
        <div>样式预设</div>
        <n-select v-model:value="f.style" :options="config.style" size="small" class="!w-[70%]" :clearable="true" />
    </section>
    <section class="mb-4 flex justify-between items-center">
        <div>张数</div>
        <n-select v-model:value="f.n" :options="config.n" size="small" class="!w-[70%]" :clearable="true" />
    </section>

    <section class="mb-4 flex justify-between items-center" v-for=" v in farr">
        <div>{{ v.v }}</div>
        <n-select v-model:value="st[v.k]" :options="drawlocalized[v.k + 'List']" size="small" class="!w-[70%]"
            :clearable="true" />
    </section>

    <div class="mb-1">
        <n-input type="textarea" v-model:value="f.prompt" :placeholder="$t('mjchat.prompt')" round clearable
            maxlength="2000" show-count :autosize="{ minRows: 3, maxRows: 10 }" />
    </div>

    <div class="mb-4 flex justify-end items-center">
        <div class="flex ">
            <n-button type="primary" :block="true" :disabled="isDisabled" @click="create()">
                <SvgIcon icon="mingcute:send-plane-fill" />
                {{ $t('mjchat.imgcreate') }}
            </n-button>
        </div>
    </div>

    <div class="flex justify-start items-center py-1">
        <div>
            <n-tag type="success" round size="small" style="cursor: pointer; " :bordered="false" @click="clearAll()">
                <div style="display: flex;">
                    <SvgIcon icon="ant-design:clear-outlined" />{{ $t('mj.clearAll') }}
                </div>
            </n-tag>
        </div>
    </div>

    <ul class="pt-4" v-html="$t('mjchat.dalleInfo')">

    </ul>
</template>
