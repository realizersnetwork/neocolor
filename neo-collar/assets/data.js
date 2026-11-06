/*
 * NEO-COLLAR 데이터 (한국어 ko · 영어 en · 일본어 ja)
 * - 글자를 바꿀 때는 ko/en/ja 세 언어를 함께 고친다
 * - 강의·공종을 추가하면 메뉴·목록·검색에 자동 반영된다
 * - gov: 국비지원(내일배움카드) 예정 / diy: '내 집은 내가 고친다' 줄 / knowhow: '남한테 묻기 애매했던 노하우' 줄
 * - level: beginner(입문) | pro(실무) | expert(고급: 경력자용 노하우)
 * - format: online(온라인) | hybrid(온라인+연계 실습) | practice(연계 실습)
 * - 강의는 입문자만 보는 게 아니다. 경력 많은 소장·기공도 하자·누수·단가·클레임 같은 노하우를 배우러 온다
 * - 인력사무소 구인·구직·실습 목록은 정식 오픈 전 '예시'다 (실제 공고 아님)
 */
window.NEO = {
  /* ---------- 공종 카테고리 ---------- */
  categories: [
    {
      id: "manage", color: "#2f6bff",
      name: { ko: "공정·현장관리", en: "Site Management", ja: "工程・現場管理" },
      desc: { ko: "착공부터 준공까지, 공정 순서와 발주 타이밍", en: "From groundbreaking to handover: work order and ordering timing", ja: "着工から竣工まで、工程の順序と発注のタイミング" },
      subs: [
        { id: "schedule", name: { ko: "공정관리", en: "Scheduling", ja: "工程管理" } },
        { id: "order", name: { ko: "발주·실측", en: "Ordering & Measuring", ja: "発注・実測" } },
        { id: "utility", name: { ko: "인입·협의", en: "Utilities & Permits", ja: "引込・協議" } },
        { id: "handover", name: { ko: "준공 체크", en: "Handover Checks", ja: "竣工チェック" } }
      ],
      tools: [
        { ko: "줄자", en: "Tape measure", ja: "メジャー" },
        { ko: "레이저 거리측정기", en: "Laser distance meter", ja: "レーザー距離計" },
        { ko: "공정표", en: "Schedule chart", ja: "工程表" },
        { ko: "현장 일지", en: "Site log", ja: "現場日誌" }
      ],
      certs: []
    },
    {
      id: "civil", color: "#a8733c",
      name: { ko: "철거·토목", en: "Demolition & Civil", ja: "解体・土木" },
      desc: { ko: "현장의 첫 단추, 철거·측량·기초", en: "The first step on site: demolition, surveying, foundations", ja: "現場の第一歩、解体・測量・基礎" },
      subs: [
        { id: "demo", name: { ko: "철거", en: "Demolition", ja: "解体" } },
        { id: "survey", name: { ko: "측량", en: "Surveying", ja: "測量" } },
        { id: "earth", name: { ko: "토목·기초", en: "Earthwork & Footings", ja: "土工・基礎" } },
        { id: "concrete", name: { ko: "콘크리트", en: "Concrete", ja: "コンクリート" } }
      ],
      tools: [
        { ko: "해머드릴", en: "Hammer drill", ja: "ハンマードリル" },
        { ko: "빠루(지렛대)", en: "Pry bar", ja: "バール" },
        { ko: "방진 마스크", en: "Dust mask", ja: "防じんマスク" },
        { ko: "안전모", en: "Hard hat", ja: "ヘルメット" }
      ],
      certs: []
    },
    {
      id: "frame", color: "#5b6472",
      name: { ko: "골조", en: "Structural Frame", ja: "躯体" },
      desc: { ko: "건물의 뼈대, 형틀·철근·조적", en: "The building's skeleton: formwork, rebar, masonry", ja: "建物の骨組み、型枠・鉄筋・組積" },
      subs: [
        { id: "form", name: { ko: "형틀목수", en: "Formwork", ja: "型枠大工" } },
        { id: "rebar", name: { ko: "철근", en: "Rebar", ja: "鉄筋" } },
        { id: "sleeve", name: { ko: "슬리브·매립", en: "Sleeves & Embeds", ja: "スリーブ・埋設" } },
        { id: "masonry", name: { ko: "조적", en: "Masonry", ja: "組積" } }
      ],
      tools: [
        { ko: "망치", en: "Hammer", ja: "ハンマー" },
        { ko: "철근 결속기", en: "Rebar tier", ja: "鉄筋結束機" },
        { ko: "못주머니", en: "Nail pouch", ja: "釘袋" },
        { ko: "수평대", en: "Spirit level", ja: "水平器" }
      ],
      certs: ["formwork", "rebar", "masonry"]
    },
    {
      id: "water", color: "#0098ad",
      name: { ko: "방수·미장", en: "Waterproofing & Plaster", ja: "防水・左官" },
      desc: { ko: "물을 막고 면을 잡는 기술", en: "Keeping water out and getting surfaces true", ja: "水を止め、面を整える技術" },
      subs: [
        { id: "proof", name: { ko: "방수", en: "Waterproofing", ja: "防水" } },
        { id: "plaster", name: { ko: "미장", en: "Plastering", ja: "左官" } },
        { id: "screed", name: { ko: "방바닥(방통)", en: "Floor Screed", ja: "床モルタル" } }
      ],
      tools: [
        { ko: "흙손", en: "Trowel", ja: "こて" },
        { ko: "롤러·붓", en: "Roller & brush", ja: "ローラー・刷毛" },
        { ko: "교반기(믹서)", en: "Paddle mixer", ja: "かくはん機" },
        { ko: "수평대", en: "Spirit level", ja: "水平器" }
      ],
      certs: ["waterproof", "plaster"]
    },
    {
      id: "mep", color: "#1f9d6b",
      name: { ko: "설비·배관", en: "Plumbing & HVAC", ja: "設備・配管" },
      desc: { ko: "물과 난방, 에어컨이 지나가는 길", en: "The paths for water, heating, and air conditioning", ja: "水・暖房・エアコンが通る道" },
      subs: [
        { id: "supply", name: { ko: "급수·배수", en: "Water & Drainage", ja: "給排水" } },
        { id: "heat", name: { ko: "난방", en: "Floor Heating", ja: "床暖房" } },
        { id: "hvac", name: { ko: "냉난방", en: "Air Conditioning", ja: "冷暖房" } },
        { id: "fixture", name: { ko: "위생기·욕실", en: "Fixtures & Bath", ja: "衛生器具・浴室" } }
      ],
      tools: [
        { ko: "파이프 렌치", en: "Pipe wrench", ja: "パイプレンチ" },
        { ko: "파이프 커터", en: "Pipe cutter", ja: "パイプカッター" },
        { ko: "토치", en: "Torch", ja: "トーチ" },
        { ko: "수압 게이지", en: "Pressure gauge", ja: "水圧計" }
      ],
      certs: ["plumbing", "ondol"]
    },
    {
      id: "elec", color: "#d99400",
      name: { ko: "전기·통신·소방", en: "Electrical & Fire", ja: "電気・通信・消防" },
      desc: { ko: "선을 깔고 불을 켜는 기술", en: "Running the wires and turning on the lights", ja: "線を引き、明かりを灯す技術" },
      subs: [
        { id: "wiring", name: { ko: "전기 배선", en: "Wiring", ja: "電気配線" } },
        { id: "light", name: { ko: "조명", en: "Lighting", ja: "照明" } },
        { id: "comm", name: { ko: "통신·인터폰", en: "Comms & Intercom", ja: "通信・インターホン" } },
        { id: "fire", name: { ko: "소방", en: "Fire Protection", ja: "消防" } }
      ],
      tools: [
        { ko: "테스터기", en: "Multimeter", ja: "テスター" },
        { ko: "스트리퍼", en: "Wire stripper", ja: "ワイヤーストリッパー" },
        { ko: "압착기", en: "Crimper", ja: "圧着工具" },
        { ko: "절연 장갑", en: "Insulated gloves", ja: "絶縁手袋" }
      ],
      certs: ["electric"]
    },
    {
      id: "exterior", color: "#7a4dff",
      name: { ko: "창호·외장", en: "Windows & Exterior", ja: "窓・外装" },
      desc: { ko: "창과 외벽, 지붕을 마감하는 기술", en: "Finishing windows, exterior walls, and roofs", ja: "窓・外壁・屋根を仕上げる技術" },
      subs: [
        { id: "window", name: { ko: "샷시·창호", en: "Windows & Sash", ja: "サッシ・建具" } },
        { id: "insul", name: { ko: "단열", en: "Insulation", ja: "断熱" } },
        { id: "roof", name: { ko: "징크·지붕", en: "Metal Roofing", ja: "金属屋根" } }
      ],
      tools: [
        { ko: "실리콘 건", en: "Caulking gun", ja: "コーキングガン" },
        { ko: "레벨기", en: "Laser level", ja: "レーザー墨出し器" },
        { ko: "전동 드릴", en: "Power drill", ja: "電動ドリル" },
        { ko: "안전대", en: "Safety harness", ja: "安全帯" }
      ],
      certs: []
    },
    {
      id: "wood", color: "#bf6a36",
      name: { ko: "목공·인테리어", en: "Carpentry & Interior", ja: "木工・内装" },
      desc: { ko: "문틀부터 천장까지, 실내를 짓는 손", en: "From door frames to ceilings, the hands that build interiors", ja: "ドア枠から天井まで、室内をつくる手" },
      subs: [
        { id: "door", name: { ko: "문틀·문", en: "Doors & Frames", ja: "ドア・枠" } },
        { id: "wall", name: { ko: "가벽·천장", en: "Walls & Ceilings", ja: "間仕切り・天井" } },
        { id: "molding", name: { ko: "몰딩", en: "Molding", ja: "モールディング" } },
        { id: "kitchen", name: { ko: "주방가구", en: "Kitchen Cabinets", ja: "キッチン家具" } }
      ],
      tools: [
        { ko: "타카(에어 네일러)", en: "Air nailer", ja: "エアタッカー" },
        { ko: "원형톱", en: "Circular saw", ja: "丸ノコ" },
        { ko: "직각자", en: "Carpenter's square", ja: "差し金" },
        { ko: "수평대", en: "Spirit level", ja: "水平器" }
      ],
      certs: ["carpentry", "interior"]
    },
    {
      id: "tile", color: "#e03a7a",
      name: { ko: "타일·석재", en: "Tile & Stone", ja: "タイル・石材" },
      desc: { ko: "줄 하나에 실력이 보이는 마감", en: "A finish where every grout line shows your skill", ja: "目地一本に腕が出る仕上げ" },
      subs: [
        { id: "tile", name: { ko: "타일", en: "Tile", ja: "タイル" } },
        { id: "istone", name: { ko: "실내 석재", en: "Interior Stone", ja: "内装石材" } },
        { id: "xstone", name: { ko: "외장 석재", en: "Exterior Stone", ja: "外装石材" } }
      ],
      tools: [
        { ko: "타일 커터", en: "Tile cutter", ja: "タイルカッター" },
        { ko: "고무 망치", en: "Rubber mallet", ja: "ゴムハンマー" },
        { ko: "줄눈 흙손", en: "Grout float", ja: "目地ごて" },
        { ko: "레벨 클립", en: "Leveling clips", ja: "レベリングクリップ" }
      ],
      certs: ["tile"]
    },
    {
      id: "finish", color: "#f26a10",
      name: { ko: "도장·도배·마감", en: "Paint & Finishes", ja: "塗装・壁紙・仕上げ" },
      desc: { ko: "마지막 손길이 집의 인상을 바꾼다", en: "The final touch that changes how a home feels", ja: "最後のひと手間が家の印象を変える" },
      subs: [
        { id: "paint", name: { ko: "도장", en: "Painting", ja: "塗装" } },
        { id: "paper", name: { ko: "도배", en: "Wallpapering", ja: "壁紙" } },
        { id: "floor", name: { ko: "바닥재", en: "Flooring", ja: "床材" } },
        { id: "caulk", name: { ko: "실리콘·코킹", en: "Caulking", ja: "コーキング" } }
      ],
      tools: [
        { ko: "롤러·붓", en: "Roller & brush", ja: "ローラー・刷毛" },
        { ko: "도배 솔", en: "Smoothing brush", ja: "なでばけ" },
        { ko: "커터칼", en: "Utility knife", ja: "カッター" },
        { ko: "퍼티 헤라", en: "Putty knife", ja: "パテベラ" }
      ],
      certs: ["wallpaper", "paint"]
    },
    {
      // 2026-11-04 소유자가 추가한 '인력사무소' 강의 분류. 상단 인력사무소(구인·구직·실습) 메뉴와 겹치지 않게 '현장 입문'으로 이름만 바꿈
      id: "labor", color: "#6b8e23",
      name: { ko: "현장 입문", en: "Getting Started", ja: "現場入門" },
      desc: { ko: "현장 일의 첫 문, 첫 출근부터 창업까지", en: "Your way in: from day one on site to your own business", ja: "現場仕事の入口、初出勤から開業まで" },
      subs: [
        { id: "first", name: { ko: "첫 출근 준비", en: "First Day Prep", ja: "初出勤の準備" } },
        { id: "lingo", name: { ko: "현장 용어", en: "Site Lingo", ja: "現場用語" } },
        { id: "pay", name: { ko: "일당·정산", en: "Pay & Settlement", ja: "日当・精算" } },
        { id: "pro", name: { ko: "기공 되기", en: "Becoming a Pro", ja: "職人になる" } },
        { id: "biz", name: { ko: "창업·운영", en: "Starting a Business", ja: "開業・運営" } }
      ],
      tools: [
        { ko: "안전화", en: "Safety boots", ja: "安全靴" },
        { ko: "안전모", en: "Hard hat", ja: "ヘルメット" },
        { ko: "코팅 장갑", en: "Coated gloves", ja: "コーティング手袋" },
        { ko: "기초안전보건교육 이수증", en: "Basic safety training certificate", ja: "基礎安全保健教育の修了証" }
      ],
      certs: []
    }
  ],

  /* ---------- 관련 국가기술자격 (한국) ---------- */
  certs: {
    wallpaper: { ko: "도배기능사", en: "Craftsman Wallpapering", ja: "壁紙施工技能士" },
    paint: { ko: "건축도장기능사", en: "Craftsman Building Painting", ja: "建築塗装技能士" },
    tile: { ko: "타일기능사", en: "Craftsman Tile", ja: "タイル技能士" },
    waterproof: { ko: "방수기능사", en: "Craftsman Waterproofing", ja: "防水技能士" },
    plaster: { ko: "미장기능사", en: "Craftsman Plastering", ja: "左官技能士" },
    masonry: { ko: "조적기능사", en: "Craftsman Masonry", ja: "組積技能士" },
    formwork: { ko: "거푸집기능사", en: "Craftsman Formwork", ja: "型枠技能士" },
    rebar: { ko: "철근기능사", en: "Craftsman Reinforcing Bar", ja: "鉄筋技能士" },
    carpentry: { ko: "건축목공기능사", en: "Craftsman Building Carpentry", ja: "建築木工技能士" },
    interior: { ko: "실내건축기능사", en: "Craftsman Interior Architecture", ja: "室内建築技能士" },
    plumbing: { ko: "배관기능사", en: "Craftsman Plumbing", ja: "配管技能士" },
    ondol: { ko: "온수온돌기능사", en: "Craftsman Hot-water Ondol", ja: "温水オンドル技能士" },
    electric: { ko: "전기기능사", en: "Craftsman Electricity", ja: "電気技能士" }
  },

  /* ---------- 강의 ---------- */
  courses: [
    // 공정·현장관리
    { id: "m1", cat: "manage", sub: "schedule", hours: 16, level: "beginner", format: "online", gov: true,
      title: { ko: "소형 건축 공정관리 A to Z", en: "Small Building Project Management A to Z", ja: "小規模建築の工程管理 A to Z" },
      desc: { ko: "잔금부터 입주까지, 공정 순서 한 번에 정리", en: "From closing on the land to move-in, every step in order", ja: "土地の残金決済から入居まで、工程を一気に整理" } },
    { id: "m2", cat: "manage", sub: "schedule", hours: 20, level: "beginner", format: "hybrid", gov: true,
      title: { ko: "현장소장 첫걸음", en: "First Steps as a Site Manager", ja: "現場所長の第一歩" },
      desc: { ko: "작업자 배치·일정 조율·현장 소통의 기본", en: "Basics of crew assignment, scheduling, and on-site communication", ja: "作業員の配置・日程調整・現場コミュニケーションの基本" } },
    { id: "m3", cat: "manage", sub: "order", hours: 6, level: "pro", format: "online",
      title: { ko: "골조 층수별 발주 타이밍", en: "When to Order, Floor by Floor", ja: "躯体の階数別・発注タイミング" },
      desc: { ko: "문틀·단열재·대리석·샷시, 언제 주문해야 하나", en: "Door frames, insulation, marble, windows: when to order each", ja: "ドア枠・断熱材・大理石・サッシ、いつ発注すべきか" } },
    { id: "m4", cat: "manage", sub: "order", hours: 8, level: "pro", format: "online",
      title: { ko: "실측과 물량 산출 실무", en: "Site Measuring & Quantity Takeoff", ja: "実測と数量拾いの実務" },
      desc: { ko: "타일·대리석·샷시 수량 정확하게 뽑기", en: "Accurate quantities for tile, marble, and windows", ja: "タイル・大理石・サッシの数量を正確に出す" } },
    { id: "m5", cat: "manage", sub: "utility", hours: 5, level: "pro", format: "online",
      title: { ko: "정화조·도시가스·급수 인입 협의", en: "Coordinating Septic, Gas & Water Hookups", ja: "浄化槽・都市ガス・給水の引込協議" },
      desc: { ko: "놓치면 공사가 멈추는 협의 체크포인트", en: "Checkpoints that stall the job if you miss them", ja: "逃すと工事が止まる協議のチェックポイント" } },
    { id: "m6", cat: "manage", sub: "handover", hours: 3, level: "pro", format: "online",
      title: { ko: "비계 해체 전 마지막 점검", en: "Final Checks Before the Scaffolding Comes Down", ja: "足場解体前の最終点検" },
      desc: { ko: "외부 마감·실리콘·인입공사 체크리스트", en: "Checklist for exterior finish, caulking, and utility work", ja: "外部仕上げ・コーキング・引込工事のチェックリスト" } },

    // 철거·토목
    { id: "c1", cat: "civil", sub: "demo", hours: 10, level: "beginner", format: "hybrid",
      title: { ko: "건축 철거 실무 입문", en: "Intro to Building Demolition", ja: "建築解体の実務入門" },
      desc: { ko: "해체 순서와 폐기물 처리 기본", en: "Demolition order and waste handling basics", ja: "解体の順序と廃棄物処理の基本" } },
    { id: "c2", cat: "civil", sub: "survey", hours: 4, level: "beginner", format: "online",
      title: { ko: "경계측량·현황측량 이해하기", en: "Understanding Boundary & As-built Surveys", ja: "境界測量・現況測量を理解する" },
      desc: { ko: "측량 결과 읽고 이웃·설계사와 협의하는 법", en: "Reading survey results and settling them with neighbors and architects", ja: "測量結果を読み、隣人・設計者と協議する方法" } },
    { id: "c3", cat: "civil", sub: "earth", hours: 8, level: "pro", format: "online",
      title: { ko: "소형 건축 토목 기초", en: "Earthwork Basics for Small Buildings", ja: "小規模建築の土木基礎" },
      desc: { ko: "터파기·흙막이·버림 콘크리트", en: "Excavation, earth retaining, and blinding concrete", ja: "根切り・山留め・捨てコンクリート" } },
    { id: "c4", cat: "civil", sub: "concrete", hours: 6, level: "pro", format: "hybrid",
      title: { ko: "주차장 콘크리트 타설", en: "Pouring a Parking Lot Slab", ja: "駐車場のコンクリート打設" },
      desc: { ko: "레미콘 주문부터 양생까지", en: "From ordering ready-mix to curing", ja: "生コンの注文から養生まで" } },

    // 골조
    { id: "f1", cat: "frame", sub: "form", hours: 40, level: "beginner", format: "hybrid", gov: true,
      title: { ko: "형틀목수 입문", en: "Formwork Carpentry for Beginners", ja: "型枠大工入門" },
      desc: { ko: "거푸집 짜기와 해체의 기본기", en: "Fundamentals of building and stripping forms", ja: "型枠の組立と解体の基本" } },
    { id: "f2", cat: "frame", sub: "rebar", hours: 32, level: "beginner", format: "hybrid", gov: true,
      title: { ko: "철근 배근 실무", en: "Rebar Placement in Practice", ja: "鉄筋配筋の実務" },
      desc: { ko: "도면 보고 철근 배근하기", en: "Placing rebar from the drawings", ja: "図面を見て鉄筋を配筋する" } },
    { id: "f3", cat: "frame", sub: "sleeve", hours: 4, level: "pro", format: "online",
      title: { ko: "골조 단계 슬리브 매립", en: "Setting Sleeves During Framing", ja: "躯体段階のスリーブ埋設" },
      desc: { ko: "엘리베이터·에어컨·설비 구멍 미리 잡기", en: "Planning openings for elevators, AC, and utilities in advance", ja: "エレベーター・エアコン・設備の穴をあらかじめ確保" } },
    { id: "f4", cat: "frame", sub: "masonry", hours: 16, level: "beginner", format: "practice",
      title: { ko: "조적 기초", en: "Masonry Basics", ja: "組積の基礎" },
      desc: { ko: "방수벽·칸막이 벽돌 쌓기", en: "Laying brick for waterproof and partition walls", ja: "防水壁・間仕切りのレンガ積み" } },

    // 방수·미장
    { id: "w1", cat: "water", sub: "proof", hours: 12, level: "beginner", format: "online", gov: true,
      title: { ko: "건축 방수 입문", en: "Intro to Building Waterproofing", ja: "建築防水入門" },
      desc: { ko: "지하·옥상·욕실 방수 공법 비교", en: "Comparing methods for basements, roofs, and bathrooms", ja: "地下・屋上・浴室の防水工法を比較" } },
    { id: "w2", cat: "water", sub: "proof", hours: 6, level: "pro", format: "online",
      title: { ko: "골조 조인부위·지하 방수", en: "Waterproofing Joints & Basements", ja: "躯体の継ぎ目・地下の防水" },
      desc: { ko: "형틀 해체 직후 해야 할 방수 처리", en: "Waterproofing to do right after the forms come off", ja: "型枠解体直後に行う防水処理" } },
    { id: "w3", cat: "water", sub: "proof", hours: 16, level: "pro", format: "hybrid",
      title: { ko: "욕실·발코니 방수 실무", en: "Bathroom & Balcony Waterproofing", ja: "浴室・バルコニー防水の実務" },
      desc: { ko: "액체방수부터 담수 테스트까지", en: "From liquid membrane to flood testing", ja: "液体防水から水張り試験まで" } },
    { id: "w4", cat: "water", sub: "plaster", hours: 24, level: "beginner", format: "practice", gov: true,
      title: { ko: "내부 미장과 사춤", en: "Interior Plastering & Gap Filling", ja: "内部左官と充填" },
      desc: { ko: "벽 면 잡기, 틈 메우기 실습", en: "Practice truing walls and filling gaps", ja: "壁の面出し・すき間埋めの実習" } },
    { id: "w5", cat: "water", sub: "screed", hours: 12, level: "pro", format: "hybrid",
      title: { ko: "방바닥 기포·몰탈", en: "Floor Foam Concrete & Mortar", ja: "床の気泡コンクリート・モルタル" },
      desc: { ko: "층간소음재부터 마감 몰탈까지", en: "From sound-insulation layers to finish mortar", ja: "遮音材から仕上げモルタルまで" } },

    // 설비·배관
    { id: "p1", cat: "mep", sub: "supply", hours: 14, level: "beginner", format: "online", gov: true,
      title: { ko: "건축 설비배관 입문", en: "Intro to Building Plumbing", ja: "建築設備配管入門" },
      desc: { ko: "급수·급탕·오배수 구조 이해", en: "How water supply, hot water, and drainage are laid out", ja: "給水・給湯・排水の仕組みを理解" } },
    { id: "p2", cat: "mep", sub: "supply", hours: 3, level: "pro", format: "online",
      title: { ko: "수압 테스트 제대로 하기", en: "Pressure Testing Done Right", ja: "水圧テストを正しく行う" },
      desc: { ko: "마감 전에 새는 곳 잡는 법", en: "Finding leaks before the finishes go on", ja: "仕上げ前に漏れを見つける方法" } },
    { id: "p3", cat: "mep", sub: "heat", hours: 12, level: "beginner", format: "practice",
      title: { ko: "엑셀(XL) 난방배관 시공", en: "Installing XL Floor-heating Pipe", ja: "XL管による床暖房配管の施工" },
      desc: { ko: "배관 간격과 분배기 연결 실습", en: "Practice pipe spacing and manifold connections", ja: "配管間隔とヘッダー接続の実習" } },
    { id: "p4", cat: "mep", sub: "hvac", hours: 16, level: "pro", format: "hybrid",
      title: { ko: "시스템에어컨 천장 배관", en: "Ceiling-cassette AC Piping", ja: "天井カセットエアコンの配管" },
      desc: { ko: "냉매·드레인 배관의 기본", en: "Basics of refrigerant and drain lines", ja: "冷媒・ドレン配管の基本" } },
    { id: "p5", cat: "mep", sub: "fixture", hours: 10, level: "beginner", format: "hybrid", diy: true,
      title: { ko: "위생기·수전 교체 실무", en: "Replacing Fixtures & Faucets", ja: "衛生器具・水栓の交換実務" },
      desc: { ko: "양변기·세면대·수전 설치부터 욕실 돔천장까지", en: "Toilets, basins, faucets, and bathroom dome ceilings", ja: "便器・洗面台・水栓の設置から浴室のドーム天井まで" } },

    // 전기·통신·소방
    { id: "e1", cat: "elec", sub: "wiring", hours: 40, level: "beginner", format: "practice", gov: true,
      title: { ko: "전기기능사 실기 대비", en: "Electrician Craftsman Practical Exam Prep", ja: "電気技能士 実技対策" },
      desc: { ko: "배관·배선 실습으로 자격증 준비", en: "Prepare for the certificate with conduit and wiring practice", ja: "配管・配線の実習で資格を準備" } },
    { id: "e2", cat: "elec", sub: "wiring", hours: 16, level: "beginner", format: "online",
      title: { ko: "건축 전기 입선 기초", en: "Building Wiring Basics", ja: "建築電気の入線基礎" },
      desc: { ko: "배관·입선·분전반 이해", en: "Understanding conduit, wire pulling, and panels", ja: "配管・入線・分電盤の理解" } },
    { id: "e3", cat: "elec", sub: "light", hours: 8, level: "beginner", format: "hybrid", diy: true,
      title: { ko: "조명·등박스 실무", en: "Lighting & Light Coves", ja: "照明・照明ボックスの実務" },
      desc: { ko: "천장 조명 위치 잡기와 설치", en: "Laying out and installing ceiling lights", ja: "天井照明の位置決めと設置" } },
    { id: "e4", cat: "elec", sub: "comm", hours: 6, level: "beginner", format: "online",
      title: { ko: "비디오폰·월패드 설치", en: "Video Intercom & Wall Pad Installation", ja: "テレビドアホン・ウォールパッド設置" },
      desc: { ko: "세대 통신 배선의 기본", en: "Basics of in-home communication wiring", ja: "住戸内の通信配線の基本" } },
    { id: "e5", cat: "elec", sub: "fire", hours: 8, level: "pro", format: "online",
      title: { ko: "소방배관·감지기 이해", en: "Understanding Fire Piping & Detectors", ja: "消防配管・感知器の理解" },
      desc: { ko: "소방 검사 전 꼭 볼 체크포인트", en: "Checkpoints to review before the fire inspection", ja: "消防検査前に必ず見るチェックポイント" } },

    // 창호·외장
    { id: "x1", cat: "exterior", sub: "window", hours: 12, level: "beginner", format: "hybrid",
      title: { ko: "샷시 실측과 틀 시공", en: "Window Measuring & Frame Installation", ja: "サッシの実測と枠施工" },
      desc: { ko: "내부 창틀부터 창대석 샷시까지", en: "From interior frames to sill-stone windows", ja: "内部の窓枠から窓台石のサッシまで" } },
    { id: "x2", cat: "exterior", sub: "insul", hours: 10, level: "pro", format: "hybrid",
      title: { ko: "외단열 시공 실무", en: "Exterior Insulation in Practice", ja: "外断熱施工の実務" },
      desc: { ko: "단열재 부착과 마감의 기본", en: "Attaching insulation and finishing basics", ja: "断熱材の張り付けと仕上げの基本" } },
    { id: "x3", cat: "exterior", sub: "window", hours: 8, level: "pro", format: "practice",
      title: { ko: "창대석 시공과 사춤 미장", en: "Window Sills & Gap Plastering", ja: "窓台石の施工と充填左官" },
      desc: { ko: "비 새지 않는 창 주변 마감", en: "Leak-proof finishing around windows", ja: "雨漏りしない窓まわりの仕上げ" } },
    { id: "x4", cat: "exterior", sub: "roof", hours: 6, level: "pro", format: "online",
      title: { ko: "징크 지붕·다락 마감", en: "Metal Roof & Attic Finishing", ja: "金属屋根・屋根裏の仕上げ" },
      desc: { ko: "자재 협의부터 실리콘 마무리까지", en: "From choosing materials to the final caulking", ja: "資材の協議からコーキング仕上げまで" } },

    // 목공·인테리어
    { id: "k1", cat: "wood", sub: "door", hours: 40, level: "beginner", format: "hybrid", gov: true,
      title: { ko: "내장목수 입문", en: "Interior Carpentry for Beginners", ja: "内装大工入門" },
      desc: { ko: "공구 다루기부터 문틀 설치까지", en: "From handling tools to installing door frames", ja: "工具の扱いからドア枠の取り付けまで" } },
    { id: "k2", cat: "wood", sub: "wall", hours: 16, level: "beginner", format: "practice",
      title: { ko: "단열 가벽 세우기", en: "Building Insulated Partition Walls", ja: "断熱間仕切り壁を立てる" },
      desc: { ko: "각재·석고보드로 벽 만들기", en: "Framing walls with studs and drywall", ja: "角材・石膏ボードで壁をつくる" } },
    { id: "k3", cat: "wood", sub: "wall", hours: 12, level: "pro", format: "practice",
      title: { ko: "천장 등박스·우물천장", en: "Light Coves & Tray Ceilings", ja: "照明ボックス・折り上げ天井" },
      desc: { ko: "조명 자리를 만드는 천장 목공", en: "Ceiling carpentry that makes room for lighting", ja: "照明の場所をつくる天井木工" } },
    { id: "k4", cat: "wood", sub: "molding", hours: 4, level: "beginner", format: "online", diy: true,
      title: { ko: "걸레받이·몰딩 마감 디테일", en: "Baseboard & Molding Details", ja: "巾木・モールディング仕上げのディテール" },
      desc: { ko: "틈 없이 깔끔하게 마무리하기", en: "Clean finishing with no gaps", ja: "すき間なくきれいに仕上げる" } },
    { id: "k5", cat: "wood", sub: "kitchen", hours: 10, level: "pro", format: "hybrid",
      title: { ko: "싱크대(주방가구) 설치 실무", en: "Kitchen Cabinet Installation", ja: "キッチン家具の設置実務" },
      desc: { ko: "실측·협의·시공 순서", en: "Measuring, coordination, and install order", ja: "実測・協議・施工の順序" } },

    // 타일·석재
    { id: "t1", cat: "tile", sub: "tile", hours: 40, level: "beginner", format: "practice", gov: true,
      title: { ko: "타일 시공 입문", en: "Tiling for Beginners", ja: "タイル施工入門" },
      desc: { ko: "벽·바닥 타일 붙이기 실습", en: "Hands-on wall and floor tiling", ja: "壁・床タイル張りの実習" } },
    { id: "t2", cat: "tile", sub: "tile", hours: 4, level: "pro", format: "online",
      title: { ko: "타일 실측과 자재 수량 계산", en: "Tile Measuring & Material Estimates", ja: "タイルの実測と資材数量計算" },
      desc: { ko: "로스까지 계산하는 실무 노하우", en: "Practical know-how, waste allowance included", ja: "ロス分まで計算する実務ノウハウ" } },
    { id: "t3", cat: "tile", sub: "tile", hours: 12, level: "beginner", format: "hybrid", diy: true,
      title: { ko: "욕실 타일 리폼", en: "Bathroom Tile Makeover", ja: "浴室タイルのリフォーム" },
      desc: { ko: "덧방부터 줄눈까지", en: "From tile-over-tile to grout", ja: "重ね張りから目地まで" } },
    { id: "t4", cat: "tile", sub: "istone", hours: 16, level: "pro", format: "practice",
      title: { ko: "계단 대리석 시공", en: "Marble Stair Installation", ja: "階段の大理石施工" },
      desc: { ko: "디딤판·챌판 붙이기", en: "Setting treads and risers", ja: "踏み板・蹴込み板の張り付け" } },
    { id: "t5", cat: "tile", sub: "xstone", hours: 16, level: "pro", format: "practice",
      title: { ko: "외부 대리석·보행로 석재 시공", en: "Exterior Marble & Walkway Stone", ja: "外部大理石・歩行路の石材施工" },
      desc: { ko: "외벽과 주차장 보행로 석재 마감", en: "Stone finishing for exterior walls and walkways", ja: "外壁と駐車場歩行路の石材仕上げ" } },

    // 도장·도배·마감
    { id: "n1", cat: "finish", sub: "paint", hours: 24, level: "beginner", format: "practice", gov: true,
      title: { ko: "건축 도장 입문", en: "Intro to Building Painting", ja: "建築塗装入門" },
      desc: { ko: "탄성페인트·일반 페인트 실습", en: "Practice with elastic and standard paints", ja: "弾性塗料・一般塗料の実習" } },
    { id: "n2", cat: "finish", sub: "paper", hours: 40, level: "beginner", format: "practice", gov: true,
      title: { ko: "도배 기능 입문", en: "Wallpapering for Beginners", ja: "壁紙施工入門" },
      desc: { ko: "초배부터 정배까지", en: "From base paper to finish paper", ja: "下張りから上張りまで" } },
    { id: "n3", cat: "finish", sub: "paper", hours: 6, level: "beginner", format: "online", diy: true,
      title: { ko: "셀프 도배·페인트", en: "DIY Wallpaper & Paint", ja: "セルフ壁紙・ペンキ" },
      desc: { ko: "우리 집 직접 바꿔보기", en: "Transform your own home yourself", ja: "わが家を自分で変えてみる" } },
    { id: "n4", cat: "finish", sub: "floor", hours: 12, level: "beginner", format: "hybrid",
      title: { ko: "마루·장판 시공 실무", en: "Wood & Vinyl Flooring Installation", ja: "フローリング・クッションフロア施工" },
      desc: { ko: "바닥재 종류별 시공 순서", en: "Installation steps for each flooring type", ja: "床材の種類別の施工手順" } },
    { id: "n5", cat: "finish", sub: "caulk", hours: 4, level: "beginner", format: "hybrid", diy: true,
      title: { ko: "실리콘·코킹 마감", en: "Silicone & Caulking Finish", ja: "シリコン・コーキング仕上げ" },
      desc: { ko: "욕실·창호 실리콘 한 줄 깔끔하게", en: "A clean bead of silicone in baths and windows", ja: "浴室・窓まわりのシリコンを一本きれいに" } },

    // 고급 과정: 경력자도 남한테 묻기 애매했던 노하우 (q1~q12)
    { id: "q1", cat: "manage", sub: "schedule", hours: 6, level: "expert", format: "online", knowhow: true,
      title: { ko: "공정 지연 만회 실전", en: "Recovering a Delayed Schedule", ja: "遅れた工程を取り戻す実践" },
      desc: { ko: "비·자재 지연으로 밀린 공정, 베테랑은 이렇게 당긴다", en: "How veterans pull a schedule back after rain and late materials", ja: "雨や資材遅れで押した工程をベテランはこう取り戻す" } },
    { id: "q2", cat: "manage", sub: "order", hours: 5, level: "expert", format: "online", knowhow: true,
      title: { ko: "기성 청구와 단가 협상", en: "Progress Billing & Rate Negotiation", ja: "出来高請求と単価交渉" },
      desc: { ko: "제값 받는 기성 서류와 협상하는 말", en: "Paperwork and phrasing that get you paid fairly", ja: "正当に受け取る出来高書類と交渉の言い方" } },
    { id: "q3", cat: "manage", sub: "handover", hours: 4, level: "expert", format: "online", knowhow: true,
      title: { ko: "하자 분쟁·클레임 대응", en: "Handling Defect Disputes & Claims", ja: "瑕疵トラブル・クレーム対応" },
      desc: { ko: "사진 기록부터 보수 범위 협의까지", en: "From photo records to agreeing on repair scope", ja: "写真記録から補修範囲の協議まで" } },
    { id: "q4", cat: "water", sub: "proof", hours: 8, level: "expert", format: "hybrid", knowhow: true,
      title: { ko: "누수 원인 찾기 실전", en: "Tracking Down Leaks", ja: "漏水の原因を探す実践" },
      desc: { ko: "열화상·청음·가스 탐지로 범인 잡기", en: "Find the culprit with thermal, acoustic, and tracer-gas methods", ja: "サーモ・聴音・ガス探知で原因を突き止める" } },
    { id: "q5", cat: "exterior", sub: "insul", hours: 5, level: "expert", format: "online", knowhow: true,
      title: { ko: "결로·곰팡이 원인과 해결", en: "Condensation & Mold: Causes and Fixes", ja: "結露・カビの原因と対策" },
      desc: { ko: "단열 끊김과 환기, 재발 막는 디테일", en: "Thermal bridges, ventilation, and details that stop it coming back", ja: "断熱の切れ目と換気、再発を防ぐディテール" } },
    { id: "q6", cat: "tile", sub: "tile", hours: 6, level: "expert", format: "hybrid", knowhow: true,
      title: { ko: "타일 들뜸·깨짐 하자 잡기", en: "Fixing Hollow & Cracked Tile", ja: "タイルの浮き・割れの瑕疵対策" },
      desc: { ko: "원인별 보수법과 재시공 판단", en: "Repair by cause, and when to redo it", ja: "原因別の補修法と再施工の判断" } },
    { id: "q7", cat: "finish", sub: "paper", hours: 4, level: "expert", format: "hybrid", knowhow: true,
      title: { ko: "도배 하자(울음·들뜸) 잡는 법", en: "Fixing Wallpaper Wrinkles & Lifting", ja: "壁紙のしわ・浮きの直し方" },
      desc: { ko: "바탕 처리부터 계절별 풀 배합까지", en: "From surface prep to seasonal paste mixes", ja: "下地処理から季節ごとの糊の配合まで" } },
    { id: "q8", cat: "elec", sub: "wiring", hours: 5, level: "expert", format: "hybrid", knowhow: true,
      title: { ko: "누전·차단기 트립 원인 찾기", en: "Tracing Ground Faults & Breaker Trips", ja: "漏電・ブレーカー遮断の原因探し" },
      desc: { ko: "절연저항 측정으로 회로 좁혀가기", en: "Narrow down circuits with insulation resistance tests", ja: "絶縁抵抗の測定で回路を絞り込む" } },
    { id: "q9", cat: "civil", sub: "concrete", hours: 6, level: "expert", format: "online", knowhow: true,
      title: { ko: "콘크리트 균열 원인과 보수", en: "Concrete Cracks: Causes and Repair", ja: "コンクリートひび割れの原因と補修" },
      desc: { ko: "구조 균열과 수축 균열 구분하기", en: "Telling structural cracks from shrinkage cracks", ja: "構造ひび割れと収縮ひび割れを見分ける" } },
    { id: "q10", cat: "wood", sub: "door", hours: 4, level: "expert", format: "practice", knowhow: true,
      title: { ko: "문틀 처짐·뒤틀림 보정", en: "Correcting Sagging & Twisted Door Frames", ja: "ドア枠のたわみ・ねじれ補正" },
      desc: { ko: "레벨 잡는 순서와 현장 보정 요령", en: "Leveling order and on-site correction tricks", ja: "水平の出し方と現場での補正のコツ" } },
    { id: "q11", cat: "mep", sub: "supply", hours: 5, level: "expert", format: "online", knowhow: true,
      title: { ko: "배수 막힘·역류 근본 해결", en: "Solving Drain Clogs & Backflow for Good", ja: "排水詰まり・逆流の根本解決" },
      desc: { ko: "구배·통기부터 잡는 베테랑 방식", en: "The veteran approach: fix slope and venting first", ja: "勾配・通気から直すベテランのやり方" } },
    { id: "q12", cat: "labor", sub: "pro", hours: 3, level: "expert", format: "online", knowhow: true,
      title: { ko: "작업 동선·공구 세팅으로 손 빨라지기", en: "Faster Work with Smarter Tool Setup", ja: "動線と工具の段取りで手早くなる" },
      desc: { ko: "같은 시간에 더 많이, 베테랑의 세팅법", en: "Do more in the same time: how veterans set up", ja: "同じ時間でもっと多く、ベテランの段取り" } },

    // 상황별 노하우 클립 (5~10분, kind: "clip" · min: 분)
    { id: "s1", kind: "clip", min: 7, cat: "water", sub: "proof", level: "pro", format: "online",
      title: { ko: "비 온 다음 날, 방수 바탕 마름 확인하는 법", en: "Is the Substrate Dry After Rain?", ja: "雨の翌日、防水下地の乾きを確かめる" },
      desc: { ko: "바로 바르면 들뜬다, 손으로 확인하는 3가지", en: "Coat too soon and it lifts: 3 hands-on checks", ja: "すぐ塗ると浮く、手で確かめる3つのポイント" } },
    { id: "s2", kind: "clip", min: 9, cat: "water", sub: "proof", level: "pro", format: "online",
      title: { ko: "배수구 주변 방수 보강", en: "Reinforcing Waterproofing Around Drains", ja: "排水口まわりの防水補強" },
      desc: { ko: "자주 새는 곳, 덧대는 순서", en: "A common leak spot: layering it right", ja: "漏れやすい場所の重ね張り手順" } },
    { id: "s3", kind: "clip", min: 8, cat: "tile", sub: "tile", level: "pro", format: "online",
      title: { ko: "타일 한 장만 깨졌을 때 교체", en: "Replacing a Single Cracked Tile", ja: "割れたタイル1枚だけを交換" },
      desc: { ko: "주변 타일 안 깨고 들어내는 요령", en: "Remove it without damaging its neighbors", ja: "周りを割らずに外すコツ" } },
    { id: "s4", kind: "clip", min: 6, cat: "tile", sub: "tile", level: "pro", format: "online",
      title: { ko: "줄눈 색이 얼룩질 때", en: "When Grout Dries Blotchy", ja: "目地の色ムラが出たとき" },
      desc: { ko: "원인별로 바로잡는 법", en: "Fixes by cause", ja: "原因別の直し方" } },
    { id: "s5", kind: "clip", min: 5, cat: "finish", sub: "paper", level: "pro", format: "online",
      title: { ko: "벽지 이음매가 벌어질 때 응급 처치", en: "Quick Fix for Opening Wallpaper Seams", ja: "壁紙の継ぎ目が開いたときの応急処置" },
      desc: { ko: "다시 붙이는 풀과 롤러 쓰는 법", en: "Re-glue it and roll it flat", ja: "糊とローラーで貼り直す" } },
    { id: "s6", kind: "clip", min: 9, cat: "finish", sub: "paper", level: "pro", format: "online",
      title: { ko: "곰팡이 핀 벽, 도배 전 처리", en: "Prepping a Moldy Wall Before Papering", ja: "カビの出た壁、壁紙貼り前の処理" },
      desc: { ko: "그냥 덮으면 다시 올라온다", en: "Cover it and it comes right back", ja: "そのまま貼ると再発する" } },
    { id: "s7", kind: "clip", min: 4, cat: "mep", sub: "fixture", level: "beginner", format: "online",
      title: { ko: "수전 밑에서 물 샐 때 3분 점검", en: "Leak Under the Faucet: 3-Minute Check", ja: "水栓の下から漏れるときの3分点検" },
      desc: { ko: "패킹·호스·연결부 순서로 보기", en: "Check the washer, the hose, then the fittings", ja: "パッキン・ホース・接続部の順に" } },
    { id: "s8", kind: "clip", min: 8, cat: "mep", sub: "supply", level: "pro", format: "online",
      title: { ko: "겨울철 언 배관 녹이기", en: "Thawing Frozen Pipes in Winter", ja: "冬に凍った配管を解かす" },
      desc: { ko: "터지지 않게 녹이는 순서", en: "Thaw in the right order so nothing bursts", ja: "破裂させない解かし方" } },
    { id: "s9", kind: "clip", min: 6, cat: "elec", sub: "wiring", level: "pro", format: "online",
      title: { ko: "콘센트 하나만 안 될 때 확인 순서", en: "When Just One Outlet Is Dead", ja: "コンセント1つだけ使えないとき" },
      desc: { ko: "차단기부터 결선까지 차례로", en: "From the breaker to the wiring, step by step", ja: "ブレーカーから結線まで順番に" } },
    { id: "s10", kind: "clip", min: 7, cat: "elec", sub: "light", level: "beginner", format: "online",
      title: { ko: "형광등을 LED로 바꿀 때 안정기 처리", en: "Fluorescent to LED: Dealing with the Ballast", ja: "蛍光灯をLEDに替えるときの安定器処理" },
      desc: { ko: "직결형·호환형 구분하기", en: "Direct-wire vs. plug-and-play tubes", ja: "直結型と互換型の見分け方" } },
    { id: "s11", kind: "clip", min: 5, cat: "wood", sub: "door", level: "beginner", format: "online",
      title: { ko: "문이 바닥에 끌릴 때 경첩 조정", en: "Fixing a Door That Drags", ja: "床にこするドアの丁番調整" },
      desc: { ko: "드라이버 하나로 맞추기", en: "All you need is a screwdriver", ja: "ドライバー1本で調整" } },
    { id: "s12", kind: "clip", min: 6, cat: "wood", sub: "molding", level: "pro", format: "online",
      title: { ko: "몰딩 45도 모서리 틈 메우기", en: "Closing Gaps in 45° Molding Corners", ja: "モールディング45度の角のすき間処理" },
      desc: { ko: "재단 각도와 퍼티 마감", en: "Cutting angles and a putty finish", ja: "切断角度とパテ仕上げ" } },
    { id: "s13", kind: "clip", min: 8, cat: "frame", sub: "form", level: "pro", format: "online",
      title: { ko: "레미콘이 늦게 올 때 타설 계획 바꾸기", en: "When the Ready-mix Truck Is Late", ja: "生コンが遅れたときの打設計画変更" },
      desc: { ko: "콜드조인트 막는 현장 판단", en: "Field calls that prevent cold joints", ja: "コールドジョイントを防ぐ現場判断" } },
    { id: "s14", kind: "clip", min: 6, cat: "frame", sub: "rebar", level: "pro", format: "online",
      title: { ko: "철근 피복 두께 현장에서 확인하기", en: "Checking Rebar Cover on Site", ja: "鉄筋のかぶり厚さを現場で確認" },
      desc: { ko: "스페이서 간격과 검측 포인트", en: "Spacer spacing and inspection points", ja: "スペーサー間隔と検査ポイント" } },
    { id: "s15", kind: "clip", min: 7, cat: "civil", sub: "earth", level: "pro", format: "online",
      title: { ko: "비 온 뒤 터파기 현장 물 빼기", en: "Draining an Excavation After Rain", ja: "雨の後の根切り現場の排水" },
      desc: { ko: "양수기 위치와 흙막이 점검", en: "Pump placement and shoring checks", ja: "ポンプの位置と山留めの点検" } },
    { id: "s16", kind: "clip", min: 8, cat: "manage", sub: "schedule", level: "pro", format: "online",
      title: { ko: "자재가 하루 늦을 때 공정 돌리는 법", en: "Reshuffling Work When Materials Are Late", ja: "資材が1日遅れたときの工程の回し方" },
      desc: { ko: "노는 사람 없이 순서 바꾸기", en: "Swap the order so no one sits idle", ja: "手待ちを出さずに順番を入れ替える" } },
    { id: "s17", kind: "clip", min: 10, cat: "manage", sub: "utility", level: "expert", format: "online",
      title: { ko: "건축주가 공사 중 설계 변경을 요청할 때", en: "When the Owner Asks for Changes Mid-build", ja: "施主が工事中に設計変更を求めたとき" },
      desc: { ko: "추가 비용·일정 협의하는 말과 서류", en: "Words and paperwork for extra cost and time", ja: "追加費用・工期を協議する言い方と書類" } },
    { id: "s18", kind: "clip", min: 6, cat: "exterior", sub: "window", level: "pro", format: "online",
      title: { ko: "샷시 틈으로 바람 들어올 때", en: "Stopping Drafts Around Windows", ja: "サッシのすき間風を止める" },
      desc: { ko: "모헤어·실리콘·레일 점검", en: "Check weatherstrip, silicone, and rails", ja: "モヘア・シリコン・レールの点検" } },
    { id: "s19", kind: "clip", min: 7, cat: "exterior", sub: "roof", level: "pro", format: "online",
      title: { ko: "징크 지붕 빗소리 줄이기", en: "Quieting Rain Noise on a Metal Roof", ja: "金属屋根の雨音を抑える" },
      desc: { ko: "흡음재와 고정 방식", en: "Sound insulation and fastening", ja: "吸音材と固定方法" } },
    { id: "s20", kind: "clip", min: 5, cat: "labor", sub: "first", level: "beginner", format: "online",
      title: { ko: "첫날 반장님께 믿음 얻는 법", en: "Earning the Foreman's Trust on Day One", ja: "初日に班長の信頼を得る方法" },
      desc: { ko: "인사·준비·정리, 기본이 반", en: "Greet, prepare, clean up: the basics are half the job", ja: "あいさつ・準備・片付け、基本が半分" } },
    { id: "s21", kind: "clip", min: 8, cat: "labor", sub: "pay", level: "beginner", format: "online",
      title: { ko: "일당을 못 받았을 때 대처 순서", en: "What to Do If Your Pay Is Withheld", ja: "日当が払われないときの対処手順" },
      desc: { ko: "증거 남기기부터 신고까지", en: "From keeping evidence to filing a report", ja: "証拠を残すところから申告まで" } },
    { id: "s22", kind: "clip", min: 9, cat: "tile", sub: "istone", level: "expert", format: "online",
      title: { ko: "대리석 얼룩·백화 지우는 법", en: "Removing Stains & Efflorescence from Marble", ja: "大理石のシミ・白華を落とす" },
      desc: { ko: "약품 고르기와 연마 순서", en: "Choosing cleaners and polishing order", ja: "薬剤選びと研磨の順序" } },

    // 현장 입문 (2026-11-04 소유자 추가분 h1~h7 + 창업·몸 관리 h8~h10)
    { id: "h1", cat: "labor", sub: "first", hours: 3, level: "beginner", format: "online",
      title: { ko: "인력사무소 첫 출근 가이드", en: "Your First Day Through a Staffing Office", ja: "人材事務所・初出勤ガイド" },
      desc: { ko: "새벽 출근부터 현장 배정, 하루 일과까지 미리 보기", en: "From the early start to site assignment and your day's routine", ja: "早朝の出勤から現場の割り振り、1日の流れまで" } },
    { id: "h2", cat: "labor", sub: "first", hours: 2, level: "beginner", format: "online",
      title: { ko: "안전교육 이수증과 준비물", en: "Safety Training Certificate & Gear", ja: "安全教育の修了証と持ち物" },
      desc: { ko: "기초안전보건교육 이수증 받는 법, 안전화·장갑·작업복 고르기", en: "Getting the basic safety certificate; choosing boots, gloves, and workwear", ja: "基礎安全保健教育の修了証の取り方、安全靴・手袋・作業着の選び方" } },
    { id: "h3", cat: "labor", sub: "lingo", hours: 2, level: "beginner", format: "online",
      title: { ko: "현장 용어·눈치 속성", en: "Site Lingo Crash Course", ja: "現場用語・空気を読む速習" },
      desc: { ko: "곰방·시마이·데모도, 처음 듣는 현장 말 바로 알아듣기", en: "Understand the slang you'll hear on day one", ja: "初めて聞く現場の言葉をすぐ理解" } },
    { id: "h4", cat: "labor", sub: "pay", hours: 2, level: "beginner", format: "online",
      title: { ko: "일당·수수료·세금 정리", en: "Day Rates, Fees & Taxes Explained", ja: "日当・手数料・税金の整理" },
      desc: { ko: "손에 쥐는 돈이 얼마인지, 정산 구조 이해하기", en: "Know your take-home pay and how settlement works", ja: "手取りはいくらか、精算の仕組みを理解" } },
    { id: "h5", cat: "labor", sub: "pay", hours: 2, level: "beginner", format: "online",
      title: { ko: "산재보험·퇴직공제 챙기기", en: "Workers' Comp & Retirement Mutual Aid", ja: "労災保険・退職共済をしっかり" },
      desc: { ko: "일용직도 받는 산재 보상, 일한 날만큼 쌓이는 퇴직공제", en: "Injury coverage for day workers, and retirement aid that grows with each day worked", ja: "日雇いでも受けられる労災補償、働いた日数分たまる退職共済" } },
    { id: "h6", cat: "labor", sub: "pro", hours: 4, level: "beginner", format: "online",
      title: { ko: "잡부에서 기공까지 로드맵", en: "From Helper to Skilled Pro", ja: "雑工から職人へのロードマップ" },
      desc: { ko: "조공·준기공·기공, 공종 고르고 단가 올리는 길", en: "Helper, semi-skilled, skilled: pick a trade and raise your rate", ja: "補助・準職人・職人、工種を選んで単価を上げる道" } },
    { id: "h7", cat: "labor", sub: "biz", hours: 10, level: "pro", format: "online",
      title: { ko: "인력사무소 창업·운영 실무", en: "Starting & Running a Staffing Office", ja: "人材事務所の開業・運営実務" },
      desc: { ko: "직업소개사업 등록부터 구인처 영업, 일당 정산 관리까지", en: "From job-placement registration to finding clients and managing pay", ja: "職業紹介事業の登録から求人先の営業、日当精算の管理まで" } },
    { id: "h8", cat: "labor", sub: "biz", hours: 4, level: "pro", format: "online",
      title: { ko: "견적서 쓰기와 단가 계산", en: "Writing Quotes & Pricing Jobs", ja: "見積書の書き方と単価計算" },
      desc: { ko: "자재·인건비·이윤까지, 손해 안 보는 견적", en: "Materials, labor, and margin: quotes that don't lose money", ja: "材料・人件費・利益まで、損しない見積" } },
    { id: "h9", cat: "labor", sub: "biz", hours: 6, level: "pro", format: "online",
      title: { ko: "1인 시공 사업 첫걸음", en: "Launching a One-Person Contracting Business", ja: "一人親方の開業 第一歩" },
      desc: { ko: "사업자등록·보험·세금, 기공에서 사장님으로", en: "Registration, insurance, taxes: from tradesperson to owner", ja: "事業者登録・保険・税金、職人から社長へ" } },
    { id: "h10", cat: "labor", sub: "first", hours: 3, level: "beginner", format: "online",
      title: { ko: "다치지 않고 오래 일하는 몸", en: "Stay Safe, Work Longer", ja: "ケガせず長く働く体づくり" },
      desc: { ko: "허리·무릎·어깨 지키는 작업 자세와 스트레칭", en: "Postures and stretches that protect your back, knees, and shoulders", ja: "腰・膝・肩を守る作業姿勢とストレッチ" } }
  ],

  // 메인 '처음이라면 여기서 시작' 줄
  starter: ["h1", "m1", "n2", "t1", "k1", "e1", "f1", "p5", "n5"],

  /* ---------- 로드맵 (목표별 강의 묶음) ---------- */
  roadmaps: [
    { id: "firstpay", color: "#6b8e23", wage: "laborer", courses: ["h1", "h2", "h3", "h4", "h5", "h10"], certs: [],
      name: { ko: "첫 일당 받기", en: "Your First Day's Pay", ja: "はじめての日当" },
      goal: { ko: "인력사무소로 현장에 바로 들어가는 가장 빠른 길", en: "The fastest way onto a site through a staffing office", ja: "人材事務所から現場に入るいちばん早い道" } },
    { id: "finish", color: "#f26a10", wage: "painter", courses: ["n2", "n1", "n5", "n4", "k4"], certs: ["wallpaper", "paint"],
      name: { ko: "도배·도장 마감 기술자", en: "Wallpaper & Paint Finisher", ja: "壁紙・塗装の仕上げ職人" },
      goal: { ko: "실내 마감으로 빨리 기술자가 되는 길", en: "Become a finishing pro quickly, indoors", ja: "内装仕上げで早く職人になる道" } },
    { id: "wet", color: "#e03a7a", wage: "tile", courses: ["w1", "w3", "t1", "t2", "t3", "n5"], certs: ["tile", "waterproof"],
      name: { ko: "타일·방수 기술자", en: "Tile & Waterproofing Pro", ja: "タイル・防水職人" },
      goal: { ko: "욕실 하나를 처음부터 끝까지 맡는 기술", en: "Take a bathroom from start to finish", ja: "浴室ひとつを最初から最後まで任される技術" } },
    { id: "carpentry", color: "#bf6a36", wage: "carpenter", courses: ["k1", "k2", "k3", "k4", "k5"], certs: ["carpentry", "interior"],
      name: { ko: "인테리어 목수", en: "Interior Carpenter", ja: "内装大工" },
      goal: { ko: "문틀·가벽·천장, 실내 공사의 뼈대", en: "Door frames, walls, ceilings: the backbone of interior work", ja: "ドア枠・間仕切り・天井、内装工事の骨組み" } },
    { id: "mep", color: "#1f9d6b", wage: "plumber", courses: ["p1", "p2", "p3", "p4", "p5"], certs: ["plumbing", "ondol"],
      name: { ko: "설비 기술자", en: "Plumbing & Heating Tech", ja: "設備技術者" },
      goal: { ko: "물·난방·에어컨, 어느 현장에서나 필요한 기술", en: "Water, heating, AC: needed on every site", ja: "水・暖房・エアコン、どの現場でも必要な技術" } },
    { id: "elec", color: "#d99400", wage: null, courses: ["e2", "e1", "e3", "e4", "e5"], certs: ["electric"],
      name: { ko: "전기 기술자", en: "Electrician", ja: "電気技術者" },
      goal: { ko: "자격증부터 실무까지, 전기 한 길", en: "One path from certificate to real work", ja: "資格から実務まで、電気一筋" } },
    { id: "frame", color: "#5b6472", wage: "formwork", courses: ["f1", "f2", "f3", "f4", "w4"], certs: ["formwork", "rebar", "masonry", "plaster"],
      name: { ko: "골조 기능공", en: "Structural Tradesperson", ja: "躯体の技能工" },
      goal: { ko: "신축 현장의 핵심, 형틀·철근·조적", en: "The core of new builds: formwork, rebar, masonry", ja: "新築現場の要、型枠・鉄筋・組積" } },
    { id: "lead", color: "#2f6bff", wage: null, courses: ["m2", "m1", "m3", "m4", "m5", "m6"], certs: [],
      name: { ko: "반장·현장소장", en: "Foreman & Site Manager", ja: "班長・現場所長" },
      goal: { ko: "공정을 읽고 사람과 자재를 움직이는 사람", en: "Read the schedule, move people and materials", ja: "工程を読み、人と資材を動かす人" } },
    { id: "masters", color: "#7a4dff", wage: null, courses: ["q4", "q6", "q7", "q11", "q3", "q2"], certs: [],
      name: { ko: "고수의 디테일", en: "The Master's Details", ja: "職人の極意" },
      goal: { ko: "경력자도 남한테 묻기 애매했던 하자·누수·단가 노하우", en: "Defect, leak, and pricing know-how even pros hesitate to ask about", ja: "経験者でも今さら聞けない瑕疵・漏水・単価のノウハウ" } },
    { id: "biz", color: "#111318", wage: null, courses: ["h6", "h8", "h9", "h7", "m1"], certs: [],
      name: { ko: "내 사업 시작하기", en: "Start Your Own Business", ja: "自分の事業を始める" },
      goal: { ko: "기공에서 사장님으로, 견적부터 창업까지", en: "From tradesperson to owner: quotes to launch", ja: "職人から社長へ、見積から開業まで" } },
    { id: "home", color: "#0098ad", wage: null, courses: ["m1", "c2", "p5", "t3", "n3", "n5"], certs: [],
      name: { ko: "내 집·내 건물", en: "Your Own Home", ja: "自分の家・建物" },
      goal: { ko: "직접 고치고, 직접 짓는 사람을 위한 생활 기술", en: "Everyday skills for people who fix and build their own", ja: "自分で直し、自分で建てる人のための生活技術" } }
  ],

  /* ---------- 한국 직종별 평균 일당 (공식 통계) ----------
   * 출처: 대한건설협회 '2026년 하반기 적용 건설업 임금실태조사' (2026.9.1 공표)
   * 1일 8시간 기본 일급. 제수당·상여금·퇴직급여충당금 제외 */
  wages: {
    base: "laborer",
    average: 282737,
    items: [
      { id: "tile", daily: 294379, cat: "tile", name: { ko: "타일공", en: "Tile setter", ja: "タイル工" } },
      { id: "carpenter", daily: 282990, cat: "wood", name: { ko: "건축목공", en: "Building carpenter", ja: "建築大工" } },
      { id: "concrete", daily: 276285, cat: "civil", name: { ko: "콘크리트공", en: "Concrete worker", ja: "コンクリート工" } },
      { id: "formwork", daily: 275379, cat: "frame", name: { ko: "형틀목공", en: "Formwork carpenter", ja: "型枠大工" } },
      { id: "rebar", daily: 268932, cat: "frame", name: { ko: "철근공", en: "Rebar worker", ja: "鉄筋工" } },
      { id: "painter", daily: 268225, cat: "finish", name: { ko: "도장공", en: "Painter", ja: "塗装工" } },
      { id: "demolition", daily: 261108, cat: "civil", name: { ko: "철거공", en: "Demolition worker", ja: "解体工" } },
      { id: "plumber", daily: 260673, cat: "mep", name: { ko: "배관공(수도)", en: "Plumber (water)", ja: "配管工(水道)" } },
      { id: "interior", daily: 258904, cat: "wood", name: { ko: "내장공", en: "Interior finisher", ja: "内装工" } },
      { id: "waterproof", daily: 233163, cat: "water", name: { ko: "방수공", en: "Waterproofer", ja: "防水工" } },
      { id: "laborer", daily: 172698, cat: "labor", name: { ko: "보통인부", en: "General laborer", ja: "普通作業員" } }
    ],
    // 공종 → 대표 직종 (강의 상세·로드맵에 평균 일당 표시)
    byCat: { tile: "tile", wood: "carpenter", civil: "concrete", frame: "formwork", finish: "painter", mep: "plumber", water: "waterproof", labor: "laborer" }
  },

  /* ---------- 해외 현장 임금 (전기 기술자 기준) ----------
   * 환율: 유럽중앙은행 기준환율 2026-11-02 (1유로 = 1.1216달러, 177.10엔, 1.6004호주달러, 1.5673캐나다달러, 1,506.20원)
   * 월 환산: 미국 연봉÷12, 캐나다 시급×40시간×52주÷12, 호주 주급×52÷12, 일본·한국 일당×20일 */
  overseas: {
    eur: { USD: 1.1216, JPY: 177.1, AUD: 1.6004, CAD: 1.5673, KRW: 1506.2 },
    items: [
      { id: "au", cur: "AUD", amount: 2204, per: "week",
        country: { ko: "호주", en: "Australia", ja: "オーストラリア" },
        figure: { ko: "주급 중간값 2,204호주달러 (풀타임·세전)", en: "Median weekly pay AUD 2,204 (full-time, before tax)", ja: "週給中央値 2,204豪ドル(フルタイム・税引前)" },
        why: { ko: "인력 부족 직업이 기술직에 몰려 있어요", en: "Shortages are concentrated in technician and trades jobs", ja: "人手不足は技術職に集中しています" },
        src: { ko: "호주 통계청(2023.5) · Jobs and Skills Australia", en: "ABS (May 2023) via Jobs and Skills Australia", ja: "豪州統計局(2023年5月)・Jobs and Skills Australia" } },
      { id: "us", cur: "USD", amount: 63190, per: "year",
        country: { ko: "미국", en: "United States", ja: "アメリカ" },
        figure: { ko: "연봉 중간값 63,190달러", en: "Median annual pay USD 63,190", ja: "年収中央値 63,190ドル" },
        why: { ko: "10년간 일자리 9% 증가 전망, 해마다 약 7만 2,700명 채용", en: "Jobs projected to grow 9% in 10 years, about 72,700 openings a year", ja: "10年で雇用9%増の見通し、毎年約7万2,700人を募集" },
        src: { ko: "미국 노동통계국 BLS (2025.5)", en: "U.S. BLS (May 2025)", ja: "米国労働統計局 BLS(2025年5月)" } },
      { id: "jp", cur: "JPY", amount: 34300, per: "day",
        country: { ko: "일본 (도쿄)", en: "Japan (Tokyo)", ja: "日本(東京)" },
        figure: { ko: "전공 일당 34,300엔", en: "Electrician day rate ¥34,300", ja: "電工 日額34,300円" },
        why: { ko: "건설 노무단가 14년 연속 상승", en: "Construction labor rates up 14 years in a row", ja: "労務単価は14年連続で上昇" },
        src: { ko: "일본 국토교통성 공공공사 설계노무단가 (2026.3~)", en: "Japan MLIT public works labor rates (from Mar 2026)", ja: "国土交通省 公共工事設計労務単価(2026年3月〜)" } },
      { id: "ca", cur: "CAD", amount: 35, per: "hour",
        country: { ko: "캐나다", en: "Canada", ja: "カナダ" },
        figure: { ko: "시급 중간값 35캐나다달러", en: "Median hourly pay CAD 35.00", ja: "時給中央値 35カナダドル" },
        why: { ko: "2026년 이민 선발에도 기술직(목수·배관공 등) 분야 유지", en: "Trades (carpenters, plumbers…) remain a 2026 Express Entry category", ja: "2026年の移民選抜でも技術職(大工・配管工など)枠を継続" },
        src: { ko: "캐나다 정부 Job Bank", en: "Government of Canada Job Bank", ja: "カナダ政府 Job Bank" } },
      { id: "kr", cur: "KRW", amount: 282737, per: "day", ref: true,
        country: { ko: "한국 (참고)", en: "Korea (reference)", ja: "韓国(参考)" },
        figure: { ko: "건설업 전체 직종 평균 일당 282,737원", en: "All-trade average day rate ₩282,737", ja: "建設業全職種の平均日額 282,737ウォン" },
        why: { ko: "국내 건설 일자리는 8분기 연속 감소", en: "Domestic construction jobs down 8 quarters in a row", ja: "国内の建設雇用は8四半期連続で減少" },
        src: { ko: "대한건설협회 (2026 하반기) · 국가데이터처", en: "CAK (2026 H2) · Statistics Korea", ja: "大韓建設協会(2026年下半期)・韓国統計当局" } }
    ]
  },

  /* ---------- 월 구독 국가별 요금 (예정) ----------
   * 한국 외 국가는 현지 AI 구독료(ChatGPT Go, 2026-11 기준) 수준으로 책정 */
  /* 나라별 월 구독료: 그 나라 사람들이 이미 내는 AI 구독료 수준
   * - tier "plus": 선진국 → 그 나라 ChatGPT Plus 가격 (한국 29,000원 = 한국 ChatGPT Plus 가격)
   * - tier "go": 개발도상국 → 그 나라 ChatGPT Go 가격
   * - usd: 달러 환산(참고용). 출처: GeoSub 앱스토어 가격 모음, 2026-11-05 */
  pricing: [
    { id: "KR", tier: "plus", price: { ko: "29,000원", en: "₩29,000", ja: "29,000ウォン" }, usd: 21.66, perDay: true },
    { id: "JP", tier: "plus", price: "¥3,000", usd: 18.96 },
    { id: "TW", tier: "plus", price: "NT$690", usd: 21.29 },
    { id: "SG", tier: "plus", price: "S$29.98", usd: 23.46 },
    { id: "AU", tier: "plus", price: "A$29.99", usd: 21.04 },
    { id: "NZ", tier: "plus", price: "NZ$39.99", usd: 22.49 },
    { id: "US", tier: "plus", price: "$19.99", usd: 19.99 },
    { id: "CA", tier: "plus", price: "CA$24.99", usd: 17.93 },
    { id: "SA", tier: "plus", price: "SAR 89.99", usd: 24.0 },
    { id: "AE", tier: "plus", price: "AED 79.99", usd: 21.78 },
    { id: "IL", tier: "plus", price: "₪69.90", usd: 22.4 },
    { id: "GB", tier: "plus", price: "£19.99", usd: 26.99 },
    { id: "DE", tier: "plus", price: "€22.99", usd: 25.9 },
    { id: "FR", tier: "plus", price: "€22.99", usd: 25.9 },
    { id: "NL", tier: "plus", price: "€22.99", usd: 25.62 },
    { id: "ES", tier: "plus", price: "€22.99", usd: 25.62 },
    { id: "IT", tier: "plus", price: "€22.99", usd: 25.62 },
    { id: "CH", tier: "plus", price: "CHF 20", usd: 24.12 },
    { id: "SE", tier: "plus", price: "SEK 249", usd: 25.1 },
    { id: "NO", tier: "plus", price: "NOK 249", usd: 26.83 },
    { id: "DK", tier: "plus", price: "DKK 179", usd: 26.66 },
    { id: "PL", tier: "plus", price: "PLN 99.99", usd: 25.3 },
    { id: "CL", tier: "plus", price: "CLP 19,990", usd: 20.3 },
    { id: "VN", tier: "go", price: "132.000₫", usd: 5.12 },
    { id: "ID", tier: "go", price: "Rp75.000", usd: 4.14 },
    { id: "PH", tier: "go", price: "₱300", usd: 4.72 },
    { id: "IN", tier: "go", price: "₹399", usd: 4.22 },
    { id: "MY", tier: "go", price: "RM23.99", usd: 5.9 },
    { id: "TH", tier: "go", price: "฿259", usd: 7.7 },
    { id: "PK", tier: "go", price: "PKR 1,400", usd: 5.06 },
    { id: "EG", tier: "go", price: "EGP 249.99", usd: 4.45 },
    { id: "TR", tier: "go", price: "₺249.99", usd: 5.0 },
    { id: "NG", tier: "go", price: "₦6,900", usd: 5.13 },
    { id: "KE", tier: "go", price: "$5.99", usd: 5.99 },
    { id: "ZA", tier: "go", price: "R149.99", usd: 9.11 },
    { id: "MX", tier: "go", price: "MX$129", usd: 6.92 },
    { id: "BR", tier: "go", price: "R$39.90", usd: 7.3 },
    { id: "CO", tier: "go", price: "COP 24,900", usd: 7.91 },
    { id: "AR", tier: "go", price: "$5.99", usd: 5.99 }
  ],
  /* 베테랑 수입 구조 (2026-11-06 소유자가 정함, Udemy·Skillshare·패스트캠퍼스 벤치마킹)
   * ① 영상 제작비(fee): 우리가 요청하고 검수를 통과한 짧은 영상 1편마다. 3분 미만은 없음, 20분을 넘어도 12만 원
   * ② 구독 수익 나눔: 구독·이용권 순매출의 30%를 모아, 끝까지 본 영상 수 × 길이 점수(points)대로 매달 나눔
   * ③ 국비 전문과정: 승인 후 수강료의 30%를 수강생마다 (편당 제작비 없음, 촬영·편집은 플랫폼이 지원)
   * 화면 예시: 10편(10~20분) + 국비 수강생 10명(수강료 50만 원 기준) = 월 230만 원 */
  /* 연락처 (2026-11-06 소유자). 고객센터 화면·푸터·광고 안내·개인정보처리방침(privacy.html은 따로 적혀 있음)에 쓰인다 */
  contact: {
    email: "lkysakana@naver.com",
    phone: "010-7139-2910",       // 한국 안에서 걸 때
    intl: "+82 10-7139-2910",     // 해외에서 걸 때
    tel: "+821071392910"          // 전화 걸기 링크 (국내·해외 모두 됨)
  },
  payRates: [
    { id: "short", fee: 50000, points: 2 },   // 3분 이상 10분 미만
    { id: "mid", fee: 80000, points: 3 },     // 10분 이상 20분 미만
    { id: "long", fee: 120000, points: 4 }    // 20분 이상
  ],
  vetShare: { subscription: 0.3, gov: 0.3, govFeeExample: 500000 },
  // 환산용 환율 (ECB 기준 2026-11-02): 1달러 = 1,342.9원 = 157.9엔
  fx: { KRW: 1342.9, JPY: 157.9 },

  /* ---------- 지역 ---------- */
  regions: [
    { id: "all", name: { ko: "전국", en: "All regions", ja: "全国" } },
    { id: "seoul", name: { ko: "서울", en: "Seoul", ja: "ソウル" } },
    { id: "gyeonggi", name: { ko: "경기·인천", en: "Gyeonggi & Incheon", ja: "京畿・仁川" } },
    { id: "gangwon", name: { ko: "강원", en: "Gangwon", ja: "江原" } },
    { id: "chungcheong", name: { ko: "대전·세종·충청", en: "Daejeon, Sejong & Chungcheong", ja: "大田・世宗・忠清" } },
    { id: "jeolla", name: { ko: "광주·전라", en: "Gwangju & Jeolla", ja: "光州・全羅" } },
    { id: "gyeongbuk", name: { ko: "대구·경북", en: "Daegu & Gyeongbuk", ja: "大邱・慶北" } },
    { id: "gyeongnam", name: { ko: "부산·울산·경남", en: "Busan, Ulsan & Gyeongnam", ja: "釜山・蔚山・慶南" } },
    { id: "jeju", name: { ko: "제주", en: "Jeju", ja: "済州" } }
  ],

  /* ---------- 인력사무소 예시 (실제 공고 아님) ---------- */
  jobTags: {
    beginner: { ko: "초보 가능", en: "Beginners OK", ja: "未経験OK" },
    lodging: { ko: "숙소 제공", en: "Lodging provided", ja: "宿舎あり" },
    tools: { ko: "공구 지원", en: "Tools provided", ja: "工具支給" },
    cert: { ko: "기능사 우대", en: "Certificate preferred", ja: "技能士優遇" },
    transport: { ko: "차량 지원", en: "Transport provided", ja: "送迎あり" },
    weekend: { ko: "주말 가능", en: "Weekends", ja: "週末可" },
    veteran: { ko: "베테랑 환영", en: "Veterans welcome", ja: "ベテラン歓迎" }
  },
  jobs: {
    hire: [
      { cat: "finish", region: "chungcheong", type: "daily", tags: ["beginner", "tools"], place: { ko: "세종", en: "Sejong", ja: "世宗" },
        title: { ko: "아파트 인테리어 현장 도배 보조", en: "Wallpaper helper for an apartment interior job", ja: "マンション内装現場の壁紙補助" } },
      { cat: "tile", region: "chungcheong", type: "short", tags: ["cert", "transport"], place: { ko: "대전", en: "Daejeon", ja: "大田" },
        title: { ko: "신축 빌라 욕실 타일 기공", en: "Bathroom tile setter for a new villa", ja: "新築ヴィラの浴室タイル職人" } },
      { cat: "elec", region: "gyeonggi", type: "daily", tags: ["beginner", "cert"], place: { ko: "수원", en: "Suwon", ja: "水原" },
        title: { ko: "상가 리모델링 전기 보조", en: "Electrical helper for a retail remodel", ja: "店舗リモデルの電気補助" } },
      { cat: "frame", region: "chungcheong", type: "short", tags: ["lodging", "beginner"], place: { ko: "청주", en: "Cheongju", ja: "清州" },
        title: { ko: "단독주택 신축 형틀목수 조공", en: "Formwork helper for a new detached house", ja: "戸建て新築の型枠補助" } },
      { cat: "water", region: "seoul", type: "daily", tags: ["beginner", "weekend"], place: { ko: "서울", en: "Seoul", ja: "ソウル" },
        title: { ko: "욕실 리모델링 방수·타일 보조", en: "Waterproofing & tile helper for a bathroom remodel", ja: "浴室リモデルの防水・タイル補助" } },
      { cat: "mep", region: "gyeongnam", type: "regular", tags: ["cert"], place: { ko: "부산", en: "Busan", ja: "釜山" },
        title: { ko: "아파트 관리 설비 기사", en: "Maintenance plumber for an apartment complex", ja: "マンション管理の設備技師" } },
      { cat: "manage", region: "chungcheong", type: "short", tags: ["veteran"], place: { ko: "세종", en: "Sejong", ja: "世宗" },
        title: { ko: "건축주 현장 공정 점검·자문", en: "Schedule checks & advice for an owner-builder", ja: "施主の現場の工程点検・助言" } },
      { cat: "tile", region: "gyeonggi", type: "short", tags: ["veteran", "weekend"], place: { ko: "화성", en: "Hwaseong", ja: "華城" },
        title: { ko: "실습생 타일 지도 (주 2회)", en: "Coaching tile trainees (twice a week)", ja: "実習生のタイル指導(週2回)" } }
    ],
    seek: [
      { cat: "finish", region: "chungcheong", place: { ko: "대전·세종", en: "Daejeon & Sejong", ja: "大田・世宗" },
        title: { ko: "도배 기공 · 경력 5년", en: "Wallpaper pro · 5 yrs", ja: "壁紙職人・経験5年" },
        tags: [{ ko: "도배기능사", en: "Craftsman Wallpapering", ja: "壁紙施工技能士" }, { ko: "주 5일 가능", en: "5 days a week", ja: "週5日可" }] },
      { cat: "tile", region: "chungcheong", place: { ko: "충청 전역", en: "All of Chungcheong", ja: "忠清全域" },
        title: { ko: "타일 보조 · 경력 2년", en: "Tile helper · 2 yrs", ja: "タイル補助・経験2年" },
        tags: [{ ko: "기공 준비 중", en: "Working toward setter", ja: "職人を目指して準備中" }, { ko: "팀 합류 희망", en: "Open to joining a team", ja: "チーム参加希望" }] },
      { cat: "elec", region: "gyeonggi", neo: true, place: { ko: "경기 남부", en: "Southern Gyeonggi", ja: "京畿南部" },
        title: { ko: "전기기능사 취득 · 신입", en: "Certified electrician · entry level", ja: "電気技能士取得・新人" },
        tags: [{ ko: "전기기능사", en: "Craftsman Electricity", ja: "電気技能士" }] },
      { cat: "wood", region: "all", place: { ko: "전국", en: "Nationwide", ja: "全国" },
        title: { ko: "내장목수 팀(3명) · 경력 10년", en: "Interior carpentry team of 3 · 10 yrs", ja: "内装大工チーム(3人)・経験10年" },
        tags: [{ ko: "팀 단위", en: "Team", ja: "チーム単位" }, { ko: "숙소 필요", en: "Needs lodging", ja: "宿舎希望" }] },
      { cat: "water", region: "seoul", neo: true, place: { ko: "서울", en: "Seoul", ja: "ソウル" },
        title: { ko: "방수 입문 수강 · 실습 희망", en: "Took waterproofing intro · wants practice", ja: "防水入門を受講・実習希望" },
        tags: [{ ko: "주말 가능", en: "Weekends", ja: "週末可" }] },
      { cat: "manage", region: "chungcheong", veteran: true, place: { ko: "세종", en: "Sejong", ja: "世宗" },
        title: { ko: "은퇴한 현장소장 · 경력 30년", en: "Retired site manager · 30 yrs", ja: "引退した現場所長・経験30年" },
        tags: [{ ko: "자문·지도 희망", en: "Advising & coaching", ja: "助言・指導希望" }, { ko: "주 2~3일", en: "2–3 days a week", ja: "週2〜3日" }] }
    ],
    trainee: [
      { cat: "finish", region: "chungcheong", partner: "school",
        title: { ko: "도배 기초 실습 · 4주 (주말)", en: "Wallpapering basics · 4 weeks (weekends)", ja: "壁紙基礎実習・4週間(週末)" } },
      { cat: "tile", region: "gyeonggi", partner: "office",
        title: { ko: "욕실 타일 현장 실습 · 2주", en: "Bathroom tile site practice · 2 weeks", ja: "浴室タイル現場実習・2週間" } },
      { cat: "elec", region: "chungcheong", partner: "veteran",
        title: { ko: "베테랑과 1:1 전기 배선 실습 · 3주", en: "One-on-one wiring practice with a veteran · 3 weeks", ja: "ベテランとマンツーマン電気配線実習・3週間" } }
    ]
  },

  /* ---------- 성장 사다리 ---------- */
  ladder: [
    { id: "helper", link: "#/roadmaps/firstpay", wage: "laborer",
      title: { ko: "보조", en: "Helper", ja: "補助" },
      desc: { ko: "공구와 현장 순서를 익혀요", en: "Learn the tools and the order of work", ja: "工具と現場の流れを覚える" } },
    { id: "pro", link: "#/roadmaps", wage: "range",
      title: { ko: "기공", en: "Skilled pro", ja: "職人" },
      desc: { ko: "한 공종을 맡는 기술자", en: "Own one trade", ja: "ひとつの工種を任される技術者" } },
    { id: "lead", link: "#/roadmaps/lead",
      title: { ko: "반장", en: "Foreman", ja: "班長" },
      desc: { ko: "팀을 이끌고 공정을 관리해요", en: "Lead a crew and run the schedule", ja: "チームを率いて工程を管理" } },
    { id: "owner", link: "#/roadmaps/biz",
      title: { ko: "사장님", en: "Owner", ja: "社長" },
      desc: { ko: "견적·영업·창업, 내 일을 해요", en: "Quote, sell, and run your own business", ja: "見積・営業・開業、自分の仕事を" } },
    { id: "veteran", link: "#/veteran",
      title: { ko: "베테랑", en: "Veteran", ja: "ベテラン" },
      desc: { ko: "후배를 키우고 노하우로 정산받아요", en: "Train the next generation and earn from your know-how", ja: "後輩を育て、ノウハウで収益を得る" } }
  ],

  /* ---------- 나에게 맞는 기술 찾기 ---------- */
  quiz: [
    { q: { ko: "현장 경력은 어느 정도예요?", en: "How much site experience do you have?", ja: "現場経験はどれくらいですか?" },
      options: [
        { t: { ko: "아직 없어요", en: "None yet", ja: "まだありません" }, w: { firstpay: 3, home: 1 } },
        { t: { ko: "1~5년", en: "1–5 years", ja: "1〜5年" }, w: { finish: 1, wet: 1, carpentry: 1, mep: 1, elec: 1, masters: 1 } },
        { t: { ko: "5년 넘었어요", en: "More than 5 years", ja: "5年以上" }, w: { masters: 3, lead: 2, biz: 1 } }
      ] },
    { q: { ko: "어디서 일하고 싶어요?", en: "Where do you want to work?", ja: "どこで働きたいですか?" },
      options: [
        { t: { ko: "집 안, 실내 마감", en: "Indoors, finishing work", ja: "室内の仕上げ" }, w: { finish: 2, wet: 2, carpentry: 1, elec: 1 } },
        { t: { ko: "건물을 처음부터 짓는 현장", en: "New-build sites", ja: "建物を一から建てる現場" }, w: { frame: 3, lead: 1 } },
        { t: { ko: "아직 잘 모르겠어요", en: "Not sure yet", ja: "まだわからない" }, w: { firstpay: 3, mep: 1 } }
      ] },
    { q: { ko: "어떤 일이 더 끌려요?", en: "What kind of work appeals to you?", ja: "どんな仕事に惹かれますか?" },
      options: [
        { t: { ko: "섬세한 손작업", en: "Careful handwork", ja: "繊細な手作業" }, w: { finish: 2, wet: 2, carpentry: 1 } },
        { t: { ko: "몸 쓰는 큰 작업", en: "Big, physical work", ja: "体を使う大きな作業" }, w: { frame: 2, carpentry: 2, firstpay: 1 } },
        { t: { ko: "기계·전기·배관", en: "Machines, wiring, pipes", ja: "機械・電気・配管" }, w: { elec: 3, mep: 3 } },
        { t: { ko: "사람과 일정 관리", en: "Managing people and schedules", ja: "人と工程の管理" }, w: { lead: 3, biz: 1 } }
      ] },
    { q: { ko: "가장 큰 목표는요?", en: "What's your biggest goal?", ja: "いちばんの目標は?" },
      options: [
        { t: { ko: "하루빨리 일당 받기", en: "Start earning as soon as possible", ja: "一日でも早く日当を得る" }, w: { firstpay: 4, finish: 1 } },
        { t: { ko: "자격증 따기", en: "Get certified", ja: "資格を取る" }, w: { elec: 2, wet: 1, mep: 1, carpentry: 1, finish: 1 } },
        { t: { ko: "내 집 직접 고치기", en: "Fix up my own home", ja: "自分の家を直す" }, w: { home: 5 } },
        { t: { ko: "내 사업 하기", en: "Run my own business", ja: "自分の事業をする" }, w: { biz: 4, lead: 1 } }
      ] }
  ],

  /* ---------- 추천 검색어 ---------- */
  suggestions: {
    ko: ["누수", "하자", "타일", "도배", "견적", "전기기능사", "방수", "셀프"],
    en: ["Leaks", "Defects", "Tile", "Wallpaper", "Quotes", "Electrician", "Waterproofing", "DIY"],
    ja: ["漏水", "瑕疵", "タイル", "壁紙", "見積", "電気技能士", "防水", "セルフ"]
  },

  /* ---------- 커뮤니티 (게시판은 정식 오픈 후 운영) ----------
   * 공종별 게시판은 categories에서 자동으로 만든다. 아래는 주제별 게시판 */
  topicBoards: [
    { id: "qna", icon: "chat", color: "#2f6bff",
      name: { ko: "베테랑에게 묻기", en: "Ask a Veteran", ja: "ベテランに聞く" },
      desc: { ko: "막히는 현장 문제를 베테랑이 답해요", en: "Veterans answer your on-site problems", ja: "現場で困ったことにベテランが答えます" } },
    { id: "defects", icon: "alert", color: "#e03a7a",
      name: { ko: "하자·실패 사례", en: "Defects & Failures", ja: "瑕疵・失敗事例" },
      desc: { ko: "실수에서 배우는 게 제일 빨라요", en: "Mistakes are the fastest teacher", ja: "失敗から学ぶのがいちばん早い" } },
    { id: "photos", icon: "camera", color: "#0098ad",
      name: { ko: "현장 사진", en: "Site Photos", ja: "現場写真" },
      desc: { ko: "오늘 끝낸 작업을 자랑해요", en: "Show off today's finished work", ja: "今日仕上げた仕事を見せ合おう" } },
    { id: "review", icon: "star", color: "#d99400",
      name: { ko: "자재·공구 리뷰", en: "Materials & Tools", ja: "資材・工具レビュー" },
      desc: { ko: "직접 써본 사람의 솔직한 후기", en: "Honest reviews from people who used them", ja: "実際に使った人の率直なレビュー" } },
    { id: "pay", icon: "coin", color: "#1f9d6b",
      name: { ko: "단가·일당 이야기", en: "Rates & Pay Talk", ja: "単価・日当の話" },
      desc: { ko: "지역별 단가와 정산 경험 나누기", en: "Share local rates and payment experiences", ja: "地域ごとの単価と精算の経験を共有" } },
    { id: "free", icon: "smile", color: "#111318",
      name: { ko: "자유게시판", en: "Open Board", ja: "自由掲示板" },
      desc: { ko: "일 끝나고 한잔하듯 편하게", en: "Kick back, like after-work drinks", ja: "仕事終わりの一杯のように気軽に" } }
  ],
  postTypes: {
    question: { ko: "질문", en: "Question", ja: "質問" },
    knowhow: { ko: "노하우", en: "Know-how", ja: "ノウハウ" },
    photo: { ko: "사진", en: "Photo", ja: "写真" },
    review: { ko: "리뷰", en: "Review", ja: "レビュー" },
    talk: { ko: "이야기", en: "Talk", ja: "雑談" }
  },
  // 이런 글이 올라와요 (예시 · 실제 글 아님)
  posts: [
    { board: "tile", type: "question", title: { ko: "욕실 바닥 구배, 몇 % 주시나요?", en: "What slope do you give a bathroom floor?", ja: "浴室の床勾配、何%つけますか?" } },
    { board: "defects", type: "knowhow", title: { ko: "줄눈 갈라짐, 원인 세 가지 정리", en: "Cracked grout: three causes", ja: "目地割れ、3つの原因まとめ" } },
    { board: "water", type: "question", title: { ko: "옥상 우레탄 방수, 겨울에 해도 되나요?", en: "Can you do urethane roof waterproofing in winter?", ja: "屋上ウレタン防水、冬でも施工できますか?" } },
    { board: "photos", type: "photo", title: { ko: "오늘 끝낸 600각 타일 현장", en: "Today's finished 600 mm tile job", ja: "今日仕上げた600角タイルの現場" } },
    { board: "review", type: "review", title: { ko: "충전 타카 3종 써본 후기", en: "I tried three cordless nailers", ja: "充電タッカー3種を使ってみた" } },
    { board: "pay", type: "talk", title: { ko: "세종 도배 단가, 요즘 어떠세요?", en: "How are wallpaper rates in Sejong lately?", ja: "世宗の壁紙単価、最近どうですか?" } }
  ],

  /* ---------- 현장 용어 사전 ----------
   * t: 현장에서 쓰는 말 · rom: 로마자 · jp: 일본어 어원(있을 때) · std: 바꿔 쓸 말(한국어) · cat: 공종(general = 공통) */
  terms: [
    { t: "시마이", rom: "simai", jp: "仕舞い", std: "마무리", cat: "general", m: { ko: "그날 일을 끝내는 것", en: "Wrapping up the day's work", ja: "その日の作業を終えること" } },
    { t: "데모도", rom: "demodo", jp: "手元", std: "조공·보조", cat: "general", m: { ko: "기공 옆에서 돕는 보조 인부", en: "A helper who assists a skilled worker", ja: "職人を手伝う補助作業員" } },
    { t: "오야지", rom: "oyaji", jp: "親父", std: "반장", cat: "general", m: { ko: "작업팀을 이끄는 사람", en: "The crew boss or foreman", ja: "作業班を率いる親方" } },
    { t: "곰방", rom: "gombang", cat: "general", m: { ko: "자재를 사람이 직접 지고 나르는 일", en: "Carrying materials by hand or on your back", ja: "資材を人が担いで運ぶ作業" } },
    { t: "단도리", rom: "dandori", jp: "段取り", std: "준비", cat: "general", m: { ko: "작업 전에 준비하고 순서를 잡는 일", en: "Preparing and sequencing work before starting", ja: "作業前の準備と手順決め" } },
    { t: "데나오시", rom: "denaosi", jp: "出直し", std: "재작업", cat: "general", m: { ko: "잘못된 부분을 다시 하는 일", en: "Redoing work that went wrong", ja: "やり直しの作業" } },
    { t: "야리끼리", rom: "yarikkiri", jp: "やり切り", cat: "general", m: { ko: "정한 작업량을 끝내면 그날 일이 끝나는 방식", en: "Leave once the set amount of work is done", ja: "決めた作業量を終えたら上がる方式" } },
    { t: "데마찌", rom: "demajji", jp: "手待ち", std: "대기", cat: "general", m: { ko: "일감이 없어 기다리거나 쉬는 것", en: "Idle time waiting for work", ja: "仕事待ちで手が空くこと" } },
    { t: "함바", rom: "hamba", jp: "飯場", std: "현장 식당", cat: "general", m: { ko: "현장 근처 작업자 식당", en: "The canteen near a site", ja: "現場近くの作業員食堂" } },
    { t: "공수", rom: "gongsu", cat: "general", m: { ko: "하루 일한 양을 세는 단위 (1공수 = 하루)", en: "A unit for a day's work (1 gongsu = one day)", ja: "1日の作業量を数える単位(1工数=1日)" } },
    { t: "품", rom: "pum", cat: "general", m: { ko: "일하는 데 드는 사람 손과 시간", en: "The labor (people × time) a job takes", ja: "作業に要する人手と時間" } },
    { t: "헤베", rom: "hebe", jp: "平米", std: "제곱미터", cat: "general", m: { ko: "넓이 단위 ㎡", en: "Square meter (㎡)", ja: "面積の単位 ㎡" } },
    { t: "루베", rom: "rube", jp: "立米", std: "세제곱미터", cat: "general", m: { ko: "부피 단위 ㎥, 레미콘 양을 셀 때", en: "Cubic meter (㎥), e.g., for ready-mix", ja: "体積の単位 ㎥、生コンの量など" } },
    { t: "빠루", rom: "pparu", jp: "バール", std: "노루발", cat: "general", m: { ko: "못을 뽑거나 뜯어낼 때 쓰는 지렛대", en: "Pry bar and nail puller", ja: "釘抜き・こじ開けに使うバール" } },
    { t: "기리", rom: "giri", jp: "錐", std: "드릴 날", cat: "general", m: { ko: "구멍 뚫는 드릴 날", en: "Drill bit", ja: "穴あけ用のドリルの刃" } },
    { t: "공구리", rom: "gonguri", std: "콘크리트", cat: "civil", m: { ko: "콘크리트를 이르는 현장 말", en: "Site slang for concrete", ja: "コンクリートの現場での呼び方" } },
    { t: "하스리", rom: "haseuri", jp: "はつり", std: "쪼아내기", cat: "civil", m: { ko: "콘크리트 면을 쪼아내거나 깎는 작업", en: "Chipping or chiseling concrete surfaces", ja: "コンクリート面をはつる作業" } },
    { t: "나라시", rom: "narasi", jp: "均し", std: "고르기", cat: "civil", m: { ko: "바닥이나 흙을 고르게 펴는 일", en: "Leveling out a surface or soil", ja: "床や土を平らにならすこと" } },
    { t: "바라시", rom: "barasi", jp: "ばらし", std: "해체", cat: "frame", m: { ko: "거푸집 등을 뜯어내는 일", en: "Stripping forms or dismantling", ja: "型枠などの解体" } },
    { t: "반생", rom: "bansaeng", jp: "番線", std: "결속선", cat: "frame", m: { ko: "철근을 묶는 철사", en: "Tie wire for rebar", ja: "鉄筋を結束する針金" } },
    { t: "가다", rom: "gada", jp: "型", std: "거푸집", cat: "frame", m: { ko: "콘크리트를 부어 모양을 잡는 틀", en: "Formwork that shapes poured concrete", ja: "コンクリートの形をつくる型枠" } },
    { t: "하리", rom: "hari", jp: "梁", std: "보", cat: "frame", m: { ko: "기둥과 기둥을 잇는 수평 부재", en: "A beam spanning between columns", ja: "柱と柱をつなぐ水平材" } },
    { t: "쓰미", rom: "sseumi", jp: "積み", std: "쌓기", cat: "frame", m: { ko: "벽돌·블록 쌓기", en: "Laying brick or block", ja: "レンガ・ブロック積み" } },
    { t: "아시바", rom: "asiba", jp: "足場", std: "비계", cat: "frame", m: { ko: "높은 곳 작업용 발판", en: "Scaffolding", ja: "高所作業用の足場" } },
    { t: "스미다시", rom: "seumidasi", jp: "墨出し", std: "먹매김", cat: "manage", m: { ko: "먹줄로 기준선을 표시하는 일", en: "Marking layout lines with an ink line", ja: "墨つぼで基準線を出すこと" } },
    { t: "미즈모리", rom: "mijeumori", jp: "水盛り", std: "수평 보기", cat: "manage", m: { ko: "수평을 잡는 일", en: "Finding level", ja: "水平を出すこと" } },
    { t: "구배", rom: "gubae", jp: "勾配", std: "기울기", cat: "manage", m: { ko: "물이 흐르도록 주는 경사", en: "A slope, e.g., so water drains", ja: "水が流れるようにつける傾き" } },
    { t: "오사마리", rom: "osamari", jp: "納まり", std: "마감 처리", cat: "manage", m: { ko: "자재와 자재가 만나는 부분의 마무리", en: "How materials meet and are finished at joints", ja: "材料同士が取り合う部分の仕上げ" } },
    { t: "기성", rom: "giseong", cat: "manage", m: { ko: "공사가 진행된 만큼 받는 대금", en: "Progress payment for work completed so far", ja: "工事の進み具合に応じた出来高払い" } },
    { t: "하자", rom: "haja", cat: "manage", m: { ko: "시공 뒤 생긴 결함, 보수 대상", en: "A construction defect that needs repair", ja: "施工後に見つかった欠陥(瑕疵)" } },
    { t: "고데", rom: "gode", jp: "鏝", std: "흙손", cat: "water", m: { ko: "미장할 때 쓰는 흙손", en: "Plastering trowel", ja: "左官で使うこて" } },
    { t: "방통", rom: "bangtong", cat: "water", m: { ko: "난방 배관 위에 치는 방바닥 몰탈", en: "Floor screed poured over heating pipes", ja: "床暖房配管の上に打つ床モルタル" } },
    { t: "사춤", rom: "sachum", cat: "water", m: { ko: "틈을 몰탈 등으로 메우는 일", en: "Packing gaps with mortar", ja: "すき間をモルタルで詰めること" } },
    { t: "메지", rom: "meji", jp: "目地", std: "줄눈", cat: "tile", m: { ko: "타일과 타일 사이의 줄", en: "The grout joint between tiles", ja: "タイルとタイルの間の目地" } },
    { t: "덧방", rom: "deotbang", cat: "tile", m: { ko: "기존 타일 위에 새 타일을 덧붙이는 시공", en: "Tiling over existing tile", ja: "既存タイルの上から重ね張り" } },
    { t: "도끼다시", rom: "dokkidasi", jp: "研ぎ出し", std: "갈아내기", cat: "tile", m: { ko: "갈아서 광을 내는 마감", en: "Grinding and polishing to a shine", ja: "研いでつやを出す仕上げ" } },
    { t: "와꾸", rom: "wakku", jp: "枠", std: "틀", cat: "wood", m: { ko: "문틀·창틀 같은 틀", en: "A frame, e.g., for a door or window", ja: "ドア枠・窓枠などの枠" } },
    { t: "다루끼", rom: "darukki", jp: "垂木", std: "각재", cat: "wood", m: { ko: "현장에서 쓰는 가는 각재", en: "Thin lumber battens used on site", ja: "現場で使う細い角材" } },
    { t: "덴조", rom: "denjo", jp: "天井", std: "천장", cat: "wood", m: { ko: "천장", en: "Ceiling", ja: "天井" } },
    { t: "뺑끼", rom: "ppaengkki", jp: "ペンキ", std: "페인트", cat: "finish", m: { ko: "페인트", en: "Paint", ja: "ペンキ" } },
    { t: "빠데", rom: "ppade", jp: "パテ", std: "퍼티", cat: "finish", m: { ko: "틈이나 구멍을 메우는 반죽", en: "Putty for filling holes and gaps", ja: "すき間や穴を埋めるパテ" } },
    { t: "시아게", rom: "siage", jp: "仕上げ", std: "마감", cat: "finish", m: { ko: "마지막 손질", en: "The finishing work", ja: "最後の仕上げ作業" } },
    { t: "노바시", rom: "nobasi", jp: "伸ばし", std: "연장", cat: "mep", m: { ko: "배관이나 전선을 이어서 늘리는 일", en: "Extending pipes or wires", ja: "配管や配線を継ぎ足して延ばすこと" } }
  ],

  /* ---------- 자주 묻는 질문 ---------- */
  faq: [
    { q: { ko: "언제부터 들을 수 있나요?", en: "When can I start learning?", ja: "いつから受講できますか?" },
      a: { ko: "지금은 정식 오픈을 준비하고 있어요. 강의는 공종별로 순서대로 열려요.", en: "We're preparing for launch. Courses will open trade by trade.", ja: "現在、正式オープンの準備中です。講座は工種ごとに順次公開します。" } },
    { q: { ko: "NEO PASS는 뭐예요?", en: "What is NEO PASS?", ja: "NEO PASSとは?" },
      a: { ko: "짧은 강의·현장 노하우와 인력사무소를 함께 쓰는 구독 수강권이에요. 월 29,000원 월 구독, 또는 평생교육이용권 35만원으로 1년 6개월 동안 쓸 수 있어요. 한 분야를 처음부터 끝까지 배우는 국비 전문과정은 내일배움카드나 단품 결제로 듣고, 구독 회원은 첫 2강을 맛보기로 볼 수 있어요. 평생교육이용권은 사용기관 등록을 마친 뒤 쓸 수 있어요.", en: "A subscription for short courses, on-site know-how and the Job Center: ₩29,000 a month, or 18 months with a ₩350,000 Lifelong Education Voucher. Full programs that teach one field from start to finish are government-funded or bought individually; members can preview the first 2 lessons. The voucher works once our provider registration is complete.", ja: "短い講座・現場のノウハウと人材センターが使えるサブスク型の受講プランです。月額29,000ウォン、または生涯教育利用券35万ウォンで1年6か月。ひとつの分野を最初から最後まで学ぶ国費専門コースは国費支援か単品購入で受講し、サブスク会員は最初の2講をお試しで見られます。利用券は利用機関登録の完了後に使えます。" } },
    { q: { ko: "내일배움카드(국비)로 들을 수 있나요?", en: "Can I use the Tomorrow Learning Card?", ja: "明日学びカード(国費)は使えますか?" },
      a: { ko: "한 분야를 처음부터 끝까지 체계적으로 배우는 전문과정을 내일배움카드(국비)로 열 예정이에요. 지금 과정 승인을 준비하고 있어요. 내일배움카드를 못 쓰는 분은 같은 과정을 단품 결제로 들을 수 있어요. 자부담 금액은 강의별 안내 페이지에서 볼 수 있어요.", en: "Full programs that teach one field from start to finish, step by step, will be government-funded (Tomorrow Learning Card); approval is in progress. If you can't use the card, you can buy the same course individually. The co-pay is shown on each course page.", ja: "ひとつの分野を最初から最後まで体系的に学ぶ専門コースを明日学びカード(国費)で開講予定で、いま承認を準備しています。カードを使えない方は同じ講座を単品購入で受講できます。自己負担額は各講座の案内ページで確認できます。" } },
    { q: { ko: "인력사무소는 누가 쓸 수 있나요?", en: "Who can use the Job Center?", ja: "人材センターは誰が使えますか?" },
      a: { ko: "NEO PASS 회원(월 구독·평생교육이용권)이라면 구인·구직·실습생 서비스를 모두 쓸 수 있어요.", en: "NEO PASS members (Monthly or Voucher) get hiring, job seeking, and trainee services.", ja: "NEO PASS会員(月額・利用券)なら求人・求職・実習生サービスをすべて使えます。" } },
    { q: { ko: "실습은 어디서 하나요?", en: "Where does hands-on practice happen?", ja: "実習はどこで行いますか?" },
      a: { ko: "NEO‑COLLAR가 직접 운영하지 않고, 각 지역 직업학교·인력사무소·현장 베테랑과 연계해 진행해요. 지역별 연계 기관은 정해지는 대로 알려드릴게요.", en: "We don't run it ourselves. Practice happens with local vocational schools, staffing offices, and veterans. We'll announce partners by region.", ja: "NEO‑COLLARは直接運営せず、各地域の職業学校・人材事務所・現場のベテランと提携して行います。地域ごとの提携先は決まり次第お知らせします。" } },
    { q: { ko: "베테랑은 어떻게 정산받나요?", en: "How do veterans get paid?", ja: "ベテランはどう精算されますか?" },
      a: { ko: "세 가지로 받아요. ① 저희가 요청드린 짧은 강의 영상이 검수를 통과하면 1편마다 제작비(길이별 5만·8만·12만 원), ② 구독·이용권 매출의 30%를 학생이 끝까지 본 영상 수와 길이대로 매달 나눠 드리고, ③ 국비 전문과정은 승인 후 수강료의 30%를 수강생마다 드려요(국비 과정 영상은 제작비 없음). 금액과 정산일은 정식 오픈 때 확정해요.", en: "Three ways. ① A production fee for each requested short lesson video that passes review (₩50,000 / ₩80,000 / ₩120,000 by length), ② 30% of subscription and voucher revenue, shared monthly by how many of your videos learners finish and their length, and ③ 30% of the course fee per learner for funded programs you make, once approved (no production fee for funded-program videos). Amounts and payout dates will be set at launch.", ja: "3つの方法で受け取れます。①こちらからお願いした短い講座動画が審査を通ると1本ごとに制作費(長さ別に5万・8万・12万ウォン)、②サブスク・利用券の売上の30%を、受講生が最後まで見た動画の本数と長さに応じて毎月分配、③国費専門コースは承認後、受講料の30%を受講生ごとにお支払いします(国費コースの動画に制作費はありません)。金額と精算日は正式オープン時に確定します。" } },
    { q: { ko: "나이가 많아도 베테랑이 될 수 있나요?", en: "Is there an age limit for veterans?", ja: "年齢が高くてもベテランになれますか?" },
      a: { ko: "나이 제한은 없어요. 오래 일한 경험이 곧 실력이에요. 맨 위 '글자 크게' 버튼으로 화면을 크게 볼 수 있어요.", en: "No age limit. Years on the job are what count. Use the 'Larger text' button at the top for bigger text.", ja: "年齢制限はありません。長年の経験こそが実力です。上の「文字を大きく」ボタンで画面を大きくできます。" } },
    { q: { ko: "경력자도 배울 게 있나요?", en: "Is there anything for experienced pros?", ja: "経験者にも学ぶことはありますか?" },
      a: { ko: "네. 하자·누수·단가·클레임처럼 남한테 묻기 애매했던 노하우를 '고급' 과정과 5~10분짜리 상황별 클립으로 준비하고 있어요.", en: "Yes. We're preparing advanced courses and 5–10 minute situational clips on defects, leaks, rates, and claims: things even pros hesitate to ask about.", ja: "はい。瑕疵・漏水・単価・クレームなど、今さら人に聞けないノウハウを「上級」講座と5〜10分の場面別クリップで準備しています。" } },
    { q: { ko: "커뮤니티는 어떻게 운영되나요?", en: "How will the community work?", ja: "コミュニティはどう運営されますか?" },
      a: { ko: "공종별 게시판과 주제별 게시판으로 운영할 예정이에요. 베테랑이 질문에 답하는 '베테랑에게 묻기'와 공종별 현장 용어 사전도 함께 준비하고 있어요.", en: "We'll run boards for each trade plus topic boards, including 'Ask a Veteran' and a site glossary for each trade.", ja: "工種別の掲示板とテーマ別の掲示板で運営する予定です。ベテランが質問に答える「ベテランに聞く」や、工種別の現場用語辞典も準備中です。" } },
    { q: { ko: "외국에서도 쓸 수 있나요?", en: "Can I use it outside Korea?", ja: "海外でも使えますか?" },
      a: { ko: "사이트는 한국어·영어·일본어를 지원해요. 나라별 월 구독료는 수강권 화면에서 볼 수 있어요.", en: "The site is in Korean, English and Japanese. Monthly prices by country are on the Plans page.", ja: "サイトは韓国語・英語・日本語に対応しています。国別の月額料金は受講プランのページで確認できます。" } }
  ]
};
