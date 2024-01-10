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
    ,historyTCntInfo:'回复数越大 ,越有可能消耗更多的额度'
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
    ,imginfo:'其他参数：  <li>1 --no 忽略 --no car 图中不出现车 </li><li>2 --seed 可先获取种子 --seed 123456 </li> <li>3 --chaos 10 混合(范围：0-100)</li> <li>4 --tile 碎片化 </li> '
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
    ,no1m:'图片大小不能超过1M'
    ,imgExt:'图片仅支持jpg,gif,png,jpeg格式'
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
  }
}
