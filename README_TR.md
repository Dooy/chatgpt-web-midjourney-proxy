# ChatGPT Web Midjourney Proxy
💡**Beyan**
- Bu proje sadece GitHub'da yayımlanmaktadır, MIT lisansı altında ücretsiz ve açık kaynak öğrenimi amacıyla kullanılmaktadır. Hiçbir şekilde hesap satışı, ücretli hizmet, tartışma grubu veya tartışma odası gibi faaliyetler bulunmamaktadır. Dolandırıcılıklara karşı dikkatli olun.
- Bu açık kaynak proje, [ChenZhaoYu](https://github.com/Chanzhaoyu/chatgpt-web) temel alınarak geliştirilmiştir; [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) tarafından sağlanan midjourney api ve [Suno-API](https://github.com/SunoAI-API/Suno-API) arka uç olarak kullanılmıştır;

![cover](./docs/mj2a1.jpg)
## Desteklenen Özellikler
- [x] suno tek başına modül desteği, şarkı sözleri ve müzik tarzı ayarlama
- [x] Orijinal chatgpt web tüm özellikleri
- [x] chatgpt web özel api key, base_url desteği
- [x] midjourney metinden görüntü oluşturma
- [x] midjourney görüntü üzerine metin ekleme
- [X] midjourney görüntü değişiklikleri U1'den U4'e, V1'den V4'e ve yeniden çizim gibi işlemler
- [X] midjourney yerel yeniden çizim desteği
- [X] midjourney 1.5x ve 2x yakınlaştırma desteği
- [X] midjourney 2x ve 4x yüksek çözünürlük desteği
- [X] midjourney sola, sağa, yukarıya, aşağıya uzantı değişiklikleri
- [X] midjourney aynı anda [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) ve [midjourney-proxy-plus](https://github.com/litter-coder/midjourney-proxy-plus) arayüzlerini destekler
- [X] midjourney görüntüden metin oluşturma
- [X] Görüntülerin yerel depolama için localforage kullanımı
- [X] midjourney ve niji farklı botları destekler
- [X] [InsightFace yüz değiştirme](https://discord.com/api/oauth2/authorize?client_id=1090660574196674713&permissions=274877945856&scope=bot) desteği
- [X] midjourney görüntü karıştırma
- [X] midjourney seed alma
- [X] dall-e-3 çizim
- [X] chatgpt ön uç model seçimi
- [X] chatgpt ön uç özel model, sohbet sayısı, yanıt sayısı desteği
- [X] chatgpt görüntü yükleme ve gpt-4-vision-preview kullanımı
- [X] chatgpt dosya yükleme desteği (gpt-4-all, gpt-4-gizmo-xxx modelleri için)! Varsayılan olarak kapalıdır, açmak için API_UPLOADER=1 ortam değişkenine ihtiyaç vardır
- [X] chatgpt tersine modeller gpt-4-all, gpt-4-v, gpt-4-gizmo-(gizmo_id) desteği
- [X] chatgpt super link model değiştirme https://vercel.ddaiai.com/#/m/gpt-4-all https://vercel.ddaiai.com/#/m/gpt-4-gizmo-g-2fkFE8rbu desteği
- [X] ChatGPT super link model değiştirme desteği https://chat.openai.com/g/g-2fkFE8rbu https://vercel.ddaiai.com/#/g/g-2fkFE8rbu olarak değiştirilebilir
- [X] chatgpt GPTs multi-modal desteği
- [X] chatgpt tts whisper desteği
- [X] Anında ses tanıma (tarayıcıda yerleşik ses tanıma ASR) `v2.15.7` üzeri sürümler
- [X] one-api ve new-api dağıtım sohbeti için super link değiştirme https://vercel.ddaiai.com/#/s/t?OPENAI_API_BASE_URL=https://abc.com&OPENAI_API_KEY=sk-xxxxx&MJ_SERVER=https://abc.com&MJ_API_SECRET=sk-xxx&UPLOADER_URL=
- [X] one-api ve new-api dağıtım sohbeti https://vercel.ddaiai.com/#/?settings={%22key%22:%22sk-abc%22,%22url%22:%22https://www.abc.com%22} `(v.2.14.3)`

## Sunucusuz-Kişisel Masaüstü Kurulumu
> - [x] En son sürümü indirmek için https://github.com/Dooy/chatgpt-web-midjourney-proxy/releases adresine gidin (işletim sisteminize uygun sürümü seçin)
> - [x] Uygun bir ara sunucu hizmeti seçin (tercihen `gpt`, `gpts`, `midjourney`, `claude`, `suno` destekleyen)
> - [x] Ara sunucu hizmet sağlayıcıları önerisi https://www.openai-hk.com bir `key` ve `api arayüz adresi` aynı anda `gpt`, `midjourney`, `claude`, `suno` destekler, mj-fast en düşük 0.12rmb/adet
![multi-modal](./docs/suno-ds.jpg)

## Vercel Tek Tıklama ile Dağıtım

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dooy/chatgpt-web-midjourney-proxy&env=OPENAI_API_BASE_URL&env=OPENAI_API_KEY&env=MJ_SERVER&env=MJ_API_SECRET&project-name=chatgpt-web-midjourney-proxy&repository-name=chatgpt-web-midjourney-proxy)

## env Ortam Değişkenleri

| Ortam Değişkeni | Açıklama | Varsayılan Değer |docker gibi dağıtımlar| vercel dağıtımı|
| --- | --- | --- | --- | --- |
| OPENAI_API_BASE_URL | OpenAI API arayüz adresi | https://api.openai.com | ✅ |  ✅|
| OPENAI_API_KEY | OpenAI API anahtarı |  sk-xxxxx | ✅ |  ✅|
| OPENAI_API_MODEL |  Varsayılan model | gpt-3.5-turbo  | ✅ |  ✅|
| MJ_SERVER |  mj proxy arayüz adresi  |[Kurulum Referansı](https://github.com/novicezk/midjourney-proxy) | ✅ |  ✅|
| MJ_API_SECRET |  mj proxy | Boş  | ✅ |  ✅|
| SUNO_SERVER |  SUNO API arayüz adresi  | [Kurulum Referansı](https://github.com/SunoAI-API/Suno-API) | ✅ |  ✅|
| SUNO_KEY |  SUNO API anahtarı | Boş  | ✅ |  ✅|
| AUTH_SECRET_KEY |  Erişim yetkilendirme şifresi | Yok  | ✅ |   x|
| API_UPLOADER |  Yükleme desteği | Kapalı  | ✅ |  x|
| HIDE_SERVER |  Ön uç arayüzü sunucu gizle |    | ✅ |  x|
| CUSTOM_MODELS |  Özel seçilebilir modeller | Yok  | ✅ |  ✅|
| TJ_BAIDU_ID |  Baidu İstatistik ID | Yok  | ✅ |  ✅|
| TJ_GOOGLE_ID |  Google İstatistik ID | Yok  | ✅ |  ✅|
| SYS_NOTIFY |  Sistem bildirimi, HTML destekler | Yok  | ✅ |  ✅|
| DISABLE_GPT4 |  GPT-4 devre dışı bırakma | Yok  | ✅ |  ✅|
| GPT_URL | Özelleştir GPT_URL=/gpts.json  | Yok, ayrıca kendi harici linkinizi de kullanabilirsiniz | ✅ |  ✅|
| UPLOAD_IMG_SIZE | gpt4v görüntü yükleme boyutu |  1 | ✅ |  ✅|
| SYS_THEME | Varsayılan tema `light` veya `dark`  | dark | ✅ |  ✅|
| MJ_IMG_WSRV | `wsrv` resim sunucu açılışı | Yok (kapalı)  | ✅ |  ✅|
| AUTH_SECRET_ERROR_COUNT | Bruteforce koruması: doğrulama sayısı NGINX lütfen `proxy_set_header   X-Forwarded-For  $remote_addr` ayarlayın | Yok  | ✅ |  x|
| AUTH_SECRET_ERROR_TIME | Bruteforce koruması: bekleme süresi dakika cinsinden | Yok  | ✅ |  x|
| CLOSE_MD_PREVIEW | Giriş önizlemesini kapat | Yok  | ✅ |  ✅|
| UPLOAD_TYPE | Yükleme türü [`R2` R2 yükleme] [`API` UI ön uçla ara sunucu] [`Container` yerel konteyner] [`

MyUrl` özel link]  |  Boş | ✅ |  x|
| MENU_DISABLE  | Menü devre dışı bırakılacak seçenekler: gpts,draws,gallery,music |  Boş | ✅ |  ✅|
| VISION_MODEL  | Varsayılan görüntü modeli seçenekleri: `gpt-4o`, `gpt-4-turb`, `gpt-4-vision-preview` vb. |  Boş | ✅ |  ✅|
| SYSTEM_MESSAGE  | Varsayılan özel rol mesajı |  Boş | ✅ |  ✅|
| CUSTOM_VISION_MODELS  | Özel görüntü modelleri, virgülle ayrılmış |  Boş | ✅ |  ✅|

## docker Dağıtımı

> - [x] [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) desteği gereklidir
> - [x] [Suno-API](https://github.com/SunoAI-API/Suno-API) desteği gereklidir


```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://your-mj-server:6013  \
-e MJ_API_SECRET=your-mj-api-secret  \
-e SUNO_SERVER=https://your-suno-server:8000  \
-e SUNO_KEY=your-suno-key  ydlhero/chatgpt-web-midjourney-proxy
```
Erişim http://ip:6015 

**Dosya Yükleme**: 
```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e MJ_API_SECRET=abc123456  ydlhero/chatgpt-web-midjourney-proxy
```
Ön uç arayüzde OPENAI_API_KEY ve OPENAI_API_BASE_URL ayarlandığında; resim yükleme de OPENAI_API_BASE_URL üzerinden yürütülecektir
```shell
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/path/to/file" http://OPENAI_API_BASE_URL/v1/upload
```
Dönüş Formatı
```json
{
"url":"https://xxxxxxx.jpg"
}
```

### midjourney-proxy API docker dağıtımı
Daha fazla bilgi için [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) açık kaynak referansını ziyaret edin
```bash
docker run -d --name mj6013  -p 6013:8080  \
-e mj.discord.guild-id=discord hizmeti ID  \
-e mj.discord.channel-id=discord hizmet grubu ID   \
-e mj.queue.timeout-minutes=6 \
-e mj.api-secret=abc123456 \
-e mj.discord.user-token=**********  \
--restart=always novicezk/midjourney-proxy:2.5.5
```

## Daha Fazla Gösterim

### Özel sunucu api key, base_url:
![base_url](./docs/gptbase.jpg)

### GPTS  GTP Mağaza
![multi-modal](./docs/gpts.jpg)
![multi-modal](./docs/gpts1.jpg)

### suno Müzik Yapımı
![suno](./docs/suno.jpg)

### Ses Kaydı whisper ve tts
![whisper--tts](./docs/tts-whisper.png)

### Yerel yeniden çizim:
[![Yerel yeniden çizim](./docs/mj2.jpg)](./docs/mj2.jpg)

### Yüz Değiştirme
![Yüz Değiştirme](./docs/mj2a2.jpg)

### Görüntü Karıştırma
![Görüntü Karıştırma](./docs/mj2a3.jpg)

### Görüntü yükleme ve gpt-4-vision-preview kullanımı
![Görüntü](./docs/mj4a1.png)
Mobil:
<div style="display: flex; flex-wrap: wrap">
 <img src="./docs/mjs1.jpg" style="width:200px" >
 <img src="./docs/mjs2.jpg"  style="width:200px">
 <img src="./docs/mjs3.jpg"  style="width:200px">
</div>


## Dosya Yükleme Cloudflare R2 Depolama Desteği

- Cloudflare R2 depolama 10 GB/ay ücretsiz https://www.cloudflare.com/zh-cn/developer-platform/r2/
- Konfigürasyon dokümanı için https://zhuanlan.zhihu.com/p/658058503 adresine bakın
- vercel R2 depolamayı desteklemez
```yml
R2_DOMAIN=
R2_BUCKET_NAME=
R2_ACCOUNT_ID=
R2_KEY_ID=
R2_KEY_SECRET=
```
## Dosya Sunucusu Talep Öncelik Sırası
R2> Ön uç arayüzde belirlenen dosya hizmeti> Arka uç dosya hizmeti > ara sunucu
## Bruteforce Koruma Ayarları

![Bruteforce](./docs/check_error.jpg)
- [x] vercel desteklemez; sadece Docker dağıtımı destekler
- [x] Eğer ön tarafta `nginx` kullanılıyorsa lütfen `proxy_set_header   X-Forwarded-For  $remote_addr;` ayarlayın
- [x] Parametreler: 3 kez yanlış doğrulama yapılırsa, 10 dakika boyunca tekrar doğrulama yapılamaz
```yml
# Secret key Not: Sadece İngilizce harf ve rakam kullanın
AUTH_SECRET_KEY=my888god
# Bruteforce: doğrulama sayısı Not: Rakam olmalıdır; nginx lütfen `proxy_set_header   X-Forwarded-For  $remote_addr` ayarlayın
AUTH_SECRET_ERROR_COUNT=3
# Bruteforce: bekleme süresi dakika cinsinden Not: Rakam olmalıdır
AUTH_SECRET_ERROR_TIME=10
```
- [x] Betik
```shell
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e MJ_API_SECRET=abc123456 \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e AUTH_SECRET_KEY=ingilizce_sifreniz -e AUTH_SECRET_ERROR_COUNT=3 \
-e AUTH_SECRET_ERROR_TIME=10 ydlhero/chatgpt-web-midjourney-proxy
```
## Lisans
MIT © [Dooy](./license)

## Diğerleri
Eğer bu proje size yardımcı olduysa, lütfen bir yıldız verin veya bizi bağışlayın

[![Star History Chart](https://api.star-history.com/svg?repos=Dooy/chatgpt-web-midjourney-proxy&type=Date)](https://star-history.com/#Dooy/chatgpt-web-midjourney-proxy&Date)

## Bağış
Eğer açık kaynak projelerim size yardımcı olduysa, lütfen aşağıdaki yöntemlerden biriyle bağış yapmayı düşünün:
<br> `Ödeme notunda iletişim bilgilerinizi belirtin`
<div style="display: flex; flex-wrap: wrap">
    <div style="width:200px">
        <img src="./docs/wxpay.jpg"  style="width:200px">
        <div>WeChat Bağışı</div>
    </div>
    <div style="width:200px">
        <img src="./docs/alipay.jpg"  style="width:200px"> 
        <div>Alipay Bağışı</div>
    </div>
</div>