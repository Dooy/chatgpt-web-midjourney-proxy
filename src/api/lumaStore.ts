import { ss } from '@/utils/storage'
 
 type LumaVideo = {
    url: string;
    width: number;
    height: number;
    thumbnail: string | null;
    download_url?: string;
};

 
export type LumaMedia = {
    id: string;
    prompt: string;
    state: string;
    created_at?: string;
    video?: LumaVideo;
    liked?: boolean | null;
    estimate_wait_seconds?: number | null;
    last_feed?:number
};
export class lumaStore{
  //private id: string;
  private localKey='luma-store';
  public save(obj:LumaMedia ){
    if(!obj.id ) throw "id must";
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

  public getObjs():LumaMedia[]{
     const obj = ss.get( this.localKey ) as  undefined| LumaMedia[];
     if(!obj) return [];
     return obj;
  }
}