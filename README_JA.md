
# ChatGPT Web Midjourney Proxy

[中文](./README_ZH.md) | [Русский язык](./README_RU.md) | [Français](./README_FR.md) | [한국어](./README_KR.md) | [Tiếng Việt](./README_VN.md) | [Türkçe](./README_TR.md) | [日本語](./README_JA.md)

## 免責事項
- このプロジェクトはGitHub上でMITライセンスのもとで公開されているのみであり、学習目的のためのフリーかつオープンソースです。アカウントの販売、有料サービス、ディスカッショングループなどは一切ありません。詐欺にご注意ください。
このオープンソースプロジェクトは [ChenZhaoYu](https://github.com/Chanzhaoyu/chatgpt-web) をベースに開発されており、[midjourney-proxy](https://github.com/novicezk/midjourney-proxy) と [Suno-API] が提供する midjourney API をバックエンドとして使用しています。

![cover](./docs/mj2a1.jpg)

 

## サポートされている機能 
- [x] Klingによるテキストからビデオ、画像からビデオ、描画のサポート。
- [x] Ideogramによる描画のサポート。
- [x] Runwayによるテキストからビデオ、画像からビデオのサポート。
- [x] Lumaによるテキストからビデオ、画像からビデオのサポート。
- [x] Viggleによるダンスのサポート
- [x] 音声から音声の生成のためのSunoのサポート
- [x] 歌詞と音楽スタイルを調整できるスタンドアロンSunoモジュールのサポート
- [x] すべてのオリジナルChatGPTウェブ機能
- [x] ChatGPT web custom APIキーとbase_urlをサポート
- [x] Midjourney テキストから画像
- [x] Midjourney ブレンド画像 + テキストから画像  
- [X] Midjourney 画像バリエーション U1 から U4、V1 から V4、および再描画
- [X] Midjourney 部分的な再描画
- [X] Midjourney 1.5 倍および 2 倍ズーム
- [X] Midjourney 2 倍および 4 倍 HD
- [X] Midjourney 左、右、上、および下への拡張
- [X] Midjourneyは[midjourney-proxy](https://github.com/novicezk/midjourney-proxy)と[midjourney-proxy-plus](https://github.com/litter-coder/midjourney-proxy-plus)の両方をサポート
- [X] Midjourney 画像からのテキスト
- [X] localforagを使用したローカル画像ストレージ
- [X] midjourneyやnijiなどのさまざまなボットのサポート
- [X] [InsightFace 顔入れ替え](https://discord.com/api/oauth2/authorize?client_id=1090660574196674713&permissions=274877945856&scope=bot)のサポート
- [X] Midjourney 画像のブレンド
- [X] Midjourney シードの取得
- [X] DALL-E-3 画像生成
- [X] ChatGPTフロントエンド モデルの選択
- [X] ChatGPTフロントエンド カスタムモデル、文脈数、返信数をサポート
- [X] ChatGPT GPT-4-Vision-Previe の画像アップロードをサポート
- [X] ChatGPT ファイル バックエンドのアップロード（GPT-4-All、GPT-4-Gizmo-xxxなどのモデル用）をデフォルトではオフにしており、環境変数API_UPLOADER=1で有効にできます
- [X] ChatGPT GPT-4-All、GPT-4-V、GPT-4-Gizmo-(gizmo_id)などのリバースモデルをサポートしています
- [X] ChatGPT ハイパーリンクモデルの切り替えをサポートしています。https://vercel.ddaiai.com/#/m/gpt-4-all https://vercel.ddaiai.com/#/m/gpt-4-gizmo-g-2fkFE8rb
- [X] ChatGPT ChatGPTスタイルのハイパーリンクモデルの切り替えをサポート https://chat.openai.com/g/g-2fkFE8rbu を https://vercel.ddaiai.com/#/g/g-2fkFE8rb に変更
- [X] ChatGPT GPT のマルチモーダルをサポート
- [X] ChatGPT TTS ウィスパーをサポート
- [X] インスタント音声認識 (ブラウザの組み込み ASR) `v2.15.7` およびそれ以上
- [X] ハイパーリンクの変更設定をサポート。`one-api` および `new-api` の展開に適しています。https://vercel.ddaiai.com/#/s/t?OPENAI_API_BASE_URL=https://abc.com&OPENAI_API_KEY=sk-xxxxx&MJ_SERVER=https://abc.com&MJ_API_SECRET=sk-xxx&UPLOADER_URL
- [X] `one-api` および `new-api` デプロイメントをサポート https://vercel.ddaiai.com/#/?settings={%22key%22:%22sk-abc%22,%22url%22:%22https://www.abc.com%22} `(v.2.14.3)

## サーバレス - パーソナル デスクトップ インストール
> - [x] Please download the latest version from https://github.com/Dooy/chatgpt-web-midjourney-proxy/releases (choose the version suitable for your operating system)
> - [x] Choose an appropriate proxy service (preferably one that supports `gpt`, `gpts`, `midjourney`, `claude`, `suno`)
> - [x] Recommended proxy service https://www.openai-hk.com a `key` and `api interface address` support `gpt`, `midjourney`, `claude`, `suno` simultaneously, mj-fast as low as 0.12 RMB/image
![multimodal](./docs/suno-ds.jpg)

## Vercel ワンクリック デプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dooy/chatgpt-web-midjourney-proxy&env=OPENAI_API_BASE_URL&env=OPENAI_API_KEY&env=MJ_SERVER&env=MJ_API_SECRET&project-name=chatgpt-web-midjourney-proxy&repository-name=chatgpt-web-midjourney-proxy)

## env Environment Variables

| Environment Variable | Description | Default Value | Docker Deployment | Vercel Deployment |
| --- | --- | --- | --- | --- |
| OPENAI_API_BASE_URL | OpenAI API interface address | https://api.openai.com | ✅ |  ✅|
| OPENAI_API_KEY | OpenAI API key |  sk-xxxxx | ✅ |  ✅|
| OPENAI_API_MODEL |  Default model | gpt-3.5-turbo  | ✅ |  ✅|
| MJ_SERVER |  MJ proxy interface address  | [Reference for setup](https://github.com/novicezk/midjourney-proxy) | ✅ |  ✅|
| MJ_API_SECRET |  MJ proxy secret | Empty  | ✅ |  ✅|
| SUNO_SERVER |  SUNO API interface address  | [Reference for setup](https://github.com/SunoAI-API/Suno-API) | ✅ |  ✅|
| SUNO_KEY |  SUNO API key | Empty  | ✅ |  ✅|
| AUTH_SECRET_KEY |  Access authorization password | None  | ✅ |   x|
| API_UPLOADER |  Support upload | Disabled  | ✅ |  x|
| HIDE_SERVER |  Hide server UI on the front end |    | ✅ |  x|
| CUSTOM_MODELS |  Custom selectable models | None  | ✅ |  ✅|
| TJ_BAIDU_ID |  Baidu Analytics ID | None  | ✅ |  ✅|
| TJ_GOOGLE_ID |  Google Analytics ID | None  | ✅ |  ✅|
| SYS_NOTIFY |  System notifications, supports HTML | None  | ✅ |  ✅|
| DISABLE_GPT4 |  Disable GPT-4 | None  | ✅ |  ✅|
| GPT_URL | Custom GPT_URL=/gpts.json  | None or your external link | ✅ |  ✅|
| UPLOAD_IMG_SIZE | GPT4V upload image size |  1 | ✅ |  ✅|
| SYS_THEME | Default theme `light` or `dark`  | dark | ✅ |  ✅|
| MJ_IMG_WSRV | Enable `wsrv` image bed  | None (disabled)  | ✅ |  ✅|
| AUTH_SECRET_ERROR_COUNT | Brute force prevention: Number of verification attempts NGINX please set `proxy_set_header X-Forwarded-For $remote_addr`  | None  | ✅ |  x|
| AUTH_SECRET_ERROR_TIME | Brute force prevention: Wait time in minutes  | None  | ✅ |  x|
| CLOSE_MD_PREVIEW | Do not close input preview | None  | ✅ |  ✅|
| UPLOAD_TYPE | Specify upload method [`R2` R2 upload] [`API` Follow UI front-end relay] [`Container` Local container] [`MyUrl` Custom link]  |  Empty | ✅ |  x|
| MENU_DISABLE  | Disable menu options: gpts, draws, gallery, music |  Empty | ✅ |  ✅|
| VISION_MODEL  | Default recognition model Options: `gpt-4o`, `gpt-4-turb`, `gpt-4-vision-preview`, etc. |  Empty | ✅ |  ✅|
| SYSTEM_MESSAGE  | Custom default role message |  Empty | ✅ |  ✅|
| CUSTOM_VISION_MODELS  | Custom vision models separated by `,` |  Empty | ✅ |  ✅|

## Docker Deployment
 
> - [x] Requires [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) support
> - [x] Requires [Suno-API]  support

```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://your-mj-server:6013  \
-e MJ_API_SECRET=your-mj-api-secret  \
-e SUNO_SERVER=https://your-suno-server:8000  \
-e SUNO_KEY=you-suno-key  ydlhero/chatg

pt-web-midjourney-proxy
```
Access http://ip:6015 

**File Upload**: 
```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e MJ_API_SECRET=abc123456  ydlhero/chatgpt-web-midjourney-proxy
```

フロントエンドUIが ``OPENAI_API_KEY`` と ``OPENAI_API_BASE_URL`` を設定した場合、画像のアップロードも ``OPENAI_API_BASE_URL`` に従います。

```shell
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/path/to/file" http://OPENAI_API_BASE_URL/v1/upload
```
Return format
```json
{
"url":"https://xxxxxxx.jpg"
}
```

### Midjourney-proxy API Docker Deployment

詳しくは[midjourney-proxy](https://github.com/novicezk/midjourney-proxy)オープンソースプロジェクトを参照。

```bash
docker run -d --name mj6013  -p 6013:8080  \
-e mj.discord.guild-id=Discord Server ID  \
-e mj.discord.channel-id=Discord Server Group ID   \
-e mj.queue.timeout-minutes=6 \
-e mj.api-secret=abc123456 \
-e mj.discord.user-token=**********  \
--restart=always novicezk/midjourney-proxy:2.5.5
```

## その他のデモンストレーション

### Custom Server API Key, Base_URL:
![base_url](./docs/gptbase.jpg)

### GPTS  GTP Store 
![multimodal](./docs/gpts.jpg)
![multimodal](./docs/gpts1.jpg)

### Suno Music Creation
![suno](./docs/suno.jpg)

### Recording Whisper and TTS
![whisper--tts](./docs/tts-whisper.png)

### Partial Redraw:
[![Partial Redraw](./docs/mj2.jpg)](./docs/mj2.jpg)

### Face Replacement
![Face Replacement](./docs/mj2a2.jpg)

### Image Blending
![Image Blending](./docs/mj2a3.jpg)

### Support for Image Upload for GPT-4-Vision-Preview
![Image Blending](./docs/mj4a1.png)
Mobile:
<div style="display: flex; flex-wrap: wrap">
 <img src="./docs/mjs1.jpg" style="width:200px" >
 <img src="./docs/mjs2.jpg"  style="width:200px">
 <img src="./docs/mjs3.jpg"  style="width:200px">
</div>

## File Upload Support for Cloudflare R2 Storage

- Cloudflare R2 storage 10 GB/month free https://www.cloudflare.com/zh-cn/developer-platform/r2/
- Configuration reference https://zhuanlan.zhihu.com/p/658058503
- Vercel does not support R2 storage
```yml
R2_DOMAIN=
R2_BUCKET_NAME=
R2_ACCOUNT_ID=
R2_KEY_ID=
R2_KEY_SECRET=
```
## File Server Request Priority
R2 > Front-end UI set file service > Backend file service > Follow proxy
## Brute Force Prevention Settings

![Brute Force Prevention](./docs/check_error.jpg)
- [x] Vercel is not supported; only Docker deployment is supported
- [x] If NGINX is mounted in front, configure `proxy_set_header X-Forwarded-For $remote_addr;`
- [x] Parameters: 3 failed verification attempts, can only reattempt after 10 minutes
```yml
# Secret key Note: Only alphanumeric characters
AUTH_SECRET_KEY=my888god
# Brute force: verification attempts Note: Number; NGINX please set proxy_set_header X-Forwarded-For $remote_addr;
AUTH_SECRET_ERROR_COUNT=3
# Brute force: wait time in minutes Note: Number
AUTH_SECRET_ERROR_TIME=10
```
- [x] Script:
```shell
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e MJ_API_SECRET=abc123456 \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e AUTH_SECRET_KEY=your-english-password -e AUTH_SECRET_ERROR_COUNT=3 \
-e AUTH_SECRET_ERROR_TIME=10 ydlhero/chatgpt-web-midjourney-proxy
```

## License
MIT © [Dooy](./license)

## Others
## もしこのプロジェクトがお役に立つとお感じになりましたら、星をつけるか寄付をご検討ください。

[![Star History Chart](https://api.star-history.com/svg?repos=Dooy/chatgpt-web-midjourney-proxy&type=Date)](https://star-history.com/#Dooy/chatgpt-web-midjourney-proxy&Date)

## 寄付

もし私のオープンソース・プロジェクトがあなたのお役に立つようでしたら、以下のいずれかの方法でスポンサーになることをご検討ください：

<br> `Payment remarks with your contact information`
<div style="display: flex; flex-wrap: wrap">
    <div style="width:200px">
        <img src="./docs/wxpay.jpg"  style="width:200px">
        <div>WeChat Donation</div>
    </div>
    <div style="width:200px">
        <img src="./docs/alipay.jpg"  style="width:200px"> 
        <div>Alipay Donation</div>
    </div>
</div>