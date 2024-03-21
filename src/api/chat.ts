//import { reactive } from 'vue'

import { gptConfigStore, gptConfigType } from "@/store";
import { ss } from '@/utils/storage'
import { mlog } from "./mjapi";

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
     const index = this.findIndex();
     if( index<=-1) return gptConfigStore.myData;
     const arr = this.getObjs();
     const rz=  arr[index];
     //gptConfigStore.setMyData( rz );
     gptConfigStore.myData.model= rz.model;
     return rz;
  }
  public getObjs():gptConfigType[]{
     const obj = ss.get( this.localKey ) as  undefined| gptConfigType[];
     if(!obj) return [];
     return obj;
  }
  public findIndex(){ 
    return  this.getObjs().findIndex(v=>v.uuid && v.uuid==this.uuid  )
  }
  public save( obj : Partial<gptConfigType>){
    mlog("chatsave","gogo")
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