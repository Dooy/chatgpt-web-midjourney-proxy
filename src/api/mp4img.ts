import { FFmpeg } from '@ffmpeg/ffmpeg'
import type { LogEvent } from '@ffmpeg/ffmpeg/dist/esm/types'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { mlog } from './mjapi'
const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm'

 export async function myTestTranscode( vidoUrl:string) {
      mlog('vidoUrl>> ', vidoUrl )
     const ffmpeg = new FFmpeg()
     //await ffmpeg.load();
      
      //message.value = 'Loading ffmpeg-core.js'
      ffmpeg.on('log', ({ message: msg }: LogEvent) => {
        //message.value = msg
        mlog('FFmpeg', msg)
      })
      mlog('FFmpegs url23 ' )
      try{
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
      })
      }catch(e){
         mlog('FFmpegs url3 er ', e  )
      }
       
        //await ffmpeg.load();
        mlog('FFmpegs url3 ' )
      //message.value = 'Start transcoding'
      await ffmpeg.writeFile('input.mp4', await fetchFile(vidoUrl))
      //await ffmpeg.exec(['-i', 'test.avi', 'test.mp4'])
      await ffmpeg.exec(['-sseof', '-3', '-i', 'input.mp4', '-update', '1', '-q:v', '1', 'last_frame.jpg'])
      //message.value = 'Complete transcoding'
      const data = await ffmpeg.readFile( 'last_frame.jpg')
      //const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/jpeg' }));
      const url = URL.createObjectURL(new Blob([(data as Uint8Array).buffer],  { type: 'image/jpeg' } ))
      mlog('FFmpeg url ', url )
      // 创建一个临时的<a>元素
        const a = document.createElement('a');
        a.href = url;
        a.download ='last_frame.jpg'; // 设置下载文件的名称

        // 将 <a> 元素添加到 DOM，然后触发点击事件以启动下载
        document.body.appendChild(a);
        a.click();

        // 触发下载后，从 DOM 中移除 <a> 元素，并释放 URL 对象
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      
    }