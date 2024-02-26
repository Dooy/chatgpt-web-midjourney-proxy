import { mlog } from "./mjapi";

export interface recType{
    timeOut:number 
    asrLanguage?:string
    listener?: (result: string) => void
    onEnd?: () => void
    onStart?: () => void
}
export class Recognition {
  private recognition: any;

  private listener?: (result: string) => void;

  private isStop = false;

  //选项
  private recOpt:recType={timeOut:2000} 
  
  //
  private handleTime: any ;

  private hTime:Date | undefined;
  //语言
  private asrLanguage = 'cmn-Hans-CN'
  //
  private onEnd?: () => void;
  private onStart?: () => void;
  public setListener(fn: (result: string) => void) {
    this.listener = fn;
    return this;
  }
  public setOnEnd( fn: ( ) => void){
    this.onEnd = fn;
    return this;
  }
  public setOpt( opt:recType ){
    this.recOpt= opt;

    if(opt.listener)  this.setListener(opt.listener)
    if(opt.onEnd)  this.setListener(opt.onEnd)
    if(opt.asrLanguage)  this.setLang(opt.asrLanguage);
    if(opt.onStart) this.onStart= opt.onStart;

    return this;
  }
  
  public setLang( lang:string ){
    this.asrLanguage = lang;
    return this;
  }

  public start() {
    this.isStop = false;
    // @ts-ignore
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) return;
    if (!this.recognition) {
      // @ts-ignore
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      this.recognition = recognition;
    }
    const recognition = this.recognition;

    // 返回实时识别结果
    recognition.interimResults = true;
    // 设置语言
    const lang = this.asrLanguage;
    recognition.lang = lang;

    // 设置是否连续识别
    recognition.continuous = true;

    this.hTime = new Date();
    this.handleTime = setInterval( ()=>this.check( this ), this.recOpt.timeOut ) 

    // 当识别到语音时触发该事件
    recognition.addEventListener('result', (event: any) => { 

      let transcript = '';
      for (let index = 0; index < event.results.length; index++) {
        const item = event.results[index];
        // 中文添加逗号
        if (transcript && lang?.includes('Han')) transcript += '，';

        transcript += (item as unknown as SpeechRecognitionAlternative[])[0]?.transcript;
      }
      if (!transcript) return; 
      this.hTime = new Date();
      this.listener?.(transcript);
    });

    // 当识别结束时触发该事件
    recognition.addEventListener('end', () => {
      mlog('recognition onEnd',  this.isStop );
      if (this.isStop) {
        this.onEnd?.();
        this.handleTime && clearInterval( this.handleTime )
        return;
      }
      // 继续监听
      recognition.start();
    });

    // 启动语音识别
    recognition.start();
    this.onStart?.();

    return this;
  }

  public stop() {
    this.isStop = true;
    this.recognition?.stop();
    return this;
  }

  private check( that:Recognition ){
     if( !that.hTime ) {
         mlog('mcheck 未定义');
        return ;
     }  
     const nTime =  new Date();
     
     const dt =  nTime.getTime()- that.hTime.getTime();
     mlog('mcheck', dt,that.recOpt.timeOut );
     if( dt> that.recOpt.timeOut ){
        that.stop();
     }
     return this;
  }
}


export const supportLanguages: Record<string, string> = {
  'cmn-Hans-CN': '普通话 (中国大陆)',
  'cmn-Hans-HK': '普通话 (香港)',
  'yue-Hant-HK': '粵語 (香港)',
  'en-US': 'English(United States)',
  'en-GB': 'English(United Kingdom)',
  'en-IN': 'English(India)',
  'es-ES': 'Español',
  'fr-FR': 'Français',
  'de-DE': 'Deutsch',
  'it-IT': 'Italiano',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'ar-SA': 'العربية',
  'pt-BR': 'Português',
  'ru-RU': 'Русский',
  'nl-NL': 'Nederlands',
  'tr-TR': 'Türkçe',
  'sv-SE': 'Svenska',
  'hi-IN': 'हिन्दी',
  'el-GR': 'Ελληνικά',
  'he-IL': 'עברית',
  'id-ID': 'Bahasa Indonesia',
  'pl-PL': 'Polski',
  'th-TH': 'ไทย',
  'cs-CZ': 'Čeština',
  'hu-HU': 'Magyar',
  'da-DK': 'Dansk',
  'fi-FI': 'Suomi',
  'no-NO': 'Norsk',
  'sk-SK': 'Slovenčina',
  'uk-UA': 'Українська',
  'vi-VN': 'Tiếng Việt',
};

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

//浏览器文字播放
export async function speakText(content: string, callback: (playing: boolean) => void) {
  if (!window.speechSynthesis) return;
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    callback(false);
  }

  await sleep(300);

  const msg = new SpeechSynthesisUtterance(content);
  msg.lang = 'zh';
  msg.rate = 1;
  msg.addEventListener('end', () => {
    callback(false);
  });
  msg.addEventListener('error', () => {
    callback(false);
  });
  callback(true);
  speechSynthesis.speak(msg);
}