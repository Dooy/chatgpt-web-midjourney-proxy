import { ss } from '@/utils/storage'
 
export type SunoMedia = {
    id: string;
    video_url: string;
    audio_url: string;
    image_url: string;
    image_large_url: string;
    is_video_pending: boolean;
    major_model_version: string;
    model_name: string;
    metadata: {
        tags?: string;
        prompt: string;
        gpt_description_prompt?: string ;
        audio_prompt_id?: string ;
        history?: string ;
        concat_history?: string ;
        type: string;
        duration: number;
        refund_credits: boolean;
        stream: boolean;
        error_type?: string ;
        error_message?: string ;
    };
    is_liked: boolean;
    user_id: string;
    display_name: string;
    handle: string;
    is_handle_updated: boolean;
    is_trashed: boolean;
    reaction?: any; // You might want to define a proper type for this
    created_at: string;
    status: string;
    title: string;
    play_count: number;
    upvote_count: number;
    is_public: boolean;
};
export class sunoStore{
  //private id: string;
  private localKey='suno-store';
  public save(obj:SunoMedia ){
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

  public getObjs():SunoMedia[]{
     const obj = ss.get( this.localKey ) as  undefined| SunoMedia[];
     if(!obj) return [];
     return obj;
  }
}