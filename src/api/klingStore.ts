import { ss } from "@/utils/storage";
 

export interface KlingTask {
    cat?: string //类别
    prompt?: string //提示词
    last_feed?: number //最后更新时间
    code: number;
    message: string;
    request_id: string;
    data: {
        task_id: string;
        task_status: string;
        task_status_msg: string;
        created_at: number;
        updated_at: number;
        task_result?: {
        images: Array<{
            index: number;
            url: string;
        }> | null;
        videos: Array<{
            id: string;
            url: string;
            duration: string;
        }> | null;
        };
    };
}

export class klingStore{
  //private id: string;
  private localKey='kling-store';
  public save(obj:KlingTask ){
    if(!obj.data.task_id ) throw "taskID must";
    let arr=  this.getObjs();
    let i= arr.findIndex( v=>v.data.task_id==obj.data.task_id );
    if(i>-1) arr[i]= obj;
    else arr.push(obj);
     ss.set(this.localKey, arr );
    return this;
  } 
  public findIndex(id:string){ 
    return this.getObjs().findIndex( v=>v.data.task_id == id )
  }

  public getObjs():KlingTask[]{
     const obj = ss.get( this.localKey ) as  undefined| KlingTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):KlingTask|null{
    const i= this.findIndex(id)
    if(i<0) return null;
    let arr=  this.getObjs();
    return arr[i]
  }
}