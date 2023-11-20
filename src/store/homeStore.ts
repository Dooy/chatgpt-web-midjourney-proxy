import { reactive } from 'vue'
export const homeStore = reactive({
    myData:{
        act:'',//动作
        actData:{} //动作类别 
        ,local:'' //当前所处的版本
    }
    
    ,setMyData( v:object){
        this.myData={...this.myData,...v}; 
        if( Object.keys(v).indexOf('act')>-1){ 
            setTimeout(()=> {
                this.myData.act=''
                this.myData.actData=''
            }, 2000 );
        }
    }
 
})