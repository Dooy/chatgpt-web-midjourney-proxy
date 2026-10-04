# HOBA AI TOOLBOX
💡**Tuyên bố**
- Dự án này chỉ phát hành trên GitHub, dựa trên giấy phép MIT, miễn phí và sử dụng cho mục đích học tập mã nguồn mở. Không có bất kỳ hình thức bán tài khoản, dịch vụ trả phí, nhóm thảo luận, nhóm thảo luận nào khác. Hãy cảnh giác với lừa đảo.
- Mã nguồn mở này được phát triển lại dựa trên [ChenZhaoYu](https://github.com/Chanzhaoyu/chatgpt-web) và sử dụng midjourney api do [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) cung cấp và [Suno-API](https://github.com/SunoAI-API/Suno-API) làm backend.

![cover](./docs/mj2a1.jpg)
## Chức năng hỗ trợ
- [x] Hỗ trợ module riêng biệt Suno, có thể điều chỉnh lời bài hát và phong cách âm nhạc
- [x] Tất cả các chức năng của chatgpt web gốc
- [x] chatgpt web hỗ trợ API key tùy chỉnh, base_url
- [x] Midjourney sinh hình từ văn bản
- [x] Midjourney vẽ từ hình + văn bản
- [X] Midjourney biến hình từ U1 đến U4, V1 đến V4, và các thao tác vẽ lại khác
- [X] Midjourney hỗ trợ vẽ lại từng phần
- [X] Midjourney hỗ trợ zoom 1.5x, 2x
- [X] Midjourney hỗ trợ HD 2x, HD 4x
- [X] Midjourney hỗ trợ mở rộng trái, phải, trên, dưới
- [X] Midjourney hỗ trợ cả hai giao diện [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) và [midjourney-proxy-plus](https://github.com/litter-coder/midjourney-proxy-plus)
- [X] Midjourney sinh văn từ hình ảnh
- [X] Sử dụng localforage để lưu trữ hình ảnh cục bộ
- [X] Hỗ trợ các robot khác nhau của Midjourney và Niji
- [X] Hỗ trợ [InsightFace thay thế khuôn mặt](https://discord.com/api/oauth2/authorize?client_id=1090660574196674713&permissions=274877945856&scope=bot)
- [X] Midjourney trộn hình ảnh
- [X] Midjourney lấy seed
- [X] Dall-e-3 vẽ hình ảnh
- [X] Chatgpt chọn mô hình ở giao diện trước
- [X] Chatgpt hỗ trợ mô hình tùy chỉnh, số lượng đối thoại theo ngữ cảnh, số lượng trả lời
- [X] Chatgpt hỗ trợ tải ảnh để sử dụng GPT-4-Vision-Preview
- [X] Chatgpt hỗ trợ tải lên file backend (dành cho các mô hình GPT-4-All, GPT-4-Gizmo-XXX)! Mặc định là tắt, mở cần biến môi trường API_UPLOADER=1
- [X] Chatgpt hỗ trợ mô hình đảo ngược GPT-4-All, GPT-4-V, GPT-4-Gizmo-(gizmo_id)
- [X] Chatgpt hỗ trợ chuyển đổi mô hình liên kết https://vercel.ddaiai.com/#/m/gpt-4-all https://vercel.ddaiai.com/#/m/gpt-4-gizmo-g-2fkFE8rbu
- [X] Hỗ trợ chuyển đổi mô hình liên kết thử nghiệm của ChatGPT https://chat.openai.com/g/g-2fkFE8rbu sửa thành https://vercel.ddaiai.com/#/g/g-2fkFE8rbu
- [X] Chatgpt hỗ trợ GPTs đa modal
- [X] Chatgpt hỗ trợ tts whisper
- [X] Nhận diện giọng nói ngay lập tức (Nhận diện giọng nói sẵn có của trình duyệt ASR) `v2.15.7` trở lên
- [X] Hỗ trợ thay đổi thiết lập liên kết, phù hợp với `one-api`, `new-api` triển khai chat https://vercel.ddaiai.com/#/s/t?OPENAI_API_BASE_URL=https://abc.com&OPENAI_API_KEY=sk-xxxxx&MJ_SERVER=https://abc.com&MJ_API_SECRET=sk-xxx&UPLOADER_URL=
- [X] Hỗ trợ triển khai chat `one-api`, `new-api` https://vercel.ddaiai.com/#/?settings={%22key%22:%22sk-abc%22,%22url%22:%22https://www.abc.com%22} `(v.2.14.3)`

## Cài đặt trên máy cá nhân - không máy chủ
> - [x] Vui lòng tải phiên bản mới nhất từ https://github.com/Dooy/chatgpt-web-midjourney-proxy/releases (chọn phiên bản phù hợp với hệ điều hành của bạn)
> - [x] Chọn một nhà cung cấp dịch vụ trung chuyển phù hợp (Tốt nhất là hỗ trợ `gpt`, `gpts`, `midjourney`, `claude`, `suno`)
> - [x] Nhà cung cấp dịch vụ trung chuyển đề xuất https://www.openai-hk.com với một `key` và `địa chỉ API` hỗ trợ cùng lúc `gpt`, `midjourney`, `claude`, `suno`, mj-fast thấp nhất chỉ 0.12rmb/hình ảnh
![đa modal](./docs/suno-ds.jpg)

## Vercel triển khai một lần nhấn

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dooy/chatgpt-web-midjourney-proxy&env=OPENAI_API_BASE_URL&env=OPENAI_API_KEY&env=MJ_SERVER&env=MJ_API_SECRET&project-name=chatgpt-web-midjourney-proxy&repository-name=chatgpt-web-midjourney-proxy)

## Biến môi trường env

| Biến môi trường | Mô tả | Giá trị mặc định | triển khai docker| triển khai vercel|
| --- | --- | --- | --- | --- |
| OPENAI_API_BASE_URL | Địa chỉ API OpenAI | https://api.openai.com | ✅ |  ✅|
| OPENAI_API_KEY | Khóa API OpenAI |  sk-xxxxx | ✅ |  ✅|
| OPENAI_API_MODEL |  Mô hình mặc định | gpt-3.5-turbo  | ✅ |  ✅|
| MJ_SERVER |  Địa chỉ giao diện proxy mj  |[tham khảo cài đặt](https://github.com/novicezk/midjourney-proxy) | ✅ |  ✅|
| MJ_API_SECRET |  mj proxy | Trống  | ✅ |  ✅|
| SUNO_SERVER |  Địa chỉ API SUNO  | [tham khảo cài đặt](https://github.com/SunoAI-API/Suno-API) | ✅ |  ✅|
| SUNO_KEY |  Khóa API SUNO | Trống  | ✅ |  ✅|
| AUTH_SECRET_KEY |  Mật khẩu truy cập | Không có  | ✅ |   x|
| API_UPLOADER |  Hỗ trợ tải lên | Tắt  | ✅ |  x|
| HIDE_SERVER |  Ẩn server trong giao diện trước |    | ✅ |  x|
| CUSTOM_MODELS |  Mô hình tùy chỉnh | Không có  | ✅ |  ✅|
| TJ_BAIDU_ID |  ID thống kê Baidu | Không có  | ✅ |  ✅|
| TJ_GOOGLE_ID |  ID thống kê Google | Không có  | ✅ |  ✅|
| SYS_NOTIFY |  Thông báo hệ thống, hỗ trợ HTML | Không có  | ✅ |  ✅|
| DISABLE_GPT4 |  Vô hiệu hóa GPT-4 | Không có  | ✅ |  ✅|
| GPT_URL | URL GPT tùy chỉnh =/gpts.json  | Không có hoặc liên kết ngoài của bạn | ✅ |  ✅|
| UPLOAD_IMG_SIZE | Kích thước tải lên ảnh gpt4v |  1 | ✅ |  ✅|
| SYS_THEME | Chủ đề mặc định `light` hoặc `dark`  | dark | ✅ |  ✅|
| MJ_IMG_WSRV | Có bật `wsrv` làm máy chủ hình ảnh không  | Không (tắt)  | ✅ |  ✅|
| AUTH_SECRET_ERROR_COUNT | Số lần xác minh lỗi để tránh brute force NGINX xin vui lòng thiết lập `proxy_set_header X-Forwarded-For $remote_addr`  | Không có  | ✅ |  x|
| AUTH_SECRET_ERROR_TIME | Thời gian dừng lại khi xác minh lỗi đơn vị phút  | Không có  | ✅ |  x|
| CLOSE_MD_PREVIEW | Có tắt xem trước đầu vào không | Không có  | ✅ |  ✅|
| UPLOAD_TYPE | Chỉ định cách tải lên [`R2` tải lên R2] [`API` trung chuyển UI] [`Container` container cục bộ] [`MyUrl` liên kết tùy chỉnh]  |  Trống

 | ✅ |  x|
| MENU_DISABLE  | Menu vô hiệu hóa tùy chọn: gpts, draws, gallery, music |  Trống | ✅ |  ✅|
| VISION_MODEL  | Mô hình nhận diện mặc định tùy chọn: `gpt-4o`, `gpt-4-turb`, `gpt-4-vision-preview` |  Trống | ✅ |  ✅|
| SYSTEM_MESSAGE  | Tin nhắn nhân vật mặc định tùy chỉnh |  Trống | ✅ |  ✅|
| CUSTOM_VISION_MODELS  | Mô hình nhận diện tùy chỉnh cách nhau bởi dấu phẩy |  Trống | ✅ |  ✅|

  

## Triển khai docker

> - [x] Cần [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) hỗ trợ
> - [x] Cần [Suno-API](https://github.com/SunoAI-API/Suno-API) hỗ trợ

```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://your-mj-server:6013  \
-e MJ_API_SECRET=your-mj-api-secret  \
-e SUNO_SERVER=https://your-suno-server:8000  \
-e SUNO_KEY=you-suno-key  ydlhero/chatgpt-web-midjourney-proxy
```
Truy cập http://ip:6015 

**Tải lên tệp:**
```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e MJ_API_SECRET=abc123456  ydlhero/chatgpt-web-midjourney-proxy
```
Nếu thiết lập UI trước OPENAI_API_KEY OPENAI_API_BASE_URL; tải lên hình ảnh sẽ theo OPENAI_API_BASE_URL
```shell
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/path/to/file" http://OPENAI_API_BASE_URL/v1/upload
```
Kết quả trả về
```json
{
"url":"https://xxxxxxx.jpg"
}
```

### API midjourney-proxy triển khai docker
Tham khảo thêm tại [midjourney-proxy](https://github.com/novicezk/midjourney-proxy)
```bash
docker run -d --name mj6013  -p 6013:8080  \
-e mj.discord.guild-id=ID dịch vụ discord  \
-e mj.discord.channel-id=ID nhóm dịch vụ discord  \
-e mj.queue.timeout-minutes=6 \
-e mj.api-secret=abc123456 \
-e mj.discord.user-token=**********  \
--restart=always novicezk/midjourney-proxy:2.5.5
```

## Hình ảnh thêm

### API key và base_url tùy chỉnh ở giao diện trước:
![base_url](./docs/gptbase.jpg)

### GPTS GTP Store
![đa modal](./docs/gpts.jpg)
![đa modal](./docs/gpts1.jpg)

### Sản xuất âm nhạc Suno
![suno](./docs/suno.jpg)

### Ghi âm whisper và tts
![whisper--tts](./docs/tts-whisper.png)

### Vẽ lại từng phần:
[![Vẽ lại từng phần](./docs/mj2.jpg)](./docs/mj2.jpg)

### Thay đổi khuôn mặt
![Thay đổi khuôn mặt](./docs/mj2a2.jpg)

### Trộn hình ảnh
![Trộn hình ảnh](./docs/mj2a3.jpg)

### Hỗ trợ tải lên hình ảnh cho gpt-4-vision-preview
![Trộn hình ảnh](./docs/mj4a1.png)
Trên điện thoại:
<div style="display: flex; flex-wrap: wrap">
 <img src="./docs/mjs1.jpg" style="width:200px" >
 <img src="./docs/mjs2.jpg"  style="width:200px">
 <img src="./docs/mjs3.jpg"  style="width:200px">
</div>


## Tải lên tệp hỗ trợ lưu trữ cloudflare r2

- Lưu trữ cloudflare r2 10 GB/tháng miễn phí https://www.cloudflare.com/zh-cn/developer-platform/r2/
- Tài liệu cấu hình tham khảo https://zhuanlan.zhihu.com/p/658058503
- Vercel không hỗ trợ lưu trữ r2
```yml
R2_DOMAIN=
R2_BUCKET_NAME=
R2_ACCOUNT_ID=
R2_KEY_ID=
R2_KEY_SECRET=
```
## Ưu tiên yêu cầu máy chủ tệp
R2> Thiết lập dịch vụ tệp UI phía trước > Dịch vụ tệp backend > theo trung chuyển
## Thiết lập xác minh tránh brute force

![Xác minh tránh brute force](./docs/check_error.jpg)
- [x] Vercel không hỗ trợ; chỉ hỗ trợ triển khai docker
- [x] Nếu đằng trước gắn `nginx` vui lòng cấu hình `proxy_set_header X-Forwarded-For $remote_addr;`
- [x] Các tham số như sau: lỗi xác minh 3 lần, chỉ có thể xác minh lại sau 10 phút
```yml
# Secret key chú ý: Chỉ có chữ cái tiếng Anh + số
AUTH_SECRET_KEY=my888god
# Brute force: số lần xác minh lỗi chú ý: số ；nginx vui lòng thiết lập proxy_set_header X-Forwarded-For $remote_addr;
AUTH_SECRET_ERROR_COUNT=3
# Brute force: thời gian dừng lại đơn vị phút chú ý: là số
AUTH_SECRET_ERROR_TIME=10
```
- [x] Kịch bản như sau
```shell
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e MJ_API_SECRET=abc123456 \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e AUTH_SECRET_KEY=mật khẩu tiếng Anh của bạn -e AUTH_SECRET_ERROR_COUNT=3 \
-e AUTH_SECRET_ERROR_TIME=10 ydlhero/chatgpt-web-midjourney-proxy
```
- 
## License
MIT © [Dooy](./license)

## Khác
Nếu bạn thấy dự án này hữu ích, hãy giúp tôi bằng cách đánh giá sao hoặc ủng hộ chúng tôi

[![Star History Chart](https://api.star-history.com/svg?repos=Dooy/chatgpt-web-midjourney-proxy&type=Date)](https://star-history.com/#Dooy/chatgpt-web-midjourney-proxy&Date)

## Ủng hộ
Nếu mã nguồn mở của tôi hữu ích với bạn, vui lòng xem xét ủng hộ qua bất kỳ phương thức nào sau đây:
<br> `Ghi chú liên hệ của bạn trên thanh toán`
<div style="display: flex; flex-wrap: wrap">
    <div style="width:200px">
        <img src="./docs/wxpay.jpg"  style="width:200px">
        <div>Ủng hộ WeChat</div>
    </div>
    <div style="width:200px">
        <img src="./docs/alipay.jpg"  style="width:200px"> 
        <div>Ủng hộ Alipay</div>
    </div>
</div>