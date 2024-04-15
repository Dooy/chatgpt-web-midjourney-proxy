import { homeStore } from "@/store"

export const checkDisableGpt4=( model:string )=>{
    if(!homeStore.myData.session.disableGpt4 || homeStore.myData.session.disableGpt4!='1') return false;
    const rz =  model.indexOf('gpt-4')>-1 ;
    if(rz){
        homeStore.setMyData({isLoader:false,act:'stopLoading'}); 
    }
    return rz ;

}

export const isApikeyError=( text:string )=>{
    text= text.toLocaleLowerCase();
    if(
    text.indexOf('error') && ( 
    text.indexOf('无效的令牌')>-1  //one-api 错误
    || text.indexOf('incorrect api key')>-1  //原生
    || text.indexOf('key error')>-1 
    )) return true ;
    return false;
}
export const isAuthSessionError = ( text:string )=>{
    text= text.toLocaleLowerCase();
    if(text.indexOf('token_check')>-1  ) return true ;
    return false; 
}