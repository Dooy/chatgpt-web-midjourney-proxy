import { gptFetch, gptUploadFile, mlog } from "@/api"
import { DtoItem, DtoStore } from "@/api/dtoStore"
import { sleep } from "@/api/suno"
import { homeStore } from "@/store"

export interface DtoTpl{
    model:string
    key?:string
    field:DtoField[]
    plat:string
}
export interface DtoField{
    key:string
    type:string 
    value?:any           
    max?:number           
    placeholder?:string           
    options?:  {labal:string,value:string}[]           
}

const csuno= new DtoStore()

export const PostVideo= async(nowModel:DtoTpl, data:any)=>{
    mlog('PostVideo',nowModel);
    mlog('data ',data);
    let rz:DtoItem
     
    const plat= nowModel.plat
    if( plat=="google-veo" ||  plat=="sora" ){
        rz= await googleVeo(nowModel,data)
    }else if(plat=='openai'){
        rz= await openaiVideo(nowModel,data)
    }else if(plat=='fal-ai'){
        rz= await falAI(nowModel,data)
    }else{
        mlog("plat",plat, "这个平台没有指定")
        return 
    }
    rz.model= nowModel.model
    csuno.save( rz)
    homeStore.setMyData({act:'dtoFeed'});
    DtoFeed(rz)
}

export const DtoFeed= async (item:DtoItem)=>{
   // mlog("sdsds",item )
    // if(item.plat=="google-veo"){
    //     googleVeoFeed(item.id)
    // }else if(item.plat=="fal-ai"){
    //     falAiFeed(item.id)
    // }
   if(item.plat=="fal-ai"){
        falAiFeed(item.id)
    }else if(item.plat=="openai" ){
     openaiVideoFeed(item.id)
    }else{
      googleVeoFeed(item.id)
    }
}

const falAI= async(nowModel:DtoTpl, data:any)=>{
 const d:any = await gptFetch( '/'+nowModel.model ,data)
 const id= d.request_id
 let  rz:DtoItem={
       mid: id,
       id,
       type: "video",
       plat: nowModel.plat,
       status: "submitted",
       last_feed:  Math.floor(Date.now() / 1000),
       title:data.prompt??'no prompt'
   }
   return rz
}

const openaiVideo= async(nowModel:DtoTpl, data:any)=>{
    data['model']= nowModel.key?? nowModel.model 
    //var d:any
    //d = await gptFetch('/v1/videos',data)
    const formData = new FormData( ); 
     for(let o in data ){
        if(o=='input_reference'&&   data[o]?.file ){
            // for(let f of data.data.base64Array){
            //      formData.append('image[]', f.file )
            // }
            formData.append('input_reference',  data[o]?.file )
        }else{
            formData.append(o, data[o])
        }
       

     }
    //mlog("formData  ",  formData   )
    
    //const jda=    upd.data
    //try {
        const ds = await gptUploadFile('/v1/videos', formData)
        const d=ds.data;
        if(ds.status!=200) throw "Fail with status:"+ ds.status
        mlog("rz  ",  d   )
    // }catch(e){
    //     mlog("error  ",  e   )
    // }
    let  rz:DtoItem={
       mid: d.id,
       id: d.id,
       type: "video",
       plat: nowModel.plat,
       status: "submitted",
       last_feed:  Math.floor(Date.now() / 1000),
       title:data.prompt??'no prompt'
   }
   return rz
}

const googleVeo= async(nowModel:DtoTpl, data:any)=>{
   data['model']= nowModel.model 
   const plat= nowModel.plat
   var d:any
   if (plat=="google-veo"){
     d = await gptFetch('/veo/v1/video/create',data)
   }else{
    d = await gptFetch('/'+plat+'/v1/video/create',data)
   }
   // mlog('返回数据 ',d );
   let  rz:DtoItem={
       mid: d.id,
       id: d.id,
       type: "video",
       plat: nowModel.plat,
       status: "submitted",
       last_feed:  Math.floor(Date.now() / 1000),
       title:data.prompt??'no prompt'
   }
   return rz
}

export const falAiFeed= async( id:string)=>{
    for(let i=0;i<60;i++){
        let  rz= csuno.getOneById(id)
        if(!rz){
            return 
        }
        if(rz?.status=='completed'||  rz?.status=='failed'){    
            return 
        }
        if(!rz.model){
            rz.model='fal-ai/ltxv-13b-098-distilled/image-to-video'
        }
        const arr= rz.model.split('/')
        const url= '/'+arr[0]+'/'+arr[1]+'/requests/'+ rz.mid; //requests/b551cfac-0399-4122-a3fa-91e8760f5086
        try {
            const d:any = await gptFetch(url)
            rz.url= d.video?.url??''
            rz.data=d
            rz.status= rz.url?'completed':'pending'
        } catch (error) {
            rz.status= 'pending'
        }
        

        rz.last_feed=Math.floor(Date.now() / 1000)
        console.log('ddd',d, rz );
        csuno.save(rz)
        homeStore.setMyData({act:'dtoFeed'});
        await sleep(3000)
   }

}
     
export const openaiVideoFeed=async( id:string)=>{
for(let i=0;i<60;i++){
        let  rz= csuno.getOneById(id)
        if(!rz){
            return 
        }
        if(rz?.status=='completed'||  rz?.status=='failed'){    
            return 
        }
         
        const url= '/v1/videos/'+ rz.mid; 
        try {
            const d:any = await gptFetch(url)
            if(d.status=='failed'){
                 rz.status='failed'
                 rz.data=d
            }else{
                var obj:string=d.url??(d.video_url??'')
                rz.url= obj.startsWith('http')?obj:''
                rz.data=d
                rz.status= rz.url?'completed': d.status
                if(d.progress && d.progress>0){
                     rz.status=d.progress+ '%'
                }
            }
        } catch (error) {
            rz.status= 'pending'
        }
        

        rz.last_feed=Math.floor(Date.now() / 1000)
        console.log('ddd',  rz );
        csuno.save(rz)
        homeStore.setMyData({act:'dtoFeed'});
        await sleep(5000)
   }
}
export const googleVeoFeed= async( id:string)=>{
    for(let i=0;i<60;i++){
        let  rz= csuno.getOneById(id)
        if(rz?.status=='completed'||  rz?.status=='failed'){    
            break 
        }
        var d:any
        if (rz && rz.plat!='google-veo' && rz.plat!=''){
             d = await gptFetch(`/${rz.plat}/v1/video/feed/${id}`)
        }else{
            d = await gptFetch(`/veo/v1/video/feed/${id}`)
        }
        if(!rz){
            rz={
                mid: d.id,
                id: d.id,
                type: "video",
                plat: 'google-veo',
                status: "submitted",
                last_feed:  0,
                title:'no prompt'

            }
        }
      
        rz.last_feed=Math.floor(Date.now() / 1000)
        rz.status= d.status?? rz.status
        rz.url= d.video_url??''
        rz.data=d
        csuno.save(rz)
        homeStore.setMyData({act:'dtoFeed'});
        await sleep(3000)

     }
    
}


export const breakpoints= {
  2000: { //当屏幕宽度小于等于1200
    rowPerView: 6,
  },
  1600: { //当屏幕宽度小于等于1200
    rowPerView: 5,
  },
  1200: { //当屏幕宽度小于等于1200
    rowPerView: 4,
  },
  800: { //当屏幕宽度小于等于800
    rowPerView: 3,
  },
  500: { //当屏幕宽度小于等于500
    rowPerView: 2,
  }
}