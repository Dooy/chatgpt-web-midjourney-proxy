<script setup lang="ts">
import { mlog } from '@/api';
import { SunoMedia } from '@/api/sunoStore';
import { homeStore } from '@/store';
import { watch,ref  } from 'vue';

const st= ref({isLoad:0, url:''});
const pObj= ref<SunoMedia>()
const player = new window.Audio(); 
const loadPay=()=>{
    if(  !pObj.value ) return 
    mlog('pObj', pObj.value.audio_url )
    player.src = pObj.value.audio_url;
    player.addEventListener('ended', () => {
        st.value.isLoad=0;
        homeStore.setMyData({act:'playEned',actData:{a:'ended'}})
        mlog('ended')
    });
    player.addEventListener('play', () => {
        mlog('play')
        st.value.isLoad=1;
        homeStore.setMyData({act:'playStatus',actData:{a:'play',d:{ currentTime: player.currentTime, duration: player.duration }}})
    }) 
    player.addEventListener('pause', function() {
         st.value.isLoad=2;
          mlog('pause')
         homeStore.setMyData({act:'playStatus',actData:{a:'pause'}})
    });
    player.addEventListener('timeupdate', function(e) {
        // 音频播放位置变化时的操作
        //mlog('timeupdate'  ,player.currentTime ,player.duration );
        let a= 'timeupdate';
        if(player.currentTime==player.duration){
            st.value.isLoad=2;
            a='pause'
        }
        homeStore.setMyData({act2:'playStatus' ,actData:{a ,d:{ currentTime: player.currentTime, duration: player.duration }}})
    });
    player.load();
    player.play();
    
}

const goPlay=()=>{
    if(player.src!=pObj.value?.audio_url){
        if(st.value.isLoad==1 ) player.pause();
        loadPay()
    }else{
        mlog('goPlay',  st.value.isLoad );
         if(st.value.isLoad==1 ) player.pause();
         else player.play();
    }
}
watch(()=>homeStore.myData.act, (n)=>{
    if(n=='goPlay'){
        let data = homeStore.myData.actData
        mlog('goPlay' , data );
        pObj.value = data as SunoMedia
        goPlay();

    }
    if(n=='playUpdate'){
         let data:any  = homeStore.myData.actData
         mlog('playUpdate' , data );
         if( data ) player.currentTime = data.v as number
         //player.set
    }
})
</script>
<template>
</template>