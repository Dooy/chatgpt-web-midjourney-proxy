import { gptServerStore, homeStore } from "@/store";
import localforage from "localforage"
import { mlog } from "./mjapi";

localforage.config({
    driver      : localforage.INDEXEDDB, // Force WebSQL; same as using setDriver()
    name        : 'mj',
    version     : 1.0,
    size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
    storeName   : 'mjkv', // Should be alphanumeric, with underscores.
    description : 'some description'
});

export async function saveImg( key:string, value:string ){
   await localforage.setItem( key, value )
}
export async function getImg( key:string ): Promise<any>
{
   return await localforage.getItem( key )
}

//本地存储使用了 
export const localSave= async (  key:string, value:any)=>{
    await localforage.setItem( key, value )
}
//本地存储获取
export const localGet= async( key:string )=>{
    return await localforage.getItem( key )
}

export const localSaveAny = async( value:any,key?:string )=>{ 
    if(!key) key=`MJ:r:${Date.now()}:${Math.floor(Math.random() * 100)}`  ;
    await localSave(key,value);
    return key;
}


export function img2base64(img:any) {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');
    if( ! ctx) return "";
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
}

export function url2base64More(url:string,key?:string){
    return new Promise<{key:string,base64:string}>((resolve, reject) => {

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload=()=>{ 
            const base64 = img2base64(img) ; 
            localSaveAny(base64,key).then(d=>resolve({key:d, base64})).catch(e=>reject(e));
        }
        img.onerror=(e)=>reject(e);
        img.src =  url;
    });
    
}

export const url2base64= async (url:string,key?:string)=>{
    try{
        return await url2base64More (url,key);
    }catch(e){
        return await url2base64More( wsrvUrl(url) ,key);
    }
}

export const wsrvUrl=(url:string)=>{
    const arr = url.split(/([a-z\-]+)ttachments/ig, 3 );
    if( arr.length==3){
        url= `https://cdn.discordapp.com/${arr[1]}ttachments`+ arr[2];
    }
    return `https://wsrv.nl/?url=`+ encodeURIComponent(url);
}

export const mjImgUrl= (url:string)=>{
    if (gptServerStore.myData.MJ_CDN_WSRV || homeStore.myData.session.isWsrv ) return wsrvUrl(url);
    return url;
}

export const getMjAll= async ( ChatState:Chat.ChatState)=>{
    let rz:Chat.Chat[]=[]
    ChatState.chat.forEach(v=>{
       // mlog('uid>>', v.uuid );
        v.data.forEach(chat=>{
            if( chat.mjID ){
               // mlog('MJID>> ',chat.mjID);
                rz.push(chat );
            }
        })
    });
    return rz ;

}