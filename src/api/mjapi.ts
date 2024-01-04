
 //import { useChat } from '@/views/chat/hooks/useChat'

import { gptConfigStore, gptServerStore, homeStore } from "@/store";
import { copyToClip } from "@/utils/copy";
import { isNumber } from "@/utils/is";
import { localGet, localSaveAny } from "./mjsave";
import { t } from "@/locales";
//import { useMessage } from "naive-ui";
export interface gptsType{
    gid:string
    name:string
    logo:string
    info:string
    use_cnt?:string
}
 //const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat()
export function upImg(file:any   ):Promise<any>
{
    return new Promise((h,r)=>{
        //const file = input.target.files[0];
        const filename = file.name;
        //console.log('selectFile', file )
        if(file.size>(1024*1024)){
            //msgRef.value.showError('图片大小不能超过1M');
            r(t('mjchat.no1m'))
            return ;
        }
        if (! (filename.endsWith('.jpg') ||
            filename.endsWith('.gif') ||
            filename.endsWith('.png') ||
            filename.endsWith('.jpeg') )) {
            //r('图片仅支持jpg,gif,png,jpeg格式');
            r(t('mjchat.imgExt') );
            return ;
        }
        const reader = new FileReader();
        // 当读取操作完成时触发该事件
        //reader.onload = (e:any)=> st.value.fileBase64 = e.target.result;
        reader.onload = (e:any)=>  h( e.target.result);
        reader.readAsDataURL(file);
    })
    
}

export const file2blob= (selectedFile: any  )=>{
    return new Promise<{blob:Blob,filename:string}>((resolve, reject) => {
        const reader = new FileReader();
        mlog('selectedFile', selectedFile )
        reader.onload = function (event:any ) {
            // 将文件内容转换为 Blob
            const blob = new Blob([event.target.result], { type: selectedFile.type });

            // 在这里可以使用生成的 Blob 对象
            //console.log(blob);
            resolve({blob,filename:selectedFile.name });
        };
        reader.onerror = (e)=> reject(e);

        // 开始读取文件
        reader.readAsArrayBuffer(selectedFile);
        
    })
     
}

export const blob2file= ( blob:Blob,fileName:string )=>{
    const file = new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
    return file;
}

export const  isFileMp3= (filename:string )=>{
    let arr='.mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm'.split(/[, ]+/ig);
    mlog('fileIsMp3', arr );
    filename= filename.toLocaleLowerCase();
    for(let ext of arr ){
        if(filename.endsWith(ext)) return true;
    }
    return false;
}

function containsChinese(str:string ) {
  return false; //11.18 都不需要翻译
//   var reg = /[\u4e00-\u9fa5]/g; // 匹配中文的正则表达式
//   return reg.test(str);
}

export  async function train( text:string){

    return new Promise<string>((resolve, reject) => {


        if( text.trim()  =='') {
           reject( t('mjchat.placeInput'));
            return ;
        }

        
        if( !containsChinese(text.trim()) ){
            resolve( text.trim() );
            return ;
        }
        
        // myTranslate( text.trim())
        //     .then((d:any)=>  resolve( d.content.replace(/[?.!]+$/, "")))
        //     .catch(( )=>   reject('翻译发生错误'))
        resolve( text.trim() )
    }) 
}

export const mlog = (msg: string, ...args: unknown[]) => {
    //localStorage.setItem('debug',1 )
    const logStyles = [
    // 'padding: 4px 8px',
    // 'color: #fff',
    // 'border-radius: 3px',
    'color:',
  ].join(';')
    const debug= localStorage.getItem('debug')
    if( !debug  ) return ;
    const style = `${logStyles}${msg.includes('error') ? 'red' : '#dd9089'}`
    console.log(`%c[mjgpt]`,  style, msg , ...args)
}

export const myTrim = (str: string, delimiter: string)=>{
    // 构建正则表达式，使用动态的定界符
    const regex = new RegExp(`^${delimiter}+|${delimiter}+$`, 'g');
    
    // 使用正则表达式去除字符串两端的定界符
    return str.replace(regex, '');
}

function getHeaderApiSecret(){
    if(!gptServerStore.myData.MJ_API_SECRET){
        return {}
    }
    return {
        'mj-api-secret':  gptServerStore.myData.MJ_API_SECRET
    }
}

const getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    if(gptServerStore.myData.MJ_SERVER){
        return `${ gptServerStore.myData.MJ_SERVER}${url}`;
    }
    return `/mjapi${url}`;
}

export const mjFetch=(url:string,data?:any)=>{
    mlog('mjFetch', url  );
    let header = {'Content-Type':'application/json'};
    header= {...header,...getHeaderApiSecret() }

    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET'}; 
        opt.headers=header;
        if(data) {
            opt.body= JSON.stringify(data) ;
             opt.method='POST';
        }
        fetch(getUrl(url),  opt )
        .then(d=>d.json().then(d=> resolve(d))
        .catch(e=>reject(e)))
        .catch(e=>reject(e))
    })
     
}

export const myFetch=(url:string,data?:any)=>{
    mlog('mjFetch', url  );
    let header = {'Content-Type':'application/json'};
    //header= {...header  }

    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET'}; 
        opt.headers=header;
        if(data) {
            opt.body= JSON.stringify(data) ;
             opt.method='POST';
        }
        fetch(getUrl(url),  opt )
        .then(d=>d.json().then(d=> resolve(d))
        .catch(e=>reject(e)))
        .catch(e=>reject(e))
    })
     
}


export const flechTask= ( chat:Chat.Chat)=>{
    let cnt=0;
    const check= async ()=>{
        cnt++;
        if(!chat.mjID){
            chat.text +="\n获取失败" ;
            chat.loading=false;
            homeStore.setMyData({act:'updateTask', actData:chat });
            return ;
        }
        const ts=  await mjFetch(`/mj/task/${chat.mjID}/fetch`);
        chat.opt= ts;
        chat.loading=   (cnt>=99)?false:true; 
        //chat.progress=ts.progress;
    
        if(ts.progress && ts.progress== "100%") chat.loading=false;

        homeStore.setMyData({act:'updateChat', actData:chat });
        //"NOT_START" //["SUBMITTED","IN_PROGRESS"].indexOf(ts.status)>-1
        if( ["FAILURE","SUCCESS"].indexOf(ts.status)==-1 && cnt<100 ){
           
            setTimeout(() =>   check( ) , 5000 )
        } 
        mlog('task', ts.progress,ts );
    }
    check();
}
export const subTask= async (data:any, chat:Chat.Chat )=>{
   let d:any;
   
   //return ;
   if(  data.action &&data.action=='change' ){ //执行变化
     d=  await mjFetch('/mj/submit/change' , data.data  );
   }else if( data.action &&data.action=="CustomZoom") { //自定义变焦
         d =  await mjFetch('/mj/submit/action' , data.data  );
        if(d.result){
            let bdata= data.maskData;
            bdata.taskId= d.result;
            d=  await mjFetch('/mj/submit/modal' , bdata );
        }
   }else if( data.action &&data.action=='mask') { //局部重绘
     d =  await mjFetch('/mj/submit/action' , data.data  );
     if(d.result){
        let bdata= data.maskData;
        bdata.taskId= d.result;
        d=  await mjFetch('/mj/submit/modal' , bdata );
     }
   }else if( data.action &&data.action=='blend') { //blend
      d=  await mjFetch('/mj/submit/blend' ,  data.data );
   }else if( data.action &&data.action=='shorten') { //shorten 
      d=  await mjFetch('/mj/submit/shorten' ,  data.data );
     //  mlog('mjFetch shorten' , data );
   }else if( data.action &&data.action=='face') { //换脸 
      d=  await mjFetch('/mj/insight-face/swap' , data.data  ); 
      //mlog('换年服务', data.data );
      //return; 
   }else if( data.action &&data.action=='img2txt') { //图生文 
        d=  await mjFetch('/mj/submit/describe' , data.data  ); 
   }else if( data.action &&data.action=='changeV2') { //执行动作！
     d=  await mjFetch('/mj/submit/action' , data.data  );
   }else {
    let toData =  {
        "base64Array":data.fileBase64??[],
        "notifyHook": "",
        "prompt": data.drawText,
        "state": "",
        botType:'MID_JOURNEY'
        };
        if(data.bot && data.bot=='NIJI_JOURNEY'){
            toData.botType= data.bot;
        }
        d=  await mjFetch('/mj/submit/imagine' ,toData );
        mlog('submit',d );
        //return ;
   }
   if(d.code==21){
       d=  await mjFetch('/mj/submit/modal' , { taskId:d.result} );
   }
     
   backOpt(d, chat);
   
    
    //if( chat.uuid &&  chat.index) updateChat(chat.uuid,chat.index, chat)
}
const backOpt= (d:any, chat:Chat.Chat )=>{
     if(d.code==1){
        chat.text='提交成功！';
        chat.mjID= d.result;
        flechTask( chat )
        chat.loading=true;
        homeStore.setMyData({act:'updateChat', actData:chat });
        //chat.m= d.result;
    }else{
        chat.text='失败！'+"\n```json\n"+JSON.stringify(d, null, 2)+"\n```\n";
        chat.loading=false;
        homeStore.setMyData({act:'updateChat', actData:chat });
    }
}

