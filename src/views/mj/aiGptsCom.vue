<script setup lang="ts"> 
import { myFetch, gptsType, mlog, chatSetting,my2Fetch } from '@/api';
import { homeStore,gptConfigStore,useChatStore, gptsUlistStore } from '@/store';
import { ref,computed ,watch  } from 'vue';
import { useMessage ,NButton,NImage,NTag,NPopover} from 'naive-ui';
import { SvgIcon } from '@/components/common';
import { useRouter } from 'vue-router';
import { t } from '@/locales'; 
import aiGptsAdd  from "./aiGptsAdd.vue"
import { time } from 'console';
import { sleep } from '@/api/suno';

const router = useRouter()
const ms = useMessage();
const chatStore = useChatStore()
const emit = defineEmits(['close','toq']);
const pp= defineProps<{q:string}>( );
//const gptsList= ref<gptsType[]>([]);
const gptsPageList = ref<gptsType[]>([]);
const gptsInitList = ref<gptsType[]>([]);
const gptsSearchList = ref<gptsType[]>([]);
const st= ref({loadPage:false,q:'',tab:'',search:false,showAdd:false});
const tag= ref(['画图','文件','发票']);
const load= async ()=>{
    
    // const gptUrl= homeStore.myData.session.gptUrl?  homeStore.myData.session.gptUrl :'';
    // mlog('load',gptUrl );
     let d;
    if( homeStore.myData.session.gptUrl ){
       d = await my2Fetch( homeStore.myData.session.gptUrl  );
    }else {
        d = await myFetch('https://gpts.ddaiai.com/open/gpts');
    }
    gptsInitList.value = d.gpts as gptsType[];
    tag.value= d.tag as string[];
}
const go= async ( item: gptsType)=>{
    
    let uuid=  chatStore.active
    if( uuid ){
       const chat= chatStore.getChatByUuid( uuid );
       if( chat.length>0){
            uuid=  Date.now()
            chatStore.addHistory({ title: 'New Chat', uuid, isEdit: false })
            await sleep(500);
       }
    }

    const saveObj= {model:  `${ item.gid }`   ,gpts:item}
    gptConfigStore.setMyData(saveObj); 
    if( uuid ){ //保存到对话框
        const  chatSet = new chatSetting(uuid );
        // if( chatSet.findIndex()>-1 ){
        //    mlog('含有： ', chatSet.findIndex()  );
          
        // }
        //全保存
        chatSet.save( saveObj )
    }
    ms.success(t('mjchat.success2'));
    const gptUrl= `https://gpts.ddaiai.com/open/gptsapi/use`; 
    myFetch(gptUrl,item );
    emit('close');
    mlog('go local ', homeStore.myData.local );
    if(homeStore.myData.local!=='Chat') router.replace({name:'Chat',params:{uuid: uuid }});

    gptsUlistStore.setMyData( item );

}
const pageLoad= async ()=>{
    st.value.loadPage= true;
    const gptUrl= `https://gpts.ddaiai.com/open/gptsapi/list/${ gptsPageList.value.length}`; 
    let d = await myFetch(gptUrl);
    st.value.loadPage= false;

    let rz = d.data.list  as gptsType[];
    gptsPageList.value = gptsPageList.value.concat(rz) //rz.concat( gptsPageList.value  )
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

const badgo=(item:gptsType ,e:Event )=>{
    e.stopPropagation();
    mlog('badgo', item );
    const gptUrl= `https://gpts.ddaiai.com/open/gptsapi/bad`; 
    myFetch(gptUrl,item );
    item.bad= item.bad?(+item.bad+1):1;
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
            <div  class="m-1 cursor-pointer">
                 <n-button strong secondary round size="small" type="success" @click="st.showAdd=!st.showAdd"> {{ $t('mjchat.addGPTS') }}</n-button>
            </div>
        </div>
        <div class="pb-4" v-if="st.showAdd">
            <div class="w-[400px]"><aiGptsAdd/></div> 
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"  >
            
            <div @click="go(v)" v-for="v in gptsList" class="group relative flex gap-3 rounded-2xl bg-[#e8eaf1] p-5 dark:bg-neutral-600 cursor-pointer ">
            
                <div class="min-w-0 flex-1 mt-[-10px]">
                    <div class="flex justify-between items-center">
                        <h3 class=" transition   text-lg font-semibold line-clamp-1"> {{ v.name }}</h3>
                        
                        
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
                <div class="space-x-1 flex absolute bottom-2 left-4">
                     <n-popover trigger="hover">
                        <template #trigger>
                        <n-tag type="success" size="small" round>
                        <div class="flex items-center"><SvgIcon icon="mdi:hot"  ></SvgIcon>{{ v.use_cnt }}</div>
                        </n-tag>
                        </template>
                        <span>使用热度</span>
                    </n-popover>
                     <n-popover trigger="hover" >
                        <template #trigger>
                        <n-tag type="success" size="small" round >
                        <div class="flex items-center cursor-pointer" @click="badgo(v, $event )"><SvgIcon icon="icon-park-outline:bad-two"  ></SvgIcon>
                        <span class="ml-[2px]" > {{ v.bad }}</span>
                        </div>
                        </n-tag>
                        </template>
                         <span>不好用或应用已不存在请点这个</span>
                    </n-popover>
                </div>
            </div>
            
        </div>
        <div class="flex items-center justify-center py-10" v-if="st.tab=='' ">
            <div @click="pageLoad()" v-if="st.loadPage">{{ $t('mjchat.loading2') }}</div>
            <NButton @click="pageLoad()" v-else>{{ $t('mjchat.loadmore') }}</NButton>
        </div>
    </template>
    <div class="h-full flex items-center justify-center flex-col"  v-else-if="st.tab=='search' && !st.search">
        <div>{{ $t('mjchat.nofind') }}<b class=" text-green-400">{{st.q}}</b> {{$t('mjchat.nofind2')}}</div>
        <div class="flex items-center justify-center flex-wrap">
            <div class="m-1 cursor-pointer" v-for="v in tag" @click="goSearch(v)"><n-button strong secondary round size="small" type="success" >{{ v }}</n-button></div>
        </div>
        <div class="p-10" >
            <div class="w-[400px]"><aiGptsAdd/></div> 
        </div>
    </div>
    <div class="h-full flex items-center justify-center"  v-else>
        {{ $t('mjchat.loading2') }}
    </div>
</div>
</template>