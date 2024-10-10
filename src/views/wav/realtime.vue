<script setup lang="ts">
import { SvgIcon } from '@/components/common';
import an_main from './an_main.vue'
import aiTextSetting from '../mj/aiTextSetting.vue';
import { WavRecorder, WavStreamPlayer } from '@openai/realtime-wavtools';
import { onMounted, ref, watch } from 'vue';
import { mlog } from '@/api';
import { WavRenderer } from '@/utils/wav_renderer';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import { useMessage } from 'naive-ui';
import { gptServerStore } from '@/store';
import { t } from '@/locales';
const wavRecorderRef=  ref<WavRecorder>( new  WavRecorder({ sampleRate: 24000 })) 
const wavStreamPlayerRef=  ref<WavStreamPlayer>( new WavStreamPlayer({ sampleRate: 24000 })) 
const clientCanvasRef = ref<HTMLCanvasElement|null>(null);
const serverCanvasRef = ref<HTMLCanvasElement|null>(null);
const items= ref<ItemType[]>([]);
const realtimeEvents= ref<RealtimeEvent[]>([]);
const clientRef= ref<RealtimeClient>();
const ms= useMessage();
const st= ref({apikey:'', isConnect:false,baseUrl:'',isRealtime:true,msg:'请稍等',isClosed:false })
const edmit= defineEmits(['close'])

watch( ()=> wavRecorderRef.value,() => {
    const wavRecorder= wavRecorderRef.value;  
    
        const clientCanvas = clientCanvasRef.value;
        const wavStreamPlayer = wavStreamPlayerRef.value;
        let clientCtx: CanvasRenderingContext2D | null = null;
        if (clientCanvas) {
          if (!clientCanvas.width || !clientCanvas.height) {
            clientCanvas.width = clientCanvas.offsetWidth;
            clientCanvas.height = clientCanvas.offsetHeight;
          }
          clientCtx = clientCtx || clientCanvas.getContext('2d');
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              '#0099ff',
              20,
              0,
              2
            );
          }
        }

        const serverCanvas = serverCanvasRef.value;
        let serverCtx: CanvasRenderingContext2D | null = null;
        if (serverCanvas) {
          if (!serverCanvas.width || !serverCanvas.height) {
            serverCanvas.width = serverCanvas.offsetWidth;
            serverCanvas.height = serverCanvas.offsetHeight;
          }
          serverCtx = serverCtx || serverCanvas.getContext('2d');
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies('voice')
              : { values: new Float32Array([0]) };
             
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              '#009900',
              20,
              0,
              2
            );
          }
        }

},{deep:true,immediate:true});

const go= async()=>{
    st.value.msg=  t('mj.rtconnecting')
    if(st.value.isConnect){
        //mlog("isConnect yes!"  )
        ms.info("isConnect yes!");
        return;
    }
    
    if(!clientRef.value || !st.value.isConnect ){
        if(!st.value.apikey){
            
            ms.error("api key is null");
            return;
        }
        if(!st.value.baseUrl){ 
            ms.error("baseUrl is null");
            return;
        }
        clientRef.value= new RealtimeClient( { 
            apiKey:st.value.apikey,
            dangerouslyAllowAPIKeyInBrowser: true,
            baseUrl: st.value.baseUrl,
            
          }
        )
    }
    mlog("go", st.value.apikey )
    const client= clientRef.value
    const wavRecorder= wavRecorderRef.value
    const wavStreamPlayer= wavStreamPlayerRef.value
   
    try{
    // Connect to microphone
        await wavRecorder.begin();
    }catch(e){
        st.value.msg=t('mj.rtservererror2') 
        ms.error(st.value.msg);
        return 
    }
    // Connect to realtime API
    try{
        await client.connect(); 
    }catch(e ){
        st.value.msg= t('mj.rtservererror')
        ms.error( st.value.msg);

        return 
    }

    // Connect to audio output
    await wavStreamPlayer.connect();

    st.value.isConnect=true

    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `请用中文回答我！`,
        // text: `For testing purposes, I want you to list ten car brands. Number each item, e.g. "one (or whatever number you are one): the item name".`
      },
    ]);
    

    client.updateSession({
      turn_detection:  { type: 'server_vad' },
    });
    // client.on('error', (event: any) =>{
    //      ms.error('发生错误：'+event);
    //      console.error('error.event>>',event);
    // });

    await wavRecorder.record((data: { mono: Int16Array | ArrayBuffer; }) => {
        try{ 
            client.appendInputAudio(data.mono)
            st.value.msg=  t('mj.rtsuccess')
        }catch(e){
            disconnectConversation();
            // st.value.msg= t('mj.checkkey')
            // ms.error(st.value.msg);
            // mlog("appendInputAudio error", e )
            return
        }
    });

    myListen();
}

const disconnectConversation= async()=>{
    const wavRecorder= wavRecorderRef.value
    const wavStreamPlayer= wavStreamPlayerRef.value
    //clientRef.value?.disconnect();
    st.value.isConnect=false
    const client= clientRef.value;
    //client?.reset();
    client?.disconnect();
    await wavRecorder.end();
    await wavStreamPlayer.interrupt();
    st.value.msg=t('mj.rjcloded')
    ms.success( st.value.msg);
}

/**
 * Type for all event logs
 */
interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

const myListen=()=>{
    const client= clientRef.value;
    const wavRecorder= wavRecorderRef.value
    const wavStreamPlayer= wavStreamPlayerRef.value

    if( !client){
        return
    }
    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

    // handle realtime events from client + server for event logging
    client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
        setRealtimeEvents(realtimeEvent);
    });
    client.on('error', (event: any) =>{
         ms.error('发生错误：'+event);
         console.error('error.event>>',event);
    });
    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    client.on('conversation.updated', async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });
}
const setItems=(iitems: ItemType[])=>{
    //mlog("setItems", iitems.length, iitems  )
    items.value=iitems
}
const setRealtimeEvents=(realtimeEvent: RealtimeEvent )=>{
     //mlog("setRealtimeEvents", realtimeEvent.event ,  realtimeEvent  )
     let ev= {...realtimeEvent.event}
     if(ev.type=="error" && ev.error && ev.error.message){
        ms.error(ev.error.message)
     }
    
      const lastEvent =  realtimeEvents.value[ realtimeEvents.value.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return  realtimeEvents.value.slice(0, -1).concat(lastEvent);
        } else {
          return  realtimeEvents.value.concat(realtimeEvent);
        }
}
const loadConfig=()=>{
    let base=gptServerStore.myData.OPENAI_API_BASE_URL;
    const key=gptServerStore.myData.OPENAI_API_KEY;
    st.value.apikey=key
    if(base){
        base= base.replaceAll('https://','wss://').replaceAll('http://','ws://')
        st.value.baseUrl= base+'/v1/realtime'
    }
    //mlog('baseUrl', st.value.baseUrl, key )
    if( st.value.baseUrl && st.value.apikey){
        go()
    }
}
   
 
onMounted(()=>{ 
    loadConfig();
})
const close=()=>{
    st.value.isClosed=true
    try {
      disconnectConversation();
    } catch (error) {
        
    }

    //edmit('close')
    setTimeout(() => {
        edmit('close')
    }, 1000);
    
   
}
</script>
<template>
<div class="w-full h-full fixed top-0 left-0 bottom-0 right-0 z-[1001]  bg-pan-bottom opacity-98 scale-in-tr text-white/80"
:class="st.isClosed?['scale-out-tr']:[]">
    <div class="w-full h-full relative" style="--vh:80px;--vw:400px">
        <div class="absolute top-0 left-0">
                <canvas ref="clientCanvasRef" class="h-[var(--vh)]  w-[var(--vw)] " style="transform: rotate(90deg); transform-origin: 0 var(--vh); "/>
        </div>
        <div class="absolute top-0 right-0">
                <canvas ref="serverCanvasRef" class="h-[var(--vh)]  w-[var(--vw)] " style="transform: rotate(-90deg); transform-origin: var(--vw) var(--vh);  "/>
        </div> 

        <div class="flex flex-col justify-around items-center w-full h-full">
            <section>
                <aiTextSetting @close="loadConfig"  :msgInfo="$t('mj.rtsetting')" v-if="!st.apikey||!st.baseUrl"/>
                <an_main v-else-if="clientRef?.isConnected"/>
                <div v-else> {{ st.msg }}</div>
            </section>
            <section >
               <div  class="flex justify-center items-center space-x-4">
                    <div class="flex flex-col justify-center items-center cursor-pointer" @click="close()">
                        <div class="bg-orange-600 rounded-full p-2"><SvgIcon icon="tdesign:close" class="text-3xl"></SvgIcon></div>
                        <div class="pt-1">{{ $t('mj.mCanel') }}</div>
                    </div>
                    <div class="flex flex-col justify-center items-center cursor-pointer" @click="disconnectConversation()" v-if="st.isConnect">
                        <div class=" bg-white rounded-full p-2"><SvgIcon icon="ri:wechat-line" class="text-3xl text-orange-500"></SvgIcon></div>
                        <div class="pt-1">{{ $t('mj.mPause') }}</div>
                    </div>
                     <div class="flex flex-col justify-center items-center cursor-pointer" @click="go()" v-else>
                        <div class=" bg-white rounded-full p-2"><SvgIcon icon="ri:wechat-line" class="text-3xl text-orange-500"></SvgIcon></div>
                        <div class="pt-1">{{ $t('mj.mStart') }}</div>
                    </div>
                    
                </div>
                <div class="text-[12px] pt-5 text-center">
                    {{ st.msg }}
                    
                </div>
            </section>
        </div>
    </div>
</div>
</template>

<style lang="css" >

@-webkit-keyframes bg-pan-bottom {
  0% {
    background-position: 50% 0%;
  }
  100% {
    background-position: 50% 100%;
  }
}
@keyframes bg-pan-bottom {
  0% {
    background-position: 50% 0%;
  }
  100% {
    background-position: 50% 100%;
  }
}
 .bg-pan-bottom {
	-webkit-animation: 10s ease 0s 1 normal both running bg-pan-bottom;;
	        animation: 10s ease 0s 1 normal both running bg-pan-bottom;;
    background-image: -webkit-gradient(linear, left bottom, left top, from(#cc6aa5), color-stop(#3e91cc), to(#2dcca7));
    background-image: linear-gradient(15deg, #cc6aa5, #3e91cc, #2dcca7);
    background-size: 100% 600%;
}


  
@keyframes scale-in-tr {
  0% {
    -webkit-transform: scale(0);
            transform: scale(0);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity:0.5;
    border-radius: 0% 0 0 100%;
  }
  80% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
    border-radius: 0% 0 0 100%;
  }
  100% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
    border-radius:0;
  }
}

.scale-in-tr {
    
	-webkit-animation: scale-in-tr 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	        animation: scale-in-tr 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}
 
@keyframes scale-out-tr {
  0% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
  }
  20% {
    -webkit-transform: scale(1);
            transform: scale(1);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
    border-radius: 0% 0 0 100%;
  }
  100% {
    -webkit-transform: scale(0);
            transform: scale(0);
    -webkit-transform-origin: 100% 0%;
            transform-origin: 100% 0%;
    opacity: 1;
     border-radius: 0% 0 0 100%;
  }
}

.scale-out-tr {
	-webkit-animation: scale-out-tr 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	        animation: scale-out-tr 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}
</style>