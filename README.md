# ChatGPT Web Midjourney Proxy

[English](./README_EN.md) | [Русский язык](./README_RU.md) | [Français](./README_FR.md) | [한국어](./README_KR.md) | [Tiếng Việt](./README_VN.md) | [Türkçe](./README_TR.md)

## 声明
- 此项目只发布于 GitHub，基于 MIT 协议，免费且作为开源学习使用。并且不会有任何形式的卖号、付费服务、讨论群、讨论组等行为。谨防受骗。
- 本开源是在 [ChenZhaoYu](https://github.com/Chanzhaoyu/chatgpt-web) 基础上做二次开发 ；使用 [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) 、 [Suno-API](https://github.com/SunoAI-API/Suno-API)、[Luma-API](https://github.com/LumaAI-API/Luma-API)  作为后端API而形成的；
- 可以直接用 https://vercel.ddaiai.com 先体验

![cover](./docs/mj2a1.jpg)
## 支持功能 
- [x] 支持 luma 文生视频，图生视频
- [x] 支持 suno 单独模块，可歌词调整 曲风调整
- [x] 支持 suno 以音频生成音频
- [x] 原chatgpt web 所有功能
- [x] chatgpt web 支持自定义api key、base_url
- [x] midjourney 文生图
- [x] midjourney 垫图+文生图  
- [X] midjourney 图变 U1到U4 、 V1到V4、重绘等操作
- [X] midjourney 支持局部重绘
- [X] midjourney 支持1.5倍变焦 2倍变焦
- [X] midjourney 支持2倍高清 4倍高清
- [X] midjourney 支持左、右、上、下延伸变化
- [X] midjourney 同时支持[midjourney-proxy](https://github.com/novicezk/midjourney-proxy) 接口 和 [midjourney-proxy-plus](https://github.com/litter-coder/midjourney-proxy-plus) 接口
- [X] midjourney 图生文
- [X] 图片使用localforage实现本地存储
- [X] 支持midjourney、niji 不同机器人
- [X] 支持[InsightFace 人脸替换](https://discord.com/api/oauth2/authorize?client_id=1090660574196674713&permissions=274877945856&scope=bot)
- [X] midjourney 混图
- [X] midjourney 获取 seed
- [X] dall-e-3 画图
- [X] chatgpt 前端选择模型
- [X] chatgpt 前端支持自定义模型、上下文对话数、回复数
- [X] chatgpt 支持图片上传图片 供gpt-4-vision-preview使用
- [X] chatgpt 支持文件后端上传（供给gpt-4-all gpt-4-gizmo-xxx 模型）！ 默认是关闭的 打开需要环境变量 API_UPLOADER=1
- [X] chatgpt 支持逆向模型 gpt-4-all gpt-4-v gpt-4-gizmo-(gizmo_id)
- [X] chatgpt 支持超链模型切换 https://vercel.ddaiai.com/#/m/gpt-4-all https://vercel.ddaiai.com/#/m/gpt-4-gizmo-g-2fkFE8rbu
- [X] 支持ChatGPT试的超链模型切换 https://chat.openai.com/g/g-2fkFE8rbu 修改为 https://vercel.ddaiai.com/#/g/g-2fkFE8rbu
- [X] chatgpt 支持 GPTs 多模态
- [X] chatgpt 支持 tts whisper
- [X] 即时语音识别(浏览器自带语音识别 ASR) `v2.15.7`以上版本
- [X] 支持超链更换设置，适合`one-api` `new-api`部署聊天 https://vercel.ddaiai.com/#/s/t?OPENAI_API_BASE_URL=https://abc.com&OPENAI_API_KEY=sk-xxxxx&MJ_SERVER=https://abc.com&MJ_API_SECRET=sk-xxx&UPLOADER_URL=
- [X] 支持`one-api`、`new-api`部署聊天 https://vercel.ddaiai.com/#/?settings={%22key%22:%22sk-abc%22,%22url%22:%22https://www.abc.com%22} `(v.2.14.3)`

## 无服务器-个人桌面安装
> - [x] 请到 https://github.com/Dooy/chatgpt-web-midjourney-proxy/releases 下载最新版本安装(选择合适你操作系统的版本)
> - [x] 选择一个合适的中转服务商( 最好都支持 `gpt`  `gpts` `midjourney` `claude`  `suno` `luma` )
> - [x] 中转服务商推荐 https://www.openai-hk.com 一个`key`和`api接口地址` 同时支持 `gpt` `midjourney` `claude` `suno` `luma`，mj-fast最低能到0.12rmb/张,`suno` 最低能到0.08rmb/首歌曲, `luma`最低能到0.16rmb/次
![多模态](./docs/suno-ds.jpg)

## Vercel 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dooy/chatgpt-web-midjourney-proxy&env=OPENAI_API_BASE_URL&env=OPENAI_API_KEY&env=MJ_SERVER&env=MJ_API_SECRET&project-name=chatgpt-web-midjourney-proxy&repository-name=chatgpt-web-midjourney-proxy)

## env 环境变量

| 环境变量 | 说明 | 默认值 |docker等部署| vercel 部署|
| --- | --- | --- | --- | --- |
| OPENAI_API_BASE_URL | OpenAI API 接口地址 | https://api.openai.com | ✅ |  ✅|
| OPENAI_API_KEY | OpenAI API 密钥 |  sk-xxxxx | ✅ |  ✅|
| OPENAI_API_MODEL |  默认模型 | gpt-3.5-turbo  | ✅ |  ✅|
| MJ_SERVER |  mj proxy 接口地址  |[搭建参考](https://github.com/novicezk/midjourney-proxy) | ✅ |  ✅|
| MJ_API_SECRET |  mj proxy | 空  | ✅ |  ✅|
| SUNO_SERVER |  SUNO API 接口地址  | [搭建参考](https://github.com/SunoAI-API/Suno-API) | ✅ |  ✅|
| SUNO_KEY |  SUNO API 的key | 空  | ✅ |  ✅|
| AUTH_SECRET_KEY |  访问授权密码 | 无  | ✅ |   x|
| API_UPLOADER |  支持上传 | 关闭  | ✅ |  x|
| HIDE_SERVER |  前端ui隐藏服务端|    | ✅ |  x|
| CUSTOM_MODELS |  自定义可选模型 `CUSTOM_MODELS=-all,gpt-3.5` | 无  | ✅ |  ✅|
| TJ_BAIDU_ID |  百度统计ID | 无  | ✅ |  ✅|
| TJ_GOOGLE_ID |  谷歌统计ID | 无  | ✅ |  ✅|
| SYS_NOTIFY |  系统通知，支持HTML | 无  | ✅ |  ✅|
| DISABLE_GPT4 |  禁用GPT-4 | 无  | ✅ |  ✅|
| GPT_URL | 自定 GPT_URL=/gpts.json  | 无 也可自己的外链 | ✅ |  ✅|
| UPLOAD_IMG_SIZE | gpt4v 上传图片大小 |  1 | ✅ |  ✅|
| SYS_THEME | 默认主题 `light`或者`dark`  | dark | ✅ |  ✅|
| MJ_IMG_WSRV | 是否开启 `wsrv`图床  | 无(关闭)  | ✅ |  ✅|
| AUTH_SECRET_ERROR_COUNT | 防爆破验证：验证次数触发 NGINX 请设置 `proxy_set_header   X-Forwarded-For  $remote_addr`  | 无  | ✅ |  x|
| AUTH_SECRET_ERROR_TIME | 防爆破验证：停留时间 单位分钟  | 无  | ✅ |  x|
| CLOSE_MD_PREVIEW | 是否不关闭输入预览 | 无  | ✅ |  ✅|
| UPLOAD_TYPE | 指定上传方式 [`R2` R2上传] [`API` 跟随UI前端中转]、[`Container` 本地容器]、[`MyUrl` 自定义链接]  |  空 | ✅ |  x|
| MENU_DISABLE  | 菜单禁用 可选:gpts,draws,gallery,music,video |  空 | ✅ |  ✅|
| VISION_MODEL  | 默认使用的识图 可选:`gpt-4o`,`gpt-4-turb`,`gpt-4-vision-preview`等 |  空 | ✅ |  ✅|
| SYSTEM_MESSAGE  | 自定义默认角色消息 |  空 | ✅ |  ✅|
| CUSTOM_VISION_MODELS  | 自定义可视图模型 用`,` 分开 |  空 | ✅ |  ✅|
| LUMA_SERVER |  LUMA API 接口地址  | [搭建参考](https://github.com/LumaAI-API/Luma-API) | ✅ |  ✅|
| LUMA_KEY |  LUMA API 的key | 空  | ✅ |  ✅|

  

## docker 部署
 
> - [x] 需 [midjourney-proxy](https://github.com/novicezk/midjourney-proxy)   支持
> - [x] 需 [Suno-API](https://github.com/SunoAI-API/Suno-API)  支持
> - [x] 需 [Luma-API](https://github.com/LumaAI-API/Luma-API)  支持


```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://your-mj-server:6013  \
-e MJ_API_SECRET=your-mj-api-secret  \
-e LUMA_SERVER=https://your-luma-server:8000  \
-e LUMA_KEY=your-luma-key  \
-e SUNO_SERVER=https://your-suno-server:8000  \
-e SUNO_KEY=you-suno-key  ydlhero/chatgpt-web-midjourney-proxy
```
访问 http://ip:6015 

**文件上传**: 
```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e MJ_API_SECRET=abc123456  ydlhero/chatgpt-web-midjourney-proxy
```
如果是前端ui设置 OPENAI_API_KEY OPENAI_API_BASE_URL ; 图片上传也会随着走 OPENAI_API_BASE_URL走
```shell
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/path/to/file" http://OPENAI_API_BASE_URL/v1/upload
```
返回格式
```json
{
"url":"https://xxxxxxx.jpg"
}
```

### midjourney-proxy API docker部署
更多参考到 [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) 开源光光
```bash
docker run -d --name mj6013  -p 6013:8080  \
-e mj.discord.guild-id=discord服务ID  \
-e mj.discord.channel-id=discord服务组ID   \
-e mj.queue.timeout-minutes=6 \
-e mj.api-secret=abc123456 \
-e mj.discord.user-token=**********  \
--restart=always novicezk/midjourney-proxy:2.5.5
```


## 更多展示

### 自定义服务端api key、base_url：
![base_url](./docs/gptbase.jpg)

### GPTS  GTP Store 
![多模态](./docs/gpts.jpg)
![多模态](./docs/gpts1.jpg)

### suno 音乐制作
![suno](./docs/suno.jpg)


### 录音 whisper  和  tts
![whisper--tts](./docs/tts-whisper.png)

### 局部重绘：
[![局部重绘](./docs/mj2.jpg)](./docs/mj2.jpg)

### 换脸
![换脸](./docs/mj2a2.jpg)

### 混图
![混图](./docs/mj2a3.jpg)

### 支持图片上传图片 供gpt-4-vision-preview使用
![混图](./docs/mj4a1.png)
手机端：
<div style="display: flex; flex-wrap: wrap">
 <img src="./docs/mjs1.jpg" style="width:200px" >
 <img src="./docs/mjs2.jpg"  style="width:200px">
 <img src="./docs/mjs3.jpg"  style="width:200px">
</div>


## 文件上传 支持cloudflare r2 存储

- cloudflare r2 存储 10 GB/月 免费 https://www.cloudflare.com/zh-cn/developer-platform/r2/
- 配置文档参考 https://zhuanlan.zhihu.com/p/658058503
- vercel 不支持 r2 存储
```yml
R2_DOMAIN=
R2_BUCKET_NAME=
R2_ACCOUNT_ID=
R2_KEY_ID=
R2_KEY_SECRET=
```
## 文件服务器请求优先顺序
R2> 前端UI设置文件服务> 后端文件服务 >跟随中转
## 防爆破验证设置

![防爆破](./docs/check_error.jpg)
- [x] vercel 不支持；仅支持Docker化部署
- [x] 如果前面挂载 `nginx` 请配置 `proxy_set_header   X-Forwarded-For  $remote_addr;`
- [x] 参数如下: 错误验证3次，只能在10分钟后再验证
```yml
# Secret key 注意: 只能拿事英文+数字
AUTH_SECRET_KEY=my888god
#爆破：验证次数 注意: 数字 ；nginx 请设置  proxy_set_header   X-Forwarded-For  $remote_addr;
AUTH_SECRET_ERROR_COUNT=3
#爆破：验证停留时间 单位分钟 注意: 是数字
AUTH_SECRET_ERROR_TIME=10
```
- [x] 脚本如下
```shell
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e MJ_API_SECRET=abc123456 \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e AUTH_SECRET_KEY=你的英文密码 -e AUTH_SECRET_ERROR_COUNT=3 \
-e AUTH_SECRET_ERROR_TIME=10 ydlhero/chatgpt-web-midjourney-proxy
```
- 
## License
MIT © [Dooy](./license)

## 其他
如果觉得这个项目对您有所帮助，请帮忙点个star 或者捐助我们

[![Star History Chart](https://api.star-history.com/svg?repos=Dooy/chatgpt-web-midjourney-proxy&type=Date)](https://star-history.com/#Dooy/chatgpt-web-midjourney-proxy&Date)

## 捐助
如果我的开源项目对你有帮助，请考虑通过以下任意一种方式赞助: 
<br> `付款备注上您的联系方式`
<div style="display: flex; flex-wrap: wrap">
    <div style="width:200px">
        <img src="./docs/wxpay.jpg"  style="width:200px">
        <div>微信捐助</div>
    </div>
    <div style="width:200px">
        <img src="./docs/alipay.jpg"  style="width:200px"> 
        <div>支付宝捐助</div>
    </div>
</div>