export const mjSeed= async ( mjid:string )=>{
     const ts=  await mjFetch(`/mj/task/${mjid}/image-seed`);
     return ts;
}



export const getSeed = async (cchat:Chat.Chat,message:any )=>{
   // const message = useMessage();
  // let cchat = props.chat;
  if(!cchat.mjID ) return ;
  let seed=0 ;
  if(cchat.opt?.seed) seed =cchat.opt?.seed;
  else{
   try{
        message.info('获取中...');
      const res:any  = await mjSeed( cchat.mjID);
      seed= res.result;
      if(seed>0 ) {
       
        if ( cchat.opt ){
          cchat.opt.seed = seed;

           homeStore.setMyData({act:'updateChat', actData:cchat });
        }
        message.success('获取成功');
      }
      
   } catch(e){
      message.error('获取失败')
   }
  }
  mlog('getSeed',seed);
  if(seed>0 ) {
    await copyToClip(`${seed}`);
    message.success('复制seed成功');
  }
  
}

export const getLastVersion=  async ()=>{
    const url='https://api.github.com/repos/Dooy/chatgpt-web-midjourney-proxy/tags?per_page=1';
    const a= await myFetch(url);
    mlog('lastVersion', a ); 
    return a;
    
}

export const canVisionModel= (model:string)=>{
    //['gpt-4-all','gpt-4-v'].indexOf(model)==-1 && model.indexOf('gpt-4-gizmo')==-1
    if( ['gpt-4-all','gpt-4-v','gpt-4v','gpt-3.5-net'].indexOf(model)>-1 ) return true;
    if(model.indexOf('gpt-4-gizmo')>-1 )return true; 
    return false;
}

export const isTTS= ( model:string )=>{
    if(model.indexOf('tts-1')===0 )return true; 
    return false ;
}

function isStringOnlyDigits(input: string): boolean {
    // 使用正则表达式检查字符串是否只包含数字
    const regex = /^[0-9]+$/;
    return regex.test(input);
}
export const loadGallery  = async ()=>{
     let localKey= 'mj-list-condition';
     const d2:any = await localGet(localKey);
     //mlog('d2',d2 , (Date.now()- d2.ctime));
     if(d2 && (Date.now()- d2.ctime)<300*1000 ){

        return d2.d as any[];
     }
     let  d =  await mjFetch(`/mj/gallery`);
     //mlog('tsList', d.data.list   );
     if( !d.data.list  ||  d.data.list.length ==0 ) return [];
     const list =d.data.list as any[];
     const ids = list.filter(v=> isStringOnlyDigits(v.reqid)).map(v=> +v.reqid ) ;
     mlog('ids',  ids   );
     if(ids.length==0) return [];
     ///mj/task/list-by-condition
     d=  await mjFetch('/mj/task/list-by-condition',{ids } );

     if( d.length>0 ) localSaveAny({ctime: Date.now(), d}, localKey);
     return d as any[] ;
}

//从剪贴板中读取文件
export   function getFileFromClipboard(event:any ){
    let rz=[];
    if ( event.clipboardData || event.originalEvent ) {
        let clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
        if (clipboardData.items) {
            let items = clipboardData.items;
            // mlog('getFileFromClipboard',  items  );
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") !== -1 || items[i].kind === 'file') {
                    //rz.push( await fileToBase64(  items[i].getAsFile()) );
                    //mlog('fff', items[i] );
                    rz.push( items[i].getAsFile()) 
                }
            }

        }
    }
    //console.log('passs>>' ,rz );
    return rz;
}
