import { ss } from "@/utils/storage";

export interface ViggleTask {
    taskID: string;
    name: string;
    status: number;
    videoDuration: number;
    bgMode: number;
    modelInfoID: number;
    optimize: boolean;
    watermark: number;
    freeCredits: number;
    planCredits: number;
    purchasedCredits: number;
    mqType: number;
    result: string;
    resultCover: string;
    createdAt: string;
    last_feed:number;
}

export class viggleStore{
  //private id: string;
  private localKey='viggle-store';
  public save(obj:ViggleTask ){
    if(!obj.taskID ) throw "taskID must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.taskID==obj.taskID );
    if(i>-1) arr[i]= obj;
    else arr.push(obj);
     ss.set(this.localKey, arr );
    return this;
  } 
  public findIndex(id:string){ 
    return this.getObjs().findIndex( v=>v.taskID== id )
  }

  public getObjs():ViggleTask[]{
     const obj = ss.get( this.localKey ) as  undefined| ViggleTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):ViggleTask|null{
    const i= this.findIndex(id)
    if(i<0) return null;
    let arr=  this.getObjs();
    return arr[i]
  }

   public delete( obj:ViggleTask ){
    if(!obj.taskID ) throw "id must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.taskID==obj.taskID );
    if(i<0) return false
    arr.splice(i, 1);
    ss.set(this.localKey, arr );
    return true;
  }

}