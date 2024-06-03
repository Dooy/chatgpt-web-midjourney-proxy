# ChatGPT Web Midjourney Proxy
💡**Заявление**
- Этот проект опубликован только на GitHub, основан на лицензии MIT, бесплатен и предназначен для использования в качестве учебного ресурса с открытым исходным кодом. Не предусмотрены никакие формы продажи аккаунтов, платных услуг, обсуждательных групп и т.д. Остерегайтесь мошенничества.
- Этот проект создан на основе [ChenZhaoYu](https://github.com/Chanzhaoyu/chatgpt-web); используется midjourney API, предоставляемый [midjourney-proxy](https://github.com/novicezk/midjourney-proxy), и [Suno-API](https://github.com/SunoAI-API/Suno-API) в качестве backend.

![cover](./docs/mj2a1.jpg)
## Поддерживаемые функции
- [x] Поддержка отдельного модуля suno, регулировка текста песни, изменение стиля музыки
- [x] Все функции оригинального chatgpt web
- [x] Chatgpt web поддерживает настраиваемый api key и base_url
- [x] Midjourney генерация изображений по тексту
- [x] Midjourney создание изображений по тексту и изображению
- [X] Midjourney U1-U4, V1-V4, перерисовка и другие действия
- [X] Midjourney поддержка частичной перерисовки
- [X] Midjourney поддержка увеличения в 1.5 раза, в 2 раза
- [X] Midjourney поддержка 2x HD, 4x HD
- [X] Midjourney поддержка изменения влево, вправо, вверх, вниз
- [X] Midjourney поддержка [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) и [midjourney-proxy-plus](https://github.com/litter-coder/midjourney-proxy-plus)
- [X] Midjourney генерация текста по изображению
- [X] Локальное хранение изображений с использованием localforage
- [X] Поддержка различных ботов midjourney, niji
- [X] Поддержка [InsightFace замена лица](https://discord.com/api/oauth2/authorize?client_id=1090660574196674713&permissions=274877945856&scope=bot)
- [X] Midjourney смешивание изображений
- [X] Midjourney получение seed
- [X] DALL-E-3 генерация изображений
- [X] Выбор модели на frontend chatgpt
- [X] Поддержка пользовательских моделей, количества контекстных диалогов, количества ответов на frontend chatgpt
- [X] Поддержка загрузки изображений для gpt-4-vision-preview
- [X] Поддержка загрузки файлов на backend (для моделей gpt-4-all, gpt-4-gizmo-xxx). По умолчанию отключено, для включения требуется переменная окружения API_UPLOADER=1
- [X] Поддержка обратных моделей gpt-4-all, gpt-4-v, gpt-4-gizmo-(gizmo_id)
- [X] Поддержка переключения гиперссылок на модели https://vercel.ddaiai.com/#/m/gpt-4-all, https://vercel.ddaiai.com/#/m/gpt-4-gizmo-g-2fkFE8rbu
- [X] Поддержка переключения гиперссылок на модели ChatGPT https://chat.openai.com/g/g-2fkFE8rbu на https://vercel.ddaiai.com/#/g/g-2fkFE8rbu
- [X] Поддержка ChatGPT с несколькими модальностями GPTs
- [X] Поддержка tts whisper
- [X] Мгновенное распознавание речи (ASR браузера) `v2.15.7` и выше
- [X] Поддержка изменения настроек гиперссылок, подходящих для деплоя `one-api`, `new-api` чата https://vercel.ddaiai.com/#/s/t?OPENAI_API_BASE_URL=https://abc.com&OPENAI_API_KEY=sk-xxxxx&MJ_SERVER=https://abc.com&MJ_API_SECRET=sk-xxx&UPLOADER_URL=
- [X] Поддержка деплоя `one-api`, `new-api` чата https://vercel.ddaiai.com/#/?settings={%22key%22:%22sk-abc%22,%22url%22:%22https://www.abc.com%22} `(v.2.14.3)`

## Установка на рабочем столе без сервера
> - [x] Перейдите по ссылке https://github.com/Dooy/chatgpt-web-midjourney-proxy/releases и скачайте последнюю версию (выберите версию, подходящую для вашей операционной системы)
> - [x] Выберите подходящего провайдера прокси-сервера (лучше всего, чтобы он поддерживал `gpt`, `gpts`, `midjourney`, `claude`, `suno`)
> - [x] Рекомендуемый провайдер прокси-сервера https://www.openai-hk.com, один `key` и `api интерфейс`, поддерживающий одновременно `gpt`, `midjourney`, `claude`, `suno`, mj-fast от 0.12rmb/изображение
![многомодальность](./docs/suno-ds.jpg)

## Однократное развертывание Vercel

[![Развернуть с Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dooy/chatgpt-web-midjourney-proxy&env=OPENAI_API_BASE_URL&env=OPENAI_API_KEY&env=MJ_SERVER&env=MJ_API_SECRET&project-name=chatgpt-web-midjourney-proxy&repository-name=chatgpt-web-midjourney-proxy)

## Переменные окружения

| Переменная окружения | Описание | Значение по умолчанию | docker и другие развертывания | развертывание vercel |
| --- | --- | --- | --- | --- |
| OPENAI_API_BASE_URL | Адрес OpenAI API | https://api.openai.com | ✅ |  ✅ |
| OPENAI_API_KEY | Ключ OpenAI API | sk-xxxxx | ✅ |  ✅ |
| OPENAI_API_MODEL | Модель по умолчанию | gpt-3.5-turbo | ✅ |  ✅ |
| MJ_SERVER | Адрес midjourney proxy API | [Инструкция по установке](https://github.com/novicezk/midjourney-proxy) | ✅ |  ✅ |
| MJ_API_SECRET | Секретный ключ midjourney proxy | пусто | ✅ |  ✅ |
| SUNO_SERVER | Адрес SUNO API | [Инструкция по установке](https://github.com/SunoAI-API/Suno-API) | ✅ |  ✅ |
| SUNO_KEY | Ключ SUNO API | пусто | ✅ |  ✅ |
| AUTH_SECRET_KEY | Пароль для доступа | нет | ✅ |   x |
| API_UPLOADER | Поддержка загрузки | отключено | ✅ |  x |
| HIDE_SERVER | Скрыть сервер в интерфейсе | нет | ✅ |  x |
| CUSTOM_MODELS | Настраиваемые модели | нет | ✅ |  ✅ |
| TJ_BAIDU_ID | ID статистики Baidu | нет | ✅ |  ✅ |
| TJ_GOOGLE_ID | ID статистики Google | нет | ✅ |  ✅ |
| SYS_NOTIFY | Системные уведомления, поддержка HTML | нет | ✅ |  ✅ |
| DISABLE_GPT4 | Отключить GPT-4 | нет | ✅ |  ✅ |
| GPT_URL | URL для кастомных моделей GPT | нет | ✅ |  ✅ |
| UPLOAD_IMG_SIZE | Максимальный размер загружаемого изображения для gpt4v | 1 | ✅ |  ✅ |
| SYS_THEME | Тема по умолчанию `light` или `dark` | dark | ✅ |  ✅ |
| MJ_IMG_WSRV | Включить wsrv для изображений | нет | ✅ |  ✅ |
| AUTH_SECRET_ERROR_COUNT | Количество попыток для защиты от перебора паролей | нет | ✅ |  x |
| AUTH_SECRET_ERROR_TIME | Время блокировки при защите от перебора паролей (в минутах) | нет | ✅ |  x |
| CLOSE_MD_PREVIEW | Отключить предпросмотр Markdown | нет | ✅ |  ✅ |
| UPLOAD_TYPE | Метод загрузки: [`R2` R2 загрузка], [`API` через frontend UI], [`Container` локальное], [`MyUrl` кастомный URL] | пусто | ✅ |  x |
| MENU_DISABLE  | Отключение меню: gpts,draws,gallery,music | пусто | ✅ |  ✅ |
| VISION_MODEL  | Модель для распознавания изображений: `gpt-4o`, `gpt-4-turb`, `gpt-4-vision-preview` | пусто | ✅ | 

 ✅ |
| SYSTEM_MESSAGE  | Кастомное сообщение по умолчанию | пусто | ✅ |  ✅ |
| CUSTOM_VISION_MODELS  | Кастомные модели для распознавания изображений, разделенные запятыми | пусто | ✅ |  ✅ |

## Развертывание с помощью Docker

> - [x] Требуется поддержка [midjourney-proxy](https://github.com/novicezk/midjourney-proxy)
> - [x] Требуется поддержка [Suno-API](https://github.com/SunoAI-API/Suno-API)

```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://your-mj-server:6013  \
-e MJ_API_SECRET=your-mj-api-secret  \
-e SUNO_SERVER=https://your-suno-server:8000  \
-e SUNO_KEY=you-suno-key  ydlhero/chatgpt-web-midjourney-proxy
```
Доступ по адресу http://ip:6015

**Загрузка файлов**:
```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e MJ_API_SECRET=abc123456  ydlhero/chatgpt-web-midjourney-proxy
```
Если в интерфейсе установлены OPENAI_API_KEY и OPENAI_API_BASE_URL; загрузка изображений будет следовать за OPENAI_API_BASE_URL
```shell
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/path/to/file" http://OPENAI_API_BASE_URL/v1/upload
```
Возвращаемый формат
```json
{
"url":"https://xxxxxxx.jpg"
}
```

### Развертывание midjourney-proxy API через Docker
Дополнительные инструкции смотрите на [midjourney-proxy](https://github.com/novicezk/midjourney-proxy)
```bash
docker run -d --name mj6013  -p 6013:8080  \
-e mj.discord.guild-id=ID сервера discord  \
-e mj.discord.channel-id=ID канала discord   \
-e mj.queue.timeout-minutes=6 \
-e mj.api-secret=abc123456 \
-e mj.discord.user-token=**********  \
--restart=always novicezk/midjourney-proxy:2.5.5
```

## Дополнительные примеры

### Кастомный api key и base_url для сервера:
![base_url](./docs/gptbase.jpg)

### GPTS  GTP Store 
![многомодальность](./docs/gpts.jpg)
![многомодальность](./docs/gpts1.jpg)

### Создание музыки с помощью suno
![suno](./docs/suno.jpg)

### Запись и tts whisper
![whisper--tts](./docs/tts-whisper.png)

### Частичная перерисовка:
[![Частичная перерисовка](./docs/mj2.jpg)](./docs/mj2.jpg)

### Замена лица
![Замена лица](./docs/mj2a2.jpg)

### Смешивание изображений
![Смешивание изображений](./docs/mj2a3.jpg)

### Загрузка изображений для gpt-4-vision-preview
![Загрузка изображений](./docs/mj4a1.png)
На мобильных устройствах:
<div style="display: flex; flex-wrap: wrap">
 <img src="./docs/mjs1.jpg" style="width:200px" >
 <img src="./docs/mjs2.jpg"  style="width:200px">
 <img src="./docs/mjs3.jpg"  style="width:200px">
</div>

## Загрузка файлов с поддержкой cloudflare r2

- cloudflare r2 до 10 ГБ в месяц бесплатно https://www.cloudflare.com/zh-cn/developer-platform/r2/
- Инструкции по настройке https://zhuanlan.zhihu.com/p/658058503
- Vercel не поддерживает r2
```yml
R2_DOMAIN=
R2_BUCKET_NAME=
R2_ACCOUNT_ID=
R2_KEY_ID=
R2_KEY_SECRET=
```
## Приоритет запросов на файловый сервер
R2> Настройки файлового сервера в UI> Сервис backend > прокси
## Защита от перебора паролей

![Защита от перебора паролей](./docs/check_error.jpg)
- [x] Vercel не поддерживает; поддержка только для развертывания Docker
- [x] Если используется nginx, настройте `proxy_set_header   X-Forwarded-For  $remote_addr;`
- [x] Пример настроек: 3 попытки, блокировка на 10 минут
```yml
# Секретный ключ: только латиница и цифры
AUTH_SECRET_KEY=my888god
# Защита от перебора: количество попыток
AUTH_SECRET_ERROR_COUNT=3
# Защита от перебора: время блокировки в минутах
AUTH_SECRET_ERROR_TIME=10
```
- [x] Пример скрипта
```shell
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e MJ_API_SECRET=abc123456 \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e AUTH_SECRET_KEY=ваш_секретный_ключ -e AUTH_SECRET_ERROR_COUNT=3 \
-e AUTH_SECRET_ERROR_TIME=10 ydlhero/chatgpt-web-midjourney-proxy
```

## Лицензия
MIT © [Dooy](./license)

## Прочее
Если вы считаете, что этот проект был вам полезен, пожалуйста, поставьте звезду или сделайте пожертвование

[![Star History Chart](https://api.star-history.com/svg?repos=Dooy/chatgpt-web-midjourney-proxy&type=Date)](https://star-history.com/#Dooy/chatgpt-web-midjourney-proxy&Date)

## Пожертвования
Если мои проекты с открытым исходным кодом помогли вам, пожалуйста, рассмотрите возможность сделать пожертвование:
<br> `Укажите ваши контактные данные в примечании к платежу`
<div style="display: flex; flex-wrap: wrap">
    <div style="width:200px">
        <img src="./docs/wxpay.jpg"  style="width:200px">
        <div>Пожертвование через WeChat</div>
    </div>
    <div style="width:200px">
        <img src="./docs/alipay.jpg"  style="width:200px"> 
        <div>Пожертвование через Alipay</div>
    </div>
</div>