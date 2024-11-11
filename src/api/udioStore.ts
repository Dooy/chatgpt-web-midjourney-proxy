import { ss } from "@/utils/storage";
import { mlog } from "./mjapi";


export interface udioTask {
    // id: string;
    // generationId: string;
    // tags?: string[];
    // title: string;
    // artist: string;
    // lyrics?: string;
    // //prompt: string;
    // //disliked: boolean;
    // duration: number;
    // finished: boolean;
    // songPath: string;
    // //userTags: string[];
    // createdAt: string;
    // // errorCode: string | null;
    // // errorType: string | null;
    // imagePath: string;
    // //videoPath: string | null;
    // // attribution: string;
    // // description: string;
    // //publishable: boolean;
    // errorDetail?: string;
    // artistImage: string;

    id: string;
    tags?: string[];
    title: string;
    //artist: string;
    lyrics: string;
    prompt: string;
    //disliked: boolean;
    duration: number;
    finished: boolean;
    song_path: string;
    //user_tags: string[];
    created_at: string; // ISO 8601 format
    // error_code: string | null;
    // error_type: string | null;
    image_path: string;
   // video_path?: string ;
    attribution: string;
    description: string;
    publishable: boolean;
    artist_image: string;
    error_detail?: string  ;
    generation_id: string;
    audio_conditioning_type?:string

    last_feed?: number //最后更新时间
    status?:string
    taskId?:string
    failReason?:string
}

export class udioStore{
  //private id: string;
  private localKey='udio-store';
  public save(obj:udioTask ){
    if(!obj.id ) throw "taskID must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.id==obj.id );
    if(i>-1) arr[i]= obj;
    else arr.push(obj);
     ss.set(this.localKey, arr );
    return this;
  } 
  public findIndex(id:string){ 
    return this.getObjs().findIndex( v=>v.id == id )
  }

  public getObjs():udioTask[]{
     const obj = ss.get( this.localKey ) as  undefined| udioTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):udioTask|null{
    const i= this.findIndex(id)
    if(i<0) return null;
    let arr=  this.getObjs();
    return arr[i]
  }
  public delete( id:string ){ 
    let arr=  this.getObjs();
    
    let i= arr.findIndex( v=>v.id==id );
    //mlog('ddd',i , arr)
    if(i<0) return false
    arr.splice(i, 1);
    ss.set(this.localKey, arr );
    return true;
  }
}