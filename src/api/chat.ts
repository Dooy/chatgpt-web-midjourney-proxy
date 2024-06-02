//import { reactive } from 'vue'

import { gptConfigStore, gptConfigType } from "@/store";
import { ss } from '@/utils/storage'
import { mlog } from "./mjapi";
import { debounce } from "@/utils/functions/debounce";

let time_limit= 0

export class chatSetting{
  private uuid: number;
  private localKey='chat-setting';
  
  //private gptConfig: gptConfigType
    // 构造函数
  constructor(uuid: number) {
    this.uuid = uuid;
    //this.gptConfig = gptConfigStore.myData;
    //this.init();
  }
 
  public setUuid(uuid: number){
    this.uuid = uuid;
    return this
  }
  public getGptConfig():gptConfigType {
     const now=  Math.floor(Date.now() / 1)
     mlog("toMyuid9","getGptConfig", this.uuid , now)
     time_limit=now ;
     const index = this.findIndex();
     if( index<=-1) return gptConfigStore.myData;
     const arr = this.getObjs();
     const rz=  arr[index];
     //gptConfigStore.setMyData( rz );
     gptConfigStore.myData.model= rz.model;
     return rz;
  }
  public getObjsDebounce=debounce(  this.getObjs ,600);
  //卡死 可疑点
  public getObjs():gptConfigType[]{
     mlog("toMyuid8","getObjs")
     const obj = ss.get( this.localKey ) as  undefined| gptConfigType[];
     if(!obj) return [];
     return obj;
  }
  public findIndex(){ 
    mlog("toMyuid8","findIndex")
    return  this.getObjs().findIndex(v=>v.uuid && v.uuid==this.uuid  )
  }
  public save( obj : Partial<gptConfigType>){
    mlog("toMyuid8","save")
    let  sobj ={ ...gptConfigStore.myData , ...obj };
    sobj.uuid= this.uuid;
    const index = this.findIndex();
    let arr = this.getObjs();
    if( index>-1  )arr[index]= sobj;
    else arr.push( sobj ); 
    ss.set(this.localKey, arr );
    return this ;
  }

   
}