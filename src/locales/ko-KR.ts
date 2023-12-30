export default {
  common: {
    add: '추가',
    addSuccess: '추가 성공',
    edit: '편집',
    editSuccess: '편집 성공',
    delete: '삭제',
    deleteSuccess: '삭제 성공',
    save: '저장',
    saveSuccess: '저장 성공',
    reset: '초기화',
    action: '액션',
    export: '내보내기',
    exportSuccess: '내보내기 성공',
    import: '가져오기',
    importSuccess: '가져오기 성공',
    clear: '비우기',
    clearSuccess: '비우기 성공',
    yes: '예',
    no: '아니오',
    confirm: '확인',
    download: '다운로드',
    noData: '데이터 없음',
    wrong: '문제가 발생했습니다. 나중에 다시 시도하십시오.',
    success: '성공',
    failed: '실패',
    verify: '검증',
    unauthorizedTips: '인증되지 않았습니다. 먼저 확인하십시오.',
    stopResponding: '응답 중지',
  },
  chat: {
    newChatButton: '새로운 채팅',
    //placeholder: '무엇이든 물어보세요...(Shift + Enter = 줄바꿈, "/"를 눌러서 힌트를 보세요)',
    placeholder: '할 말을 입력하거나 스크린샷을 붙여넣거나 파일을 드래그 앤 드롭할 수 있습니다.',
    placeholderMobile: '무엇이든 물어보세요...',
    copy: '복사',
    copied: '복사됨',
    copyCode: '코드 복사',
    clearChat: '채팅 비우기',
    clearChatConfirm: '이 채팅을 비우시겠습니까?',
    exportImage: '이미지 내보내기',
    exportImageConfirm: '이 채팅을 png로 내보내시겠습니까?',
    exportSuccess: '내보내기 성공',
    exportFailed: '내보내기 실패',
    usingContext: '컨텍스트 모드',
    turnOnContext: '현재 모드에서는 이전 대화 기록을 포함하여 메시지를 보낼 수 있습니다.',
    turnOffContext: '현재 모드에서는 이전 대화 기록을 포함하지 않고 메시지를 보낼 수 있습니다.',
    deleteMessage: '메시지 삭제',
    deleteMessageConfirm: '이 메시지를 삭제하시겠습니까?',
    deleteHistoryConfirm: '이 기록을 삭제하시겠습니까?',
    clearHistoryConfirm: '채팅 기록을 삭제하시겠습니까?',
    preview: '미리보기',
    showRawText: '원본 텍스트로 보기',
  },
  setting: {
    setting: '설정',
    general: '일반',
    advanced: '고급',
    config: '설정',
    avatarLink: '아바타 링크',
    name: '이름',
    description: '설명',
    role: '역할',
    temperature: '온도',
    top_p: 'Top_p',
    resetUserInfo: '사용자 정보 초기화',
    chatHistory: '채팅 기록',
    theme: '테마',
    language: '언어',
    api: 'API',
    reverseProxy: '리버스 프록시',
    timeout: '타임아웃',
    socks: 'Socks',
    httpsProxy: 'HTTPS 프록시',
    balance: 'API 잔액',
    monthlyUsage: '월 사용량',
  },
  store: {
    siderButton: '프롬프트 저장소',
    local: '로컬',
    online: '온라인',
    title: '제목',
    description: '설명',
    clearStoreConfirm: '데이터를 삭제하시겠습니까?',
    importPlaceholder: '여기에 JSON 데이터를 붙여넣으십시오',
    addRepeatTitleTips: '제목 중복됨, 다시 입력하십시오',
    addRepeatContentTips: '내용 중복됨: {msg}, 다시 입력하십시오',
    editRepeatTitleTips: '제목 충돌, 수정하십시오',
    editRepeatContentTips: '내용 충돌 {msg} , 수정하십시오',
    importError: '키 값 불일치',
    importRepeatTitle: '제목이 반복되어 건너뜀: {msg}',
    importRepeatContent: '내용이 반복되어 건너뜀: {msg}',
    onlineImportWarning: '참고: JSON 파일 소스를 확인하십시오!',
  },

  "mj": {
    "setOpen": "OpenAI 관련",
    "setOpenPlaceholder": "http(s)://를 포함해야 함"
    ,"setOpenUrl": "OpenAI 인터페이스 주소"
    ,"setOpenKeyPlaceholder": "비밀번호 액세스 제한을 우회하기 위해 사용자 지정 OpenAI 키 사용"
    ,"setMj": "Midjourney 관련"
    ,"setMjUrl": "Midjourney 인터페이스 주소:"
    ,"setMjKeyPlaceholder": "비밀번호 액세스 제한을 우회하기 위해 사용자 지정 Api Secret 사용"
    ,"setUploader": "업로드 관련"
    ,"setUploaderUrl": "업로드 주소:"
    ,"setBtSave": "저장"
    ,"setBtBack": "기본으로 복원"
  },
  "mjset": {
    "server": "서버"
    ,"about": "소개"
    ,"model": "모델"
    ,"sysname": "AI 그림"
  },
  "mjtab": {
    "chat": "대화"
    ,"draw": "그림"
    ,"drawinfo": "AI 그림 Midjourney 엔진"
    ,"gallery": "갤러리"
    ,"galleryInfo": "내 갤러리"
  },
  "mjchat": {
    "loading": "이미지 로드 중"
    ,"openurl": "직접 링크 열기"
    ,"failReason": "실패 이유:"
    ,"reload": "재로드"
    ,"progress": "진행:"
    ,"wait": "작업이 제출되었습니다. 기다려주세요..."
    ,"reroll": "재그림"
    ,"wait2": "작업 {id}이(가) 제출되었습니다. 기다려주세요"
    ,"redrawEditing": "일부 재그림 편집"
    ,"face": "얼굴 바꾸기"
    ,"blend": "혼합"
    ,"draw": "그림 그리기"
    ,"submiting": "제출 중"
    ,"submit": "제출"
    ,"wait3": "닫지 마세요! 이미지 생성 중..."
    ,"success": "저장 성공"
    ,"successTitle": "성공"
    ,"modlePlaceholder": "여러 개의 사용자 정의 모델은 띄어쓰기로 구분됩니다. 필수 사항은 아닙니다."
    ,"myModle": "내 모델"
    ,"historyCnt": "컨텍스트 수"
    ,"historyToken": "더 많은 컨텍스트는 기억을 더 정확하게 만들지만 더 많은 크레딧을 소비할 수 있습니다."
    ,"historyTCnt": "답장 수"
    ,"historyTCntInfo": "답장 수가 많을수록 더 많은 크레딧이 소비될 수 있습니다."
    ,"role": "역할 설정"
    ,"rolePlaceholder": "대화에 고유한 역할을 설정하십시오. 필수는 아닙니다."
    ,"loading2": "로딩 중..."
    ,"loadmore": "더 보기"
    ,"nofind": "찾을 수 없음"
    ,"nofind2": "관련 내용을 찾을 수 없습니다. 다음을 시도해 보십시오."
    ,"success2": "전환 성공!"
    ,"modelChange": "모델 변경"
    ,"search": "검색"
    ,"searchPlaceholder": "GPTs 이름, 소개"
    ,"attr": "첨부 파일"
    ,"noproduct": "갤러리에 작품이 없습니다."
    ,"myGallery": "내 갤러리"
    ,"yourHead": "당신의 프로필 사진"
    ,"your2Head": "스타 이미지"
    ,"tipInfo": "설명：<li>1. 이미지에는 얼굴이 반드시 포함되어야 합니다. 그렇지 않으면 이미지가 생성되지 않습니다.</li> <li>2. '스타 이미지'는 먼저 MJ 그림으로 만들 수 있습니다.</li> <li>3. '스타 이미지'는 애니메이션 이미지로도 괜찮습니다.</li> <li>4. '당신의 프로필 사진'은 1인치 개인 사진을 사용하는 것이 좋습니다.</li>"
    ,"placeInput": "힌트를 입력하세요!"
    ,"more5sb": "최대 5장의 이미지를 업로드할 수 있습니다."
    ,"exSuccess": "내보내기 성공... 다운로드 창을 확인하세요."
    ,"downloadSave": "ai그림.txt"
    ,"noproducet": "아직 미완성 작품이 없습니다."
    ,"imgBili": "이미지 비율"
    ,"imagEx": "작품 이미지 링크 내보내기"
    ,"prompt": "힌트"
    ,"imgCYes": "쿠션 이미지 포함"
    ,"imgCUpload": "자체 쿠션 이미지 업로드"
    ,"imgCInfo": "쿠션 이미지 안내：<br/> 1. 쿠션 이미지는 자체 이미지를 기본으로 사용하여 MJ로 그림을 그릴 수 있습니다.<br/> 2. 최대 5 장의 쿠션 이미지를 사용할 수 있으며 각 이미지의 크기는 1M를 초과하지 않아야 합니다.<br/>"
    ,"imgCadd": "+추가"
    ,"del": "삭제"
    ,"img2text": "이미지에서 텍스트 생성"
    ,"img2textinfo": "힌트가 어떻게 쓰여야 할지 모르겠나요? 이미지에서 텍스트를 생성해 보세요! <br/>이미지를 제출하면 힌트가 생성됩니다."
    ,"traning": "번역 중..."
    ,"imgcreate": "이미지 생성"
    ,"imginfo": "기타 매개변수：<li>1 --no를 무시하면 --no car가 이미지에 표시되지 않습니다.</li><li>2 --seed는 먼저 시드를 얻을 수 있습니다. --seed 123456</li> <li>3 --chaos 10은 혼합(범위: 0-100)</li> <li>4 --tile 조각화</li>"
    ,"tStyle": "스타일"
    ,"tView": "시점"
    ,"tShot": "캐릭터 샷"
    ,"tLight": "조명"
    ,"tQuality": "화질"
    ,"tStyles": "아트 정도"
    ,"tVersion": "모델 버전"
    ,"dalleInfo": "설명：<li>1. DALL-E는 OpenAI에서 제공하는 그림 모델입니다.</li>  <li>2. OpenAI의 이미지는 일시적입니다. 백업을 잘 해 두세요.</li>   <li>3. 주의: 1790px 이미지의 가격은 두 배입니다.</li> "
    ,"version": "버전"
    ,"size": "크기"
    ,"blendInfo": "설명：<li>1. 최소 2 장의 이미지를 합성하십시오.</li> <li>2. 최대 6 장의 이미지를 업로드할 수 있습니다.</li> "
    ,"blendStart": "합성 시작"
    ,"no2add": "이미지를 중복해서 추가하지 마십시오."
    ,"add2more": "두 장 이상의 이미지를 추가하십시오."
    ,"no1m": "이미지 크기는 1M를 초과할 수 없습니다."
    ,"imgExt": "이미지는 jpg, gif, png, jpeg 형식만 지원됩니다."
  }
}
