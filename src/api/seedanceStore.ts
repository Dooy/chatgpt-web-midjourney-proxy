import { ss } from "@/utils/storage";
 

export interface SeedanceTask {
    //cat?: string //类别
    prompt?: string //提示词
    last_feed?: number //最后更新时间
    id:string
    status:string
    error?:string
    url?:string
    duration?:number
    
}

export class seedanceStore{
  //private id: string;
  private localKey='seedance-store';
  public save(obj:SeedanceTask ){
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

  public getObjs():SeedanceTask[]{
     const obj = ss.get( this.localKey ) as  undefined| SeedanceTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):SeedanceTask|null{
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