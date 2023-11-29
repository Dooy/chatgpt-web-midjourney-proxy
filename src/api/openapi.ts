
import { homeStore } from "@/store";
import { mlog } from "./mjapi";

const getUrl=(url:string)=>{
    if(url.indexOf('http')==0) return url;
    return `/openapi${url}`;
}
export const gptFetch=(url:string,data?:any)=>{
    mlog('gptFetch', url  );
    return new Promise<any>((resolve, reject) => {
        let opt:RequestInit ={method:'GET'}; 
        opt.headers={'Content-Type':'application/json'};
        if(data) {
            opt.body= JSON.stringify(data) ;
             opt.method='POST';
        }
        fetch(getUrl(url),  opt )
        .then(d=>d.json().then(d=> resolve(d))
        .catch(e=>reject(e)))
        .catch(e=>reject(e))
    })
     
}

export const subGPT= async (data:any, chat:Chat.Chat )=>{
   let d:any;
   let action= data.action;
   //chat.myid=  `${Date.now()}`;
   if(  action=='gpt.dall-e-3' ){ //执行变化
        chat.model= 'dall-e-3';

       let d= await gptFetch('/v1/images/generations', data.data);
       try{
            const rz : any= d.data[0];
            chat.text= rz.revised_prompt;
            chat.opt={imageUrl:rz.url } ;
            chat.loading = false;
            homeStore.setMyData({act:'updateChat', actData:chat });
       }catch(e){
            chat.text='失败！'+"\n```json\n"+JSON.stringify(d, null, 2)+"\n```\n";
            chat.loading=false;
            homeStore.setMyData({act:'updateChat', actData:chat });
       }

   }

}