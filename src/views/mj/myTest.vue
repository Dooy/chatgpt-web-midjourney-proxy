<script setup lang="ts">
import { mlog } from '@/api'; 
import { ref } from "vue";
import { NButton,NInput } from "naive-ui";

const f = ref({text:'Hi,google ! I am a good student!'});
const go = async () => {
    
  const apiKey = 'sdsd-121212';

const apiUrl = 'https://api.openai-sk.com/v1/audio/speech';
const ttsModel = 'tts-1';
const voice = 'alloy';
//const inputText = 'I am a good student!';

//const fetchData = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: ttsModel,
        input: f.value.text ,
        voice: voice,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const audioData = await response.arrayBuffer();
    const blob = new Blob([audioData], { type: 'audio/mp3' });
    mlog('blob', blob);

    const player = new window.Audio(); 
    player.src = URL.createObjectURL(blob);
    player.addEventListener('ended', () => {
      mlog('音乐播放完毕');
    });
     player.addEventListener('loadedmetadata', () => {
      mlog('时长', player.duration);
    });
    player.load(); 
    player.play();


     const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'speech.mp3';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }catch (error) {
    console.error('Error:', error);
  }

 
}
//go();

  const ccgo= (event:any )=> {
    var file = event.target.files[0];

    // 通过 FileReader 读取文件内容并创建 Blob 对象
    var reader = new FileReader();
    reader.onload = function(e:any ) {
      var blob = new Blob([e.target.result], { type: 'audio/mp3' });
      mlog('blob', blob);

      // 创建 Howl 实例
    //  let  sound = new Howl({
    //     src: [blob],
    //     format: ['mp3'],
    //     volume: 0.5,
    //     onend: function() {
    //       console.log('音乐播放完毕');
    //     }
    //     ,onloaderror:(e:any )=>{
    //          mlog('onloaderror' ,e  )
    //     }
    //   });
    //   sound.play(); 
    const player = new window.Audio(); 
    player.src = URL.createObjectURL(blob);
    player.addEventListener('ended', () => {
      mlog('音乐播放完毕');
    });
     player.addEventListener('loadedmetadata', () => {
      mlog('时长', player.duration);
    });
    player.load(); 
    player.play();
 
    };

    reader.readAsArrayBuffer(file);
  } 
</script>
<template>
<!-- <div class="text-red-300" >good</div>
<div class="text-red-300" @click="go" >go</div>
<div class="text-red-300" @click="sound.stop() " >eend</div> -->
<div class="p-4 space-y-4">
<NInput v-model:value="f.text" type="textarea"></NInput>
<NButton @click="go" type="primary">提交</NButton>
<div>
<input type="file" id="audioFile" accept="audio/*" @change="ccgo">
</div>
</div>


</template>