# HOBA AI TOOLBOX
💡**Déclaration**
- Ce projet n'est publié que sur GitHub, sous licence MIT, gratuit et destiné à un usage d'apprentissage open source. Il n'y aura aucune vente de comptes, service payant, groupe de discussion, etc. Soyez vigilant face aux arnaques.
- Ce projet open source est basé sur [ChenZhaoYu](https://github.com/Chanzhaoyu/chatgpt-web) et utilise l'API midjourney de [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) et [Suno-API](https://github.com/SunoAI-API/Suno-API) comme backend.


![couverture](./docs/mj2a1.jpg)
## Fonctionnalités prises en charge 
- [x] Prise en charge du module Suno, ajustement des paroles et du style musical
- [x] Toutes les fonctionnalités de chatgpt web
- [x] chatgpt web prend en charge la personnalisation de l'API key et de base_url
- [x] Création d'images par texte avec midjourney
- [x] Image de base + création d'images par texte avec midjourney
- [X] Opérations de variation (U1 à U4, V1 à V4, redessiner) avec midjourney
- [X] Redessin partiel avec midjourney
- [X] Zoom 1,5x et 2x avec midjourney
- [X] Haute définition 2x et 4x avec midjourney
- [X] Extension à gauche, droite, haut et bas avec midjourney
- [X] Prise en charge des interfaces [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) et [midjourney-proxy-plus](https://github.com/litter-coder/midjourney-proxy-plus) avec midjourney
- [X] Création de texte par image avec midjourney
- [X] Stockage local des images avec localforage
- [X] Prise en charge des robots midjourney et niji
- [X] Prise en charge du remplacement de visage [InsightFace](https://discord.com/api/oauth2/authorize?client_id=1090660574196674713&permissions=274877945856&scope=bot)
- [X] Mélange d'images avec midjourney
- [X] Obtention de seed avec midjourney
- [X] Création d'images avec dall-e-3
- [X] Sélection de modèle en frontend avec chatgpt
- [X] Prise en charge de la personnalisation des modèles, du nombre de dialogues et de réponses en frontend avec chatgpt
- [X] Prise en charge du téléchargement d'images pour gpt-4-vision-preview avec chatgpt
- [X] Prise en charge du téléchargement de fichiers en backend pour les modèles gpt-4-all, gpt-4-gizmo-xxx (désactivé par défaut, activation par variable d'environnement API_UPLOADER=1)
- [X] Prise en charge des modèles inversés gpt-4-all, gpt-4-v, gpt-4-gizmo-(gizmo_id) avec chatgpt
- [X] Prise en charge du changement de modèle par lien hypertexte https://vercel.ddaiai.com/#/m/gpt-4-all https://vercel.ddaiai.com/#/m/gpt-4-gizmo-g-2fkFE8rbu
- [X] Prise en charge du changement de modèle par lien hypertexte pour ChatGPT https://chat.openai.com/g/g-2fkFE8rbu modifié en https://vercel.ddaiai.com/#/g/g-2fkFE8rbu
- [X] Prise en charge des modèles multi-modaux GPTs avec chatgpt
- [X] Prise en charge de tts whisper avec chatgpt
- [X] Reconnaissance vocale instantanée (ASR intégré au navigateur) à partir de la version `v2.15.7`
- [X] Prise en charge de la modification des paramètres par lien hypertexte, adapté pour les déploiements `one-api` et `new-api` de chat https://vercel.ddaiai.com/#/s/t?OPENAI_API_BASE_URL=https://abc.com&OPENAI_API_KEY=sk-xxxxx&MJ_SERVER=https://abc.com&MJ_API_SECRET=sk-xxx&UPLOADER_URL=
- [X] Prise en charge des déploiements de chat `one-api` et `new-api` https://vercel.ddaiai.com/#/?settings={%22key%22:%22sk-abc%22,%22url%22:%22https://www.abc.com%22} `(v.2.14.3)`

## Installation sur ordinateur personnel sans serveur
> - [x] Téléchargez la dernière version sur https://github.com/Dooy/chatgpt-web-midjourney-proxy/releases (choisissez la version adaptée à votre système d'exploitation)
> - [x] Choisissez un service de relais approprié (de préférence supportant `gpt`, `gpts`, `midjourney`, `claude`, `suno`)
> - [x] Service de relais recommandé https://www.openai-hk.com, un `key` et une `adresse d'interface API` supportant simultanément `gpt`, `midjourney`, `claude`, `suno`, avec un coût minimum de 0,12 RMB par image pour mj-fast
![multi-modale](./docs/suno-ds.jpg)

## Déploiement en un clic sur Vercel

[![Déployer avec Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dooy/chatgpt-web-midjourney-proxy&env=OPENAI_API_BASE_URL&env=OPENAI_API_KEY&env=MJ_SERVER&env=MJ_API_SECRET&project-name=chatgpt-web-midjourney-proxy&repository-name=chatgpt-web-midjourney-proxy)

## Variables d'environnement (env)

| Variable d'environnement | Description | Valeur par défaut | Déploiement docker | Déploiement vercel |
| --- | --- | --- | --- | --- |
| OPENAI_API_BASE_URL | Adresse de l'interface API OpenAI | https://api.openai.com | ✅ |  ✅|
| OPENAI_API_KEY | Clé API OpenAI |  sk-xxxxx | ✅ |  ✅|
| OPENAI_API_MODEL |  Modèle par défaut | gpt-3.5-turbo  | ✅ |  ✅|
| MJ_SERVER |  Adresse de l'interface mj proxy  |[Référence d'installation](https://github.com/novicezk/midjourney-proxy) | ✅ |  ✅|
| MJ_API_SECRET |  Secret API mj proxy | vide  | ✅ |  ✅|
| SUNO_SERVER |  Adresse de l'interface API SUNO  | [Référence d'installation](https://github.com/SunoAI-API/Suno-API) | ✅ |  ✅|
| SUNO_KEY |  Clé API SUNO | vide  | ✅ |  ✅|
| AUTH_SECRET_KEY |  Mot de passe d'accès autorisé | Aucun  | ✅ |   x|
| API_UPLOADER |  Support de téléchargement | Désactivé  | ✅ |  x|
| HIDE_SERVER |  Masquer le serveur dans l'interface utilisateur |    | ✅ |  x|
| CUSTOM_MODELS |  Modèles personnalisés disponibles | Aucun  | ✅ |  ✅|
| TJ_BAIDU_ID |  ID de statistiques Baidu | Aucun  | ✅ |  ✅|
| TJ_GOOGLE_ID |  ID de statistiques Google | Aucun  | ✅ |  ✅|
| SYS_NOTIFY |  Notification système, supporte HTML | Aucun  | ✅ |  ✅|
| DISABLE_GPT4 |  Désactiver GPT-4 | Aucun  | ✅ |  ✅|
| GPT_URL | URL personnalisée GPT_URL=/gpts.json  | Aucune ou lien externe personnalisé | ✅ |  ✅|
| UPLOAD_IMG_SIZE | Taille de l'image uploadée pour gpt4v |  1 | ✅ |  ✅|
| SYS_THEME | Thème par défaut `light` ou `dark`  | dark | ✅ |  ✅|
| MJ_IMG_WSRV | Activer le stockage d'images `wsrv`  | Aucun (désactivé)  | ✅ |  ✅|
| AUTH_SECRET_ERROR_COUNT | Vérification anti-brute-force : Nombre de tentatives de vérification, NGINX doit définir `proxy_set_header X-Forwarded-For $remote_addr`  | Aucun  | ✅ |  x|
| AUTH_SECRET_ERROR_TIME | Vérification anti-brute-force : Temps d'attente en minutes  | Aucun  | ✅ |  x|
| CLOSE_MD_PREVIEW | Désactiver l'aperçu en entrée | Aucun  | ✅ |  ✅|
| UPLOAD_TYPE | Type de téléchargement spécifié [`R2` pour R2] [`API` via l'interface utilisateur] [`Container` pour le stockage local] [`MyUrl` pour un lien personnalisé]  |  vide | ✅ |  x|
| MENU_DISABLE  | Désactiver des menus sélectionnés : gpts, draws, gallery, music

 |  vide | ✅ |  ✅|
| VISION_MODEL  | Modèle de reconnaissance par défaut : `gpt-4o`, `gpt-4-turb`, `gpt-4-vision-preview`, etc. |  vide | ✅ |  ✅|
| SYSTEM_MESSAGE  | Message de rôle par défaut personnalisé |  vide | ✅ |  ✅|
| CUSTOM_VISION_MODELS  | Modèles de vision personnalisés, séparés par des virgules |  vide | ✅ |  ✅|

## Déploiement docker
 
> - [x] Nécessite [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) 
> - [x] Nécessite [Suno-API](https://github.com/SunoAI-API/Suno-API) 

```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://your-mj-server:6013  \
-e MJ_API_SECRET=your-mj-api-secret  \
-e SUNO_SERVER=https://your-suno-server:8000  \
-e SUNO_KEY=you-suno-key  ydlhero/chatgpt-web-midjourney-proxy
```
Accédez à http://ip:6015 

**Téléchargement de fichiers**: 
```bash
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e MJ_API_SECRET=abc123456  ydlhero/chatgpt-web-midjourney-proxy
```
Si la configuration de l'interface utilisateur FRONT-END est OPENAI_API_KEY et OPENAI_API_BASE_URL; le téléchargement d'images suivra également OPENAI_API_BASE_URL.
```shell
curl -X POST -H "Content-Type: multipart/form-data" -F "file=@/path/to/file" http://OPENAI_API_BASE_URL/v1/upload
```
Réponse formatée
```json
{
"url":"https://xxxxxxx.jpg"
}
```

### Déploiement de l'API midjourney-proxy avec docker
Référez-vous à [midjourney-proxy](https://github.com/novicezk/midjourney-proxy) pour plus de détails
```bash
docker run -d --name mj6013  -p 6013:8080  \
-e mj.discord.guild-id=ID du serveur discord  \
-e mj.discord.channel-id=ID du groupe discord   \
-e mj.queue.timeout-minutes=6 \
-e mj.api-secret=abc123456 \
-e mj.discord.user-token=**********  \
--restart=always novicezk/midjourney-proxy:2.5.5
```


## Plus d'exemples

### API key et base_url personnalisés en serveur:
![base_url](./docs/gptbase.jpg)

### GPTS  GTP Store 
![multi-modale](./docs/gpts.jpg)
![multi-modale](./docs/gpts1.jpg)

### Création musicale avec suno
![suno](./docs/suno.jpg)


### Enregistrement whisper et tts
![whisper--tts](./docs/tts-whisper.png)

### Redessin partiel:
[![redessin partiel](./docs/mj2.jpg)](./docs/mj2.jpg)

### Remplacement de visage
![remplacement de visage](./docs/mj2a2.jpg)

### Mélange d'images
![mélange d'images](./docs/mj2a3.jpg)

### Prise en charge du téléchargement d'images pour gpt-4-vision-preview
![gpt-4-vision-preview](./docs/mj4a1.png)
Mobile:
<div style="display: flex; flex-wrap: wrap">
 <img src="./docs/mjs1.jpg" style="width:200px" >
 <img src="./docs/mjs2.jpg"  style="width:200px">
 <img src="./docs/mjs3.jpg"  style="width:200px">
</div>


## Téléchargement de fichiers avec stockage cloudflare r2

- Stockage gratuit jusqu'à 10 Go/mois avec cloudflare r2 https://www.cloudflare.com/zh-cn/developer-platform/r2/
- Documentation de configuration https://zhuanlan.zhihu.com/p/658058503
- Vercel ne supporte pas le stockage r2
```yml
R2_DOMAIN=
R2_BUCKET_NAME=
R2_ACCOUNT_ID=
R2_KEY_ID=
R2_KEY_SECRET=
```
## Ordre de priorité des demandes au serveur de fichiers
R2 > Configuration de l'interface utilisateur > Serveur de fichiers backend > Relais
## Paramètres de vérification anti-brute-force

![anti-brute-force](./docs/check_error.jpg)
- [x] Vercel ne supporte pas ; uniquement supporté pour les déploiements Docker
- [x] Si nginx est utilisé en amont, configurez `proxy_set_header X-Forwarded-For $remote_addr;`
- [x] Paramètres : 3 tentatives, vérification possible après 10 minutes
```yml
# Clé secrète : utilisez uniquement des lettres et des chiffres
AUTH_SECRET_KEY=my888god
# anti-brute-force : nombre de tentatives. Pour nginx, configurez proxy_set_header X-Forwarded-For $remote_addr;
AUTH_SECRET_ERROR_COUNT=3
# anti-brute-force : temps d'attente en minutes
AUTH_SECRET_ERROR_TIME=10
```
- [x] Script
```shell
docker run --name chatgpt-web-midjourney-proxy  -d -p 6015:3002 \
-e OPENAI_API_KEY=sk-xxxxx \
-e OPENAI_API_BASE_URL=https://api.openai.com  \
-e MJ_SERVER=https://172.17.0.1:6013  \
-e MJ_API_SECRET=abc123456 \
-e API_UPLOADER=1  -v /data/uploads:/app/uploads \
-e AUTH_SECRET_KEY=mot-de-passe -e AUTH_SECRET_ERROR_COUNT=3 \
-e AUTH_SECRET_ERROR_TIME=10 ydlhero/chatgpt-web-midjourney-proxy
```

## Licence
MIT © [Dooy](./license)

## Autre
Si vous trouvez ce projet utile, veuillez nous soutenir en mettant une étoile ou en faisant un don.

[![Star History Chart](https://api.star-history.com/svg?repos=Dooy/chatgpt-web-midjourney-proxy&type=Date)](https://star-history.com/#Dooy/chatgpt-web-midjourney-proxy&Date)

## Donation
Si mon projet open source vous a été utile, veuillez envisager de faire un don via l'une des méthodes suivantes :
<br> `Mentionnez vos coordonnées dans la note de paiement`
<div style="display: flex; flex-wrap: wrap">
    <div style="width:200px">
        <img src="./docs/wxpay.jpg"  style="width:200px">
        <div>Don via WeChat</div>
    </div>
    <div style="width:200px">
        <img src="./docs/alipay.jpg"  style="width:200px"> 
        <div>Don via Alipay</div>
    </div>
</div>