import { ss } from "@/utils/storage";

interface Options {
    name: string;
    seconds: number;
    gen2Options?: Gen2Options;
    exploreMode?: boolean;
    assetGroupName?: string;
    recordingEnabled?: boolean;
    text_prompt?:string
}

interface Gen2Options {
    mode: string;
    seed: number;
    interpolate: boolean;
    upscale: boolean;
    watermark: boolean;
    motion_score: number;
    use_motion_score: boolean;
    use_motion_vectors: boolean;
    text_prompt: string;
    image_prompt?: string;
    init_image?: string;
}

interface Artifact {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: number;
    createdBy: number;
    taskId: string;
    parentAssetGroupId: string;
    filename: string;
    url: string;
    fileSize: string;
    isDirectory: boolean;
    previewUrls: string[];
    private: boolean;
    privateInTeam: boolean;
    deleted: boolean;
    reported: boolean;
    metadata: Metadata;
    favorite: boolean;
}

interface Metadata {
    frameRate: number;
    duration: number;
    dimensions: number[];
    size: Size;
}

interface Size {
    width: number;
    height: number;
}

export interface RunwayTask {
    id: string;
    name: string;
    image: any; // Can be changed to a specific type if needed
    createdAt: string;
    updatedAt: string;
    taskType: string;
    options: Options;
    status: string;
    error: any; // Can be changed to a specific type if needed
    progressText: any; // Can be changed to a specific type if needed
    progressRatio: string;
    estimatedTimeToStartSeconds?: number; // Can be changed to a specific type if needed
    artifacts?: Artifact[];
    sharedAsset: any; // Can be changed to a specific type if needed
    last_feed?:number;
}

export class runwayStore{
  //private id: string;
  private localKey='runway-store';
  public save(obj:RunwayTask ){
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

  public getObjs():RunwayTask[]{
     const obj = ss.get( this.localKey ) as  undefined| RunwayTask[];
     if(!obj) return [];
     return obj;
  }
  public getOneById(id:string):RunwayTask|null{
    const i= this.findIndex(id)
    if(i<0) return null;
    let arr=  this.getObjs();
    return arr[i]
  }
}