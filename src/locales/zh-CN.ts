export default {
  common: {
    add: '添加',
    addSuccess: '添加成功',
    edit: '编辑',
    editSuccess: '编辑成功',
    delete: '删除',
    deleteSuccess: '删除成功',
    save: '保存',
    saveSuccess: '保存成功',
    reset: '重置',
    action: '操作',
    export: '导出',
    exportSuccess: '导出成功',
    import: '导入',
    importSuccess: '导入成功',
    clear: '清空',
    clearSuccess: '清空成功',
    yes: '是',
    no: '否',
    confirm: '确定',
    download: '下载',
    noData: '暂无数据',
    wrong: '好像出错了，请稍后再试。',
    success: '操作成功',
    failed: '操作失败',
    verify: '验证',
    unauthorizedTips: '未经授权，请先进行验证。',
    stopResponding: '停止响应',
  },
  chat: {
    newChatButton: '新建聊天',
    //placeholder: '来说点什么吧...（Shift + Enter = 换行，"/" 触发提示词）',
    placeholder: '可输入说点什么，也可贴截图或拖拽文件（Shift + Enter = 换行，"/" 触发提示词）',
    placeholderMobile: '来说点什么...',
    copy: '复制',
    copied: '复制成功',
    copyCode: '复制代码',
    clearChat: '清空会话',
    clearChatConfirm: '是否清空会话?',
    exportImage: '保存会话到图片',
    exportImageConfirm: '是否将会话保存为图片?',
    exportSuccess: '保存成功',
    exportFailed: '保存失败',
    usingContext: '上下文模式',
    turnOnContext: '当前模式下, 发送消息会携带之前的聊天记录',
    turnOffContext: '当前模式下, 发送消息不会携带之前的聊天记录',
    deleteMessage: '删除消息',
    deleteMessageConfirm: '是否删除此消息?',
    deleteHistoryConfirm: '确定删除此记录?',
    clearHistoryConfirm: '确定清空记录?',
    preview: '预览',
    showRawText: '显示原文',
  },
  setting: {
    setting: '设置',
    general: '总览',
    advanced: '高级',
    config: '配置',
    avatarLink: '头像链接',
    name: '名称',
    description: '描述',
    backgroundImage: '背景图片',
    role: '角色设定',
    temperature: 'Temperature',
    top_p: 'Top_p',
    resetUserInfo: '重置用户信息',
    chatHistory: '聊天记录',
    theme: '主题',
    language: '语言',
    api: 'API',
    reverseProxy: '反向代理',
    timeout: '超时',
    socks: 'Socks',
    httpsProxy: 'HTTPS Proxy',
    balance: 'API余额',
    monthlyUsage: '本月使用量',
  },
  store: {
    siderButton: '提示词商店',
    local: '本地',
    online: '在线',
    title: '标题',
    description: '描述',
    clearStoreConfirm: '是否清空数据？',
    importPlaceholder: '请粘贴 JSON 数据到此处',
    addRepeatTitleTips: '标题重复，请重新输入',
    addRepeatContentTips: '内容重复：{msg}，请重新输入',
    editRepeatTitleTips: '标题冲突，请重新修改',
    editRepeatContentTips: '内容冲突{msg} ，请重新修改',
    importError: '键值不匹配',
    importRepeatTitle: '标题重复跳过：{msg}',
    importRepeatContent: '内容重复跳过：{msg}',
    onlineImportWarning: '注意：请检查 JSON 文件来源！',
    downloadError: '请检查网络状态与 JSON 文件有效性',
  },


  mjset:{
    server:'服务端'
    ,about:'关于'
    ,model:'模型'
    ,sysname:'AI绘图'
  }

  ,mjtab:{
    chat:'对话'
    ,draw:'绘画'
    ,drawinfo:'AI绘画 Midjourney引擎'
    ,gallery:'画廊'
    ,galleryInfo:'我的画廊'
  }
  ,mjchat:{
    loading:'正在载入图片'
    ,openurl:'直接打开链接'
    ,failReason:'失败原因：'
    ,reload:'重新获取'
    ,progress:'进度：'
    ,wait:'任务已经提交请等待...'
    ,reroll:'重绘'
    ,wait2:'任务 {id} 已经提交请等待'
    ,redrawEditing:'局部重绘编辑'
    ,face:'换脸'
    ,blend:'混图'
    ,draw:'绘图'
    ,submiting:'提交中'
    ,submit:'提交'
    ,wait3:'请勿关闭! 图片生成中...'
    ,success:'保存成功'
    ,successTitle:'成功'
    ,modlePlaceholder:'自定义模型多个用空格隔开，不是必须'
    ,myModle:'自定义模型'
    ,historyCnt:'上下文数量'
    ,historyToken:'更多的上下文会使记忆更精确，但会消耗更多的额度'
    ,historyTCnt:'回复数'
    ,historyTCntInfo:'(max_tokens)回复数越大 ,越有可能消耗更多的额度'
    ,modelMaxTokens: '模型支持的最大额度'
    ,modelMaxTokensInfo: '模型支持的最大额度'
    ,role:'角色设定'
    ,rolePlaceholder:'给你的会话设置一个专属的角色，不是必须'
    ,loading2:'正在加载...'
    ,loadmore:'加载更多'
    ,nofind:'未能找到'
    ,nofind2:'相关内容, 你可尝试以下内容'
    ,success2:'切换成功！'
    ,modelChange:'模型切换'
    ,search:'搜索'
    ,searchPlaceholder:'GPTs名字、介绍'
    ,attr:'附件'
    ,noproduct:'画廊还没有您的作品'
    ,myGallery:'我的画廊'
    ,yourHead:'你的头像'
    ,your2Head:'明星图'
    ,tipInfo:'说明：<li>1 图片都必须包含脸，否则出不来图</li> <li>2 “明星图”可以先用mj绘画制作出来</li> <li>3 “明星图”其实动漫图也行</li> <li>4 “你的头像”建议用一寸个人照</li>'
    ,placeInput: '请填写提示词！'
    ,more5sb: '最多上传5张图片'
    ,exSuccess: '导出成功... 请看下载栏'
    ,downloadSave: "ai绘画.txt"
    ,noproducet: "暂时没成熟作品"
    ,imgBili:'图片比例'
    ,imagEx:'作品图片链接导出'
    ,prompt:'提示词'
    ,imgCYes:'含有垫图'
    ,imgCUpload:'自传垫图'
    ,imgCInfo:'垫图说明：<br/> 1.垫图可使用自己的图片作为基础，让MJ来绘图<br/> 2.可以使用多张垫图 最多5张， 单张图片不超过1M<br/>'
    ,imgCadd:'+添加'
    ,del:'删除'
    ,img2text:'图生文'
    ,img2textinfo:'不知如何写提示词？用图生文试试！<br/>提交图片，出提示词'
    ,traning:'翻译中...'
    ,imgcreate:'生成图片'
    ,imginfo:'其他参数：  <li>1 --no 忽略 --no car 图中不出现车 </li><li>2 --seed 可先获取种子 --seed 123456 </li> <li>3 --chaos 10 混合(范围：0-100)</li> <li>4 --tile 碎片化 </li>  <li>5 --cw 0 只参考五官, 100 参考五官、头发、服装等  </li>'
    ,tStyle:'风格'
    ,tView:'视角'
    ,tShot:'人物镜头'
    ,tLight:'灯光'
    ,tQuality:'画质'
    ,tStyles:'艺术程度'
    ,tVersion:'模型版本'
    ,dalleInfo:' 说明：   <li>1 dall-e 是openAi提供的画图模型</li>  <li>2 openAi的图片有时效性，请做好备份</li>   <li>3 注意：1790px的图片价格是双倍</li> '
    ,version:'版本'
    ,size:'尺寸'
    ,blendInfo:'说明： <li>1 合成至少2张图片</li> <li>2 最多可传6张图</li> '
    ,blendStart:'开始合成'
    ,no2add:'请勿重复添加图片'
    ,add2more:'请添加两张以上图片'
    ,no1m:'图片大小不能超过{m}M'
    ,imgExt:'图片仅支持jpg,gif,png,jpeg格式'
    ,setSync:'同步Midjourney、Suno设置'

    ,addGPTS:'新增GPTs'
    ,addPlaceholder:'将GPTs的gid贴这儿 也可直接贴gpts的链接'
    ,gidError:'未找到有效的gid，请重新填写'
    ,success3:'新增GPTs成功！'

  },
  mj:{
    setOpen:'OpenAI 相关',
    setOpenPlaceholder:'必须包含 http(s)://'
    ,setOpenUrl:'OpenAI接口地址'
    ,setOpenKeyPlaceholder:'使用自定义 OpenAI Key 绕过密码访问限制'
    ,setMj:'Midjourney 相关'
    ,setMjUrl:'Midjourney接口地址:'
    ,setMjKeyPlaceholder:'使用自定义 Api Secret 绕过密码访问限制'
    ,setUploader:'上传相关'
    ,setUploaderUrl:'上传地址:'
    ,setBtSave:'保存'
    ,setBtBack:'恢复默认'

    ,
    redraw:'局部重绘'
    ,fail1:'客官不要太急嘛，正在加载呢'
    ,success1:'图片刷新成功！'
    ,high_variation:'强变化'
    ,low_variation:'弱变化'
    ,p15:'变焦1.5倍'
    ,p20:'变焦2倍'
    ,p100:'方正'

    ,retry:'重分析'
    ,pan_left:'向左'
    ,pan_right:'向右'
    ,pan_up:'向上'
    ,pan_down:'向下'
    ,up2:'高清2倍'
    ,up4:'高清4倍',

    thinking:'思考中...'
    ,noReUpload:'不能重复上传'
    ,uploading:'上传中...'
    ,uploadSuccess:'上传成功'
    ,uploadFail:'上传失败:'
    ,upPdf:'<span>上传图片、附件<br/>能上传图片、PDF、EXCEL等文档</span><p>支持拖拽</p>'
    ,upImg:'<span><b>上传图片</b><br/>会自动调用 gpt-4-vision-preview 模型<br>注意：会有额外的图片费用<br/>格式: jpeg jpg png gif</span><p>支持拖拽</p> <p class="pt-2"><b>上传MP3 MP4</b> <br>会自动直接调用 whisper-1 模型<br>格式有：mp3 mp4 mpeg mpga m4a wav webm</p>'
    ,clearAll:'清参数'
    ,czoom:'自定义'
    ,customTitle:'自定义变焦'
    ,zoominfo:'修改zoom值,范围在 1.0~2.0 默认设置为1.8',

    modleSuccess:'模型加载成功'
    ,setingSuccess:'设置成功'

    ,tokenInfo1:'剩余Tokens = 模型长度 - 角色设定 - 上下文(会话历史) - 回复数 - 当前输入'
    ,tokenInfo2:'角色设定留空，系统会给一个默认的'
    ,noSuppertModel:'刷新，暂不支持此模型！'
    ,failOcr:'识别失败'
    ,remain:'剩:'

    ,totalUsage:'订阅总额'
    ,disableGpt4:'已禁用GPT4'
    ,setTextInfo:'OpenAi Api Key 错误，点击这里重新'

    ,attr1:'附'
    ,ulink:'原图链接'
    ,copyFail:'复制失败'
    ,tts:'TTS 文本转语音'
    ,fail:'发生错误'
    ,noSupperChrom:'浏览器不支持！'
    ,lang:'语音'
    ,ttsLoading:'语音转化...'
    ,ttsSuccess:'转化成功'
    ,micIng:'正在录音，说点什么...'
    ,mStart:'开始'
    ,mPause:'暂停'
    ,mGoon:'继续'
    ,mRecord:'重录'
    ,mPlay:'播放'
    ,mCanel:'取消'
    ,mSent:'发送'

    ,findVersion:'发现更新版本'
    ,yesLastVersion:'已是最新版本'
    ,infoStar:'此项目开源于 <a  class="text-blue-600 dark:text-blue-500" href="https://github.com/Dooy/chatgpt-web-midjourney-proxy" target="_blank"> GitHub </a>，免费且基于 MIT 协议，没有任何形式的付费行为！ </p><p>如果你觉得此项目对你有帮助，请在 GitHub 帮我点个 Star，谢谢！'
    ,setBtSaveChat:'仅保存会话'
    ,setBtSaveSys: '保存至系统'

    ,wsrvClose:'关闭 wsrv'
    ,wsrvOpen:'开启 wsrv'

    ,temperature:'随机性'
    ,temperatureInfo:'(temperature)值越大，回复越随机'
    ,top_p:'核采样'
    ,top_pInfo:'(top_p)与随机性类似，但不要和随机性一起更改 '
    ,presence_penalty:'话题新鲜度  '
    ,presence_penaltyInfo:'(presence_penalty)值越大，越有可能扩展到新话题'
    ,frequency_penalty:'频率惩罚度'
    ,frequency_penaltyInfo:' (frequency_penalty)值越大，越有可能降低重复字词'

    ,tts_voice:'TTS 语音人物'
    ,typing:'正在输入'

    ,authErro:'授权失败'
    ,authBt:'请重新输入授权访问密码'

    ,micWhisper:'Whisper语音识别'
    ,micAsr:'即时识别'
    ,micRec:'开始录音,请说话！2秒内无声音将自动关闭'
    ,micRecEnd:'录音已结束'

    ,subtle:'高清2倍'
    ,creative:'高清2倍.创意'
    ,gpt_gx:'GPTs用g-*'

    ,ideoabout:'Ideogram 相关'
    ,ideoserver:'Ideogram 接口地址'
    ,ideokeyPlaceholder:'Ideogram 的API Key 可不填'
    ,ideopls:'图片描述 提示词'
    ,nohead:'不含'

    ,klingabout:'可灵 相关'
    ,klingserver:'可灵 接口地址'
    ,klingkeyPlaceholder:'可灵 的API Key 可不填'
    ,klingkey:'可灵 Key'
    ,mode:'模式'
    ,duration:'时长'
    ,negative_prompt:'不含物体的文字放这儿'
    ,std:'高性能'
    ,pro:'高表现'
    ,needImg:'请传参考图才生效！'
    ,seed:'种子数字 1~2147483647'
    ,klingInfo:'说明： <li>1. 高表现是3.5倍的价格</li>  <li>2. 10s是2倍的价格</li> <li>3. 尾帧必须有参考图片才生效</li> <li>4. v1.5 v1.6的价格都是v1.0的2倍</li>'

    ,camera_type:'镜头'
    ,cnull:'智能匹配'
    ,down_back: '下移拉远'
    ,forward_up: '推进上移'
    ,right_turn_forward: '右旋推进'
    ,left_turn_forward: '左旋推进'

    ,kling:'可灵'

    ,rttab:'语音'
    ,rtinfo:'实时语音对话服务(realtime)'
    ,rtsetting:'请设置服务端，目前Realtime 仅支持远程服务；需本地服务请联系作者'
    ,rjcloded:'连接已断开'
    ,checkkey:'请检查 api key 是否正确'
    ,rtsuccess:'连接正常保持通话'
    ,rtservererror:'websocket 连接服务器错误！'
    ,rtservererror2:'不支持录音，可能是设备原因！'
    ,rtconecting:'正在连接服务器'

    ,confirmDelete:'确认要删除？'
    ,pikaabout:'Pika 相关'
    ,pikaserver:'Pika 接口地址'
    ,pikakeyPlaceholder:'Pika 的API Key 可不填'
    ,createFail:'生成失败'
    ,selecteff:'参考效果'

    ,udioabout:'Udio 相关'
    ,udiokeyPlaceholder:'Udio 的API Key 可不填'
    ,udioserver:'Udio 接口地址'
    ,ud_prompt:'提示词'
    ,ud_prompt_pls:'提示词: 描述、曲风'
    ,ud_ly_write:'自定义歌词'
    ,ud_ly_auto:'智能歌词'
    ,ud_ly_null:'纯音乐'
    ,ud_v32:'实惠'
    ,ud_v130:'时间长'
    ,ud_info:'注意：<ul><li>1.udio-32 时长短</li><li>2.udio-130 价格是udio-32的2倍 </li><li>3.提示词内可以放风格、描述等</li></ul>'
    ,ud_fail:"这首歌生成失败！"
    ,ud_doing:"生成中无法播放"
    ,ud_continuation:"后扩展"
    ,ud_precede:"前扩展"

    ,upImg2:'<span><b>上传图片</b><br/>该模型支持识图<br>注意：会有额外的图片费用<br/>格式: jpeg jpg png gif</span><p>支持拖拽</p> <p class="pt-2"><b>上传MP3 MP4</b> <br>会自动直接调用 whisper-1 模型<br>格式有：mp3 mp4 mpeg mpga m4a wav webm</p>'
    ,rml_info:'注意：<ul><li>1.必须带图</li><li>2.模型只有一个 gen3a_turbo </li><li>3.10s的价格是5s的双倍</li></ul>'
    ,rml_heng:'横屏'
    ,rml_shu:'竖屏'

    ,pixabout:'Pixverse 相关'
    ,pixkeyPlaceholder:'Pixverse 的API Key 可不填'
    ,pixserver:'Pixverse 接口地址'
    ,pixinfo:' 说明：<br>  <ul> <li>1.以v3.5 360p 时长5s 模式 Normal 为基数</li><li>2.v2.5 是 0.5倍</li>  <li>3.时长8s 是 2倍</li> <li>4.540P 1.5倍 720P 2倍 1080P 4倍</li> <li>5.模式 performance 2倍</li> <li>6.倍数是相乘的 比如 720P 时长8s 那就是 2*2是4倍，如果再加performance 就是8倍</li></ul>'
  
   ,server_load:'服务端获取'
   ,model_select:'模型选择'
  },

	draw: {
		qualityList: {
			general: "一般",
			clear: "清晰",
			hd: "高清",
			ultraHd: "超高清",
		},
		styleList: {
			cyberpunk: "赛博朋克",
			star: "星际",
			anime: "动漫",
			japaneseComicsManga: "日本漫画",
			inkWashPaintingStyle: "水墨画风格",
			original: "原创",
			landscape: "风景画",
			illustration: "插画",
			manga: "漫画",
			modernOrganic: "现代自然",
			genesis: "创世纪",
			posterstyle: "海报风格",
			surrealism: "超现实主义",
			sketch: "素描",
			realism: "写实",
			watercolorPainting: "水彩画",
			cubism: "立体主义",
			blackAndWhite: "黑白",
			fmPhotography: "胶片摄影风格",
			cinematic: "电影化",
			clearFacialFeatures: "清晰的面部特征",
		},
		viewList: {
			wideView: "宽视角",
			birdView: "鸟瞰视角",
			topView: "顶视角",
			upview: "仰视角",
			frontView: "正面视角",
			headshot: "头部特写",
			ultrawideshot: "超广角视角",
			mediumShot: "中景",
			longShot: "远景",
			depthOfField: "景深",
		},
		shotList: {
			faceShot: "脸部特写",
			bigCloseUp: "大特写",
			closeUp: "特写",
			waistShot: "腰部以上",
			kneeShot: "膝盖以上",
			fullLengthShot: "全身照",
			extraLongShot: "极远景",
		},
		stylesList: {
			styleLow: "低强度风格",
			styleMed: "中等强度风格",
			styleHigh: "高强度风格",
			styleVeryHigh: "非常高强度风格",
		},
		lightList: {
			coldLight: "冷光",
			warmLight: "暖光",
			hardLighting: "硬光",
			dramaticLight: "戏剧性光线",
			reflectionLight: "反射光",
			mistyFoggy: "薄雾",
			naturalLight: "自然光",
			sunLight: "阳光",
			moody: "情绪化",
		},
		versionList: {
			mjV6: "MJ V6",
			mjV61: "MJ V6.1",
			mjV52: "MJ V5.2",
			mjV51: "MJ V5.1",
			nijiV6: "Niji V6",
			nijiV5: "Niji V5",
			nijiV4: "Niji V4",
			nijiJourney: "Niji Journey",
		},
		botList: {
			midjourneyBot: "Midjourney 机器人",
			nijiJourney: "Niji Journey",
		},
		dimensionsList: {
			square: "正方形 (1:1)",
			portrait: "肖像 (2:3)",
			landscape: "风景 (3:2)",
		},
	}

  ,suno:{
    description:"描述模式"
    ,custom:"定制模式"
    ,style:'歌曲风格'
    ,stylepls:'歌曲名称比如:流行音乐'
    ,emputy:'暂无内容'
    ,noly:'无歌词'
    ,inputly:'请输入歌曲名称或歌词'
    ,doingly:"正在执行请稍后."
    ,doingly2: "正在获取歌词..."
    ,title:'歌曲名称'
    ,titlepls:'歌曲名称比如:假期'
    ,desc:'歌曲描述'
    ,descpls:'歌曲描述 比如:关于假期的原声流行音乐'
    ,noneedly:'无需歌词'
    ,rank:'随机获取'
    ,ly:'歌词'
    ,lypls:'歌词:有一定的格式'
    ,generate:'创作歌曲'
    ,generately:'生成歌词'
    ,nodata:'请先创作才有歌曲列表'

    ,menu:'音乐'
    ,menuinfo:'Suno、Udio等音乐创作'
    ,server:'Suno 接口地址'
    ,serverabout:'Suno 相关'
    ,setOpenKeyPlaceholder:'Suno API 的相关KEY；可不填'

    ,upMps:'上传音频'
    ,extend:'延伸'
    ,extendFrom:'延伸于'
    ,extendAt:'延伸开始于'
    ,fail:'失败'
    ,info:'说明:<br>上传音频时长必须在6s-60s内'
    ,lyricsFail:'获取歌曲失败'
  }
  ,video:{
    menu:"视频",
    menuinfo:'Luma等 视频创作',
    descpls:'视频创作描述',
    lumaabout:"Luma 相关",
    lumaserver:"Luma 接口地址",
    setOpenKeyPlaceholder:'Luma API 的key, 可不填',
    generate:'生成视频',
    nodata:'暂无可用视频，请先生成！',
    selectimg:'参考图片',
    clear:'清除',
    plsInput:'请输入内容！',
    submitSuccess:'已提交成功！',
    process:'视频生成中...',
    repeat:'重新获取',
    pending:'状态:队列中',
    processing:'状态:生产中',
    failed:'状态:生成失败！',
    download:'下载',
    extend:'延展',

    lumainfo:'说明：<ul><li >1.relax版已下线，<b style="color:red">入口已经更换到pro无水印版</b></li><li>2.无水印版本需要通过“下载按钮”得到下载链接</li><li>3.pro得到的链接有时限；请及时保存mp4文件到本地</li><li>4.请在生成后的30分钟内；将mp4保存到本地，渠道号也可能被封或者下线</li> <li>5.当下载链接无效时会给出带水印的视频链接</li></ul>',
    runwayabout:'Runway 相关',
    runwayserver:'Runway 接口地址',
    setOpenKeyPlaceholder2:'Runway API 的key, 可不填',
    endImg:'尾帧图',
    runwayinfo:'说明：<ul><li>1. Runway 图片与视频都有有效期</li>  <li>2. 请在生成视频后30分钟内将mp4保存到本地</li>  <li>3. 过期重新获取，可能存在账号下线而获取失败</li><li>4. Gen3A Turbo 必须带图或者视频</li><li>5. 参考可以是图或者视频mp4 </li></ul>',
    nosup:'暂不支持',
    rwgen2:'版本: Gen-2, 价格实惠',
    rwgen3:'版本: Gen-3 Alpha',
    rwgen3fast:'版本: Gen-3 Alpha Fast',
    repeat2:'过期.重新获取',

    rwgen3turbo:'版本: Gen-3 Alpha Turbo',
    gen3a_turbo_img:'Gen-3 Alpha Turbo 必须带图',

  }
  ,dance:{
    menu:"舞蹈",
    menuinfo:'Viggle等 舞蹈视频创作'
    ,character:'人物角色'
    ,viggleabout:"Viggle 相关",
    viggleserver:"Viggle 接口地址",
    setOpenKeyPlaceholder:'Viggle API 的key, 可不填',
    info:'说明:<br>1.角色图片最好是个人全身照片<br>2.舞蹈模版视频最好是个人视频 别传群舞',
    model:'模型',
    bgw:'白色背景',
    bgg:'绿色背景',
    bgmoban:'模版背景',
    bgrole:'角色背景',
    gring:'生成中...',
    uprolefirst:'请先上传角色图片',
    uprolefail:'上传失败',
    upvideo:'+上传模版舞蹈视频',
    usevideo:'+使用官网模版',
    moban:'舞蹈模版',
    moban2:'模版名称',
    use:'使用',
  }


}
