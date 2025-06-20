import { ss } from "@/utils/storage";

export interface riffAudio {
    audio_url?: string;
    duration_s: number;
    id: string;
    image_url?: string;
    lyrics?: string;
    model_display_name: string;
    sound?: string;
    title?: string;
    topic?: string;
}
export interface riffTask {
    id:string
    status:string
    riff?:riffAudio
    last_feed?: number //最后更新时间
    
}


export class riffStore{
  //private id: string;
  private localKey='riff-store';
  public save(obj:riffTask ){
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

  public getObjs():riffTask[]{
     const obj = ss.get( this.localKey ) as  undefined| riffTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):riffTask|null{
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