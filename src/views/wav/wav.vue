<script setup lang="ts">
import { NButton,NInput, useMessage,NEmpty } from 'naive-ui';
//import { WavRecorder, WavStreamPlayer } from '@/lib/wavtools/index.js';
import { WavRecorder, WavStreamPlayer } from '@openai/realtime-wavtools';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import { ref } from 'vue';
import { mlog } from '@/api';

const ms= useMessage();

const wavRecorder= new  WavRecorder({ sampleRate: 24000 })
const wavStreamPlayer= new WavStreamPlayer({ sampleRate: 24000 }) 
 
const st= ref({apikey:'', isConnect:false,baseUrl:'wss://api.openai.com/v1/realtime' })


const realtimeEvents= ref<RealtimeEvent[]>([]);
const items= ref<ItemType[]>([]);

const clientRef= ref<RealtimeClient>();
const go= async()=>{
    if(st.value.isConnect){
        mlog("isConnect yes!"  )
        ms.info("isConnect yes!");
        return;
    }
    if(!clientRef.value || !st.value.isConnect ){
        if(!st.value.apikey){
            mlog("api key null"  )
            ms.error("api key null");
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
    // Connect to realtime API
    try{
        await client.connect(); 
    }catch(e ){
        ms.error("websocket 连接服务器错误！");
        return 
    }
    try{
    // Connect to microphone
        await wavRecorder.begin();
    }catch(e){
        ms.error("不支持录音，可能是设备原因");
        return 
    }

    // Connect to audio output
    await wavStreamPlayer.connect();

    st.value.isConnect=true

    client.sendUserMessageContent([
      {
        type: `input_text`,
        text: `Hello!`,
        // text: `For testing purposes, I want you to list ten car brands. Number each item, e.g. "one (or whatever number you are one): the item name".`
      },
    ]);
    

    client.updateSession({
      turn_detection:  { type: 'server_vad' },
    });
    await wavRecorder.record((data: { mono: Int16Array | ArrayBuffer; }) => {
        try{
            client.appendInputAudio(data.mono)
        }catch(e){
            disconnectConversation();
            ms.error("请检查 api key 是否正确");
            mlog("appendInputAudio error", e )
            return
        }
    });
    myListen();

}

const disconnectConversation= async()=>{
    //clientRef.value?.disconnect();
    st.value.isConnect=false
    const client= clientRef.value;
    //client?.reset();
    client?.disconnect();
    await wavRecorder.end();
    await wavStreamPlayer.interrupt();
    
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
    if( !client){
        return
    }
    // Set transcription, otherwise we don't get user transcriptions back
    client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

    // handle realtime events from client + server for event logging
    client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
        setRealtimeEvents(realtimeEvent);
    });
    client.on('error', (event: any) => console.error('error.event>>',event));
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
    mlog("setItems", iitems.length, iitems  )
    items.value=iitems
}
const setRealtimeEvents=(realtimeEvent: RealtimeEvent )=>{
     //mlog("setRealtimeEvents", realtimeEvent.event ,  realtimeEvent  )
    
      const lastEvent =  realtimeEvents.value[ realtimeEvents.value.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return  realtimeEvents.value.slice(0, -1).concat(lastEvent);
        } else {
          return  realtimeEvents.value.concat(realtimeEvent);
        }
}
</script>

<template>

<div class="p-4">
    <div class=" pb-2"> <NInput v-model:value="st.baseUrl" placeholder="base url"/> </div>
    <div class=" pb-2"> <NInput v-model:value="st.apikey" placeholder="api key"/> </div>
    <NButton type="primary" @click="go" v-if="!st.isConnect">连接</NButton>
    <NButton type="primary" @click="disconnectConversation"  v-else>断开</NButton>
    <NEmpty v-if="items.length<=0" description="没内容"/>
    <div v-else class="flex justify-between items-baseline">
        <section class=" w-full">
            <div class="p-4  " v-for="conversationItem in items" :class="conversationItem.role === 'assistant'?['text-right']:[]">
                <div >{{ conversationItem.role }}</div>
                <div v-if="conversationItem.role === 'user'">
                    {{conversationItem.formatted.transcript ||
                                (conversationItem.formatted.audio?.length
                                    ? '(awaiting transcript)'
                                    : conversationItem.formatted.text ||
                                    '(item sent)')}}
                </div>
                <div v-if="!conversationItem.formatted.tool &&  conversationItem.role === 'assistant'">
                    {{conversationItem.formatted.transcript || conversationItem.formatted.text || '(truncated)'}}
                </div>
                <div class="flex " :class="conversationItem.role === 'assistant'?['justify-end']:[]">
                    <audio v-if="conversationItem.formatted.file"  :src="conversationItem.formatted.file.url"  controls />
                </div>      
            </div>
        </section>
        <!-- <section class=" w-1/2">
            <div class="p-4">
              good
            </div>
        </section> -->
    </div>
</div>

</template>