import { ss } from "@/utils/storage";

export interface RunwayMlTask {
    id: string;
    status: string;
    createdAt: string;
    output?: string[];
    last_feed?:number; 
    failure?: string
    failureCode?: string
    model:string
    promptText:string
}



export class RunwayMlStore{
  //private id: string;
  private localKey='runwayml-store';
  public save(obj:RunwayMlTask ){
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

  public getObjs():RunwayMlTask[]{
     const obj = ss.get( this.localKey ) as  undefined| RunwayMlTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):RunwayMlTask|null{
    const i= this.findIndex(id)
    if(i<0) return null;
    let arr=  this.getObjs();
    return arr[i]
  }
  public delete( obj:RunwayMlTask ){
    if(!obj.id ) throw "id must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.id==obj.id );
    if(i<0) return false
    arr.splice(i, 1);
    ss.set(this.localKey, arr );
    return true;
  }
}