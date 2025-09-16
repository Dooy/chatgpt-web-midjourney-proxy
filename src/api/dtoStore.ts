import { ss } from "@/utils/storage";

export interface DtoItem{
    url?:string
    status:string
    last_feed:number //最后更新时间
    mid:string
    id:string //这个是唯一ID
    type:string //image video images
    data?:any //这个是返回全部数据
    plat:string
    title:string,
    model?:string
}



export class DtoStore{ 
  private localKey='dto-store';
  public save(obj:DtoItem ){
    if(!obj.id) throw "id must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.id==obj.id);
    if(i>-1) arr[i]= obj;
    else arr.push(obj);
     ss.set(this.localKey, arr );
    return this;
  } 
  public findIndex(id:string){ 
    return this.getObjs().findIndex( v=>v.id == id )
  }

  public getObjs():DtoItem[]{
     const obj = ss.get( this.localKey ) as  undefined| DtoItem[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):DtoItem|null{
    const i= this.findIndex(id)
    if(i<0) return null;
    let arr=  this.getObjs();
    return arr[i]
  }
  public delete( id:string ){
    //if(!obj.data.task_id ) throw "id must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.id==id );
    if(i<0) return false
    arr.splice(i, 1);
    ss.set(this.localKey, arr );
    return true;
  }
}