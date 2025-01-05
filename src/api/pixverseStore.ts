import { ss } from "@/utils/storage";

export interface pixverseRep{
        video_status: number;
        created_at: string;
        first_frame: string;
        prompt: string;
        model: string;
        negative_prompt: string;
        quality: string;
        motion_mode: string;
        video_duration: number;
        last_frame: string;
        extended?: number;
        url: string;
}
export interface pixverseTask {
    video_id: number;
    last_feed?: number //最后更新时间
    data?:pixverseRep
}




export class pixverseStore{
  //private id: string;
  private localKey='pixverse-store';
  public save(obj:pixverseTask ){
    if(!obj.video_id) throw "video_id must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.video_id==obj.video_id);
    if(i>-1) arr[i]= obj;
    else arr.push(obj);
     ss.set(this.localKey, arr );
    return this;
  } 
  public findIndex(id:number){ 
    return this.getObjs().findIndex( v=>v.video_id == id )
  }

  public getObjs():pixverseTask[]{
     const obj = ss.get( this.localKey ) as  undefined| pixverseTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:number):pixverseTask|null{
    const i= this.findIndex(id)
    if(i<0) return null;
    let arr=  this.getObjs();
    return arr[i]
  }
  public delete( id:number ){
    //if(!obj.data.task_id ) throw "id must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.video_id==id );
    if(i<0) return false
    arr.splice(i, 1);
    ss.set(this.localKey, arr );
    return true;
  }
}