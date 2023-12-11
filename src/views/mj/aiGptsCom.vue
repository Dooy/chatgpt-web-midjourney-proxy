<script setup lang="ts"> 
import { myFetch, gptsType, mlog } from '@/api';
import { homeStore,gptConfigStore,useChatStore } from '@/store';
import { ref,computed ,watch  } from 'vue';
import { useMessage ,NButton,NImage,NTag} from 'naive-ui';
import { SvgIcon } from '@/components/common';
import { useRouter } from 'vue-router';

const router = useRouter()
const ms = useMessage();
const chatStore = useChatStore()
const emit = defineEmits(['close','toq']);
const pp= defineProps<{q:string}>( );
//const gptsList= ref<gptsType[]>([]);
const gptsPageList = ref<gptsType[]>([]);
const gptsInitList = ref<gptsType[]>([]);
const gptsSearchList = ref<gptsType[]>([]);
const st= ref({loadPage:false,q:'',tab:'',search:false});
const tag= ref(['画图','文件','发票']);
const load= async ()=>{
    const gptUrl= homeStore.myData.session.gptUrl??'https://gpts.ddaiai.com/open/gpts';
    let d = await myFetch(gptUrl);
    gptsInitList.value = d.gpts as gptsType[];
    tag.value= d.tag as string[];
}
const go= async ( item: gptsType)=>{
    gptConfigStore.setMyData({model:  `${ item.gid }`   ,gpts:item});
    ms.success('切换成功！');
    const gptUrl= `https://gpts.ddaiai.com/open/gptsapi/use`; 
    myFetch(gptUrl,item );
    emit('close');
    mlog('go local ', homeStore.myData.local );
    if(homeStore.myData.local!=='Chat') router.replace({name:'Chat',params:{uuid:chatStore.active}});

}
const pageLoad= async ()=>{
    st.value.loadPage= true;
    const gptUrl= `https://gpts.ddaiai.com/open/gptsapi/list/${ gptsPageList.value.length}`; 
    let d = await myFetch(gptUrl);
    st.value.loadPage= false;

    let rz = d.data.list  as gptsType[];
    gptsPageList.value = rz.concat( gptsPageList.value  )
}
const gptsList = computed(()=>{
    let rz:gptsType[]=[];
    if(st.value.tab=='search'){
        return gptsSearchList.value;
        //mlog('search', st.value.tab );
    }
    return rz.concat( gptsInitList.value,gptsPageList.value );
})
const searchQ= async (q:string)=>{
    st.value.q= q;
    st.value.tab= 'search';
    st.value.search= true;
    const gptUrl= `https://gpts.ddaiai.com/open/gptsapi/search?q=${ st.value.q }`; 
    let d = await myFetch(gptUrl);
      st.value.search= false;
    gptsSearchList.value = d.data.list  as gptsType[];
}
const goSearch =(q:string)=>{
    emit('toq',{q});
    searchQ(q);
}
watch(()=>pp.q,(n)=>{
    if(n=='') st.value.tab= '';
})
load();
defineExpose({ searchQ })
</script>
<template>

<div class="w-full h-full p-4">
    <template v-if="gptsList.length>0">
        <div class="flex items-center justify-start line-clamp-1 pb-4"  >
            <div class="m-1 cursor-pointer" v-for="v in tag" @click="goSearch(v)">
            <n-button strong   round size="small" type="success" v-if="v==pp.q">{{ v }}</n-button>
            <n-button strong secondary round size="small" type="success" v-else>{{ v }}</n-button>
            </div>
        </div>
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"  >
            
            <div @click="go(v)" v-for="v in gptsList" class="group relative flex gap-3 rounded-2xl bg-[#e8eaf1] p-5 dark:bg-neutral-600 cursor-pointer ">
            
                <div class="min-w-0 flex-1">
                    <div class="flex justify-between items-center">
                        <h3 class=" transition   text-lg font-semibold line-clamp-1"> {{ v.name }}</h3>
                        <n-tag type="success" size="small" round v-if="v.use_cnt && (+v.use_cnt)>0">
                        <div class="flex items-center"><SvgIcon icon="mdi:hot"  ></SvgIcon>{{ v.use_cnt }}</div>
                        </n-tag>
                    </div>
                    <div class="mt-0.5 text-zinc-400 text-md line-clamp-2">{{ v.info }}</div>
                     
                </div>
                <NImage :src="v.logo" :preview-disabled="true" lazy
                class="group-hover:scale-[130%] duration-300 shrink-0 overflow-hidden bg-base object-cover rounded-full bc-avatar w-[80px] h-[80px]">
                    <template #placeholder>
                      <div class="w-full h-full justify-center items-center flex"  >
                       <SvgIcon icon="line-md:downloading-loop" class="text-[60px] text-green-300"   ></SvgIcon>
                      </div>
                    </template>
                </NImage>
                <!-- <img  class="group-hover:scale-[130%] duration-300 shrink-0 overflow-hidden bg-base object-cover rounded-full bc-avatar w-[80px] h-[80px]" :src="v.logo"/> -->
            </div>
        </div>
        <div class="flex items-center justify-center py-10" v-if="st.tab=='' ">
            <div @click="pageLoad()" v-if="st.loadPage">正在加载...</div>
            <NButton @click="pageLoad()" v-else>加载更多</NButton>
        </div>
    </template>
    <div class="h-full flex items-center justify-center flex-col"  v-else-if="st.tab=='search' && !st.search">
        <div>未能找到 <b class=" text-green-400">{{st.q}}</b>相关内容, 你可尝试以下内容</div>
        <div class="flex items-center justify-center flex-wrap">
            <div class="m-1 cursor-pointer" v-for="v in tag" @click="goSearch(v)"><n-button strong secondary round size="small" type="success" >{{ v }}</n-button></div>
        </div>
    </div>
    <div class="h-full flex items-center justify-center"  v-else>

        正在载入...
    </div>
</div>
</template>