import { ss } from "@/utils/storage";
interface Video {
  id: string;
  status: string;
  seed: number;
  resultUrl: string;
  sharingUrl: string;
  videoPoster: string;
  imageThumb: string;
  duration: number;
  error: string;
  progress: number;
}

// 定义主结构体接口
export interface PikaTask {
  id: string;
  promptText: string;
  videos: Video[];
  last_feed?:number;
}

export class pikaStore{
  //private id: string;
  private localKey='pika-store';
  public save(obj:PikaTask ){
    if(!obj.id ) throw "taskID must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.id==obj.id );
    if(i>-1) arr[i]= obj;
    else arr.push(obj);
     ss.set(this.localKey, arr );
    return this;
  } 
  public findIndex(id:string){ 
    return this.getObjs().findIndex( v=>v.id== id )
  }

  public getObjs():PikaTask[]{
     const obj = ss.get( this.localKey ) as  undefined| PikaTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):PikaTask|null{
    const i= this.findIndex(id)
    if(i<0) return null;
    let arr=  this.getObjs();
    return arr[i]
  }
  public delete( obj:PikaTask ){
    if(!obj.id ) throw "id must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.id==obj.id );
    if(i<0) return false
    arr.splice(i, 1);
    ss.set(this.localKey, arr );
    return true;
  }
}