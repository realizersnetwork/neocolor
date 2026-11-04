/*
 * NEOCOLOR 강의 카탈로그
 * - categories: 공종 묶음(메뉴). subs는 메뉴 안의 세부 분류
 * - courses: 강의 목록. 아직 전부 '오픈 예정'이라 상세 페이지는 없음
 *   gov: 국비지원(국민내일배움카드) 예정 / voucher: 평생교육이용권 예정
 * 강의를 추가·수정할 때는 이 파일만 고치면 메뉴와 화면에 자동 반영됨
 */
window.NEO = {
  categories: [
    { id: "manage",   name: "공정·현장관리",  color: "#2f6bff", desc: "착공부터 준공까지, 공정 순서와 발주 타이밍", subs: ["공정관리", "발주·실측", "인입·협의", "준공 체크"] },
    { id: "civil",    name: "철거·토목",      color: "#a8733c", desc: "현장의 첫 단추, 철거·측량·기초",               subs: ["철거", "측량", "토목·기초", "콘크리트"] },
    { id: "frame",    name: "골조",           color: "#5b6472", desc: "건물의 뼈대, 형틀·철근·조적",                 subs: ["형틀목수", "철근", "슬리브·매립", "조적"] },
    { id: "water",    name: "방수·미장",      color: "#0098ad", desc: "물을 막고 면을 잡는 기술",                     subs: ["방수", "미장", "방바닥(방통)"] },
    { id: "mep",      name: "설비·배관",      color: "#1f9d6b", desc: "물과 난방, 에어컨이 지나가는 길",              subs: ["급수·배수", "난방", "냉난방", "위생기·욕실"] },
    { id: "elec",     name: "전기·통신·소방", color: "#d99400", desc: "선을 깔고 불을 켜는 기술",                     subs: ["전기 배선", "조명", "통신·인터폰", "소방"] },
    { id: "exterior", name: "창호·외장",      color: "#7a4dff", desc: "창과 외벽, 지붕을 마감하는 기술",              subs: ["샷시·창호", "단열", "징크·지붕"] },
    { id: "wood",     name: "목공·인테리어",  color: "#bf6a36", desc: "문틀부터 천장까지, 실내를 짓는 손",           subs: ["문틀·문", "가벽·천장", "몰딩", "주방가구"] },
    { id: "tile",     name: "타일·석재",      color: "#e03a7a", desc: "줄 하나에 실력이 보이는 마감",                 subs: ["타일", "실내 석재", "외장 석재"] },
    { id: "finish",   name: "도장·도배·마감", color: "#f26a10", desc: "마지막 손길이 집의 인상을 바꾼다",            subs: ["도장", "도배", "바닥재", "실리콘·코킹"] }
  ],

  courses: [
    // 공정·현장관리
    { id: "m1", cat: "manage", sub: "공정관리",  title: "소형 건축 공정관리 A to Z",     desc: "잔금부터 입주까지, 공정 순서 한 번에 정리",      hours: 16, level: "입문", format: "온라인",          gov: true },
    { id: "m2", cat: "manage", sub: "공정관리",  title: "현장소장 첫걸음",               desc: "작업자 배치·일정 조율·현장 소통의 기본",          hours: 20, level: "입문", format: "온라인+현장실습", gov: true },
    { id: "m3", cat: "manage", sub: "발주·실측", title: "골조 층수별 발주 타이밍",       desc: "문틀·단열재·대리석·샷시, 언제 주문해야 하나",     hours: 6,  level: "실무", format: "온라인" },
    { id: "m4", cat: "manage", sub: "발주·실측", title: "실측과 물량 산출 실무",         desc: "타일·대리석·샷시 수량 정확하게 뽑기",             hours: 8,  level: "실무", format: "온라인" },
    { id: "m5", cat: "manage", sub: "인입·협의", title: "정화조·도시가스·급수 인입 협의", desc: "놓치면 공사가 멈추는 협의 체크포인트",          hours: 5,  level: "실무", format: "온라인" },
    { id: "m6", cat: "manage", sub: "준공 체크", title: "비계 해체 전 마지막 점검",      desc: "외부 마감·실리콘·인입공사 체크리스트",            hours: 3,  level: "실무", format: "온라인" },

    // 철거·토목
    { id: "c1", cat: "civil", sub: "철거",      title: "건축 철거 실무 입문",            desc: "해체 순서와 폐기물 처리 기본",                     hours: 10, level: "입문", format: "온라인+현장실습" },
    { id: "c2", cat: "civil", sub: "측량",      title: "경계측량·현황측량 이해하기",     desc: "측량 결과 읽고 이웃·설계사와 협의하는 법",        hours: 4,  level: "입문", format: "온라인" },
    { id: "c3", cat: "civil", sub: "토목·기초", title: "소형 건축 토목 기초",            desc: "터파기·흙막이·버림 콘크리트",                      hours: 8,  level: "실무", format: "온라인" },
    { id: "c4", cat: "civil", sub: "콘크리트",  title: "주차장 콘크리트 타설",           desc: "레미콘 주문부터 양생까지",                         hours: 6,  level: "실무", format: "온라인+현장실습" },

    // 골조
    { id: "f1", cat: "frame", sub: "형틀목수",    title: "형틀목수 입문",                desc: "거푸집 짜기와 해체의 기본기",                      hours: 40, level: "입문", format: "온라인+현장실습", gov: true },
    { id: "f2", cat: "frame", sub: "철근",        title: "철근 배근 실무",               desc: "도면 보고 철근 배근하기",                          hours: 32, level: "입문", format: "온라인+현장실습", gov: true },
    { id: "f3", cat: "frame", sub: "슬리브·매립", title: "골조 단계 슬리브 매립",        desc: "엘리베이터·에어컨·설비 구멍 미리 잡기",            hours: 4,  level: "실무", format: "온라인" },
    { id: "f4", cat: "frame", sub: "조적",        title: "조적 기초",                    desc: "방수벽·칸막이 벽돌 쌓기",                          hours: 16, level: "입문", format: "현장실습" },

    // 방수·미장
    { id: "w1", cat: "water", sub: "방수",         title: "건축 방수 입문",               desc: "지하·옥상·욕실 방수 공법 비교",                    hours: 12, level: "입문", format: "온라인",          gov: true },
    { id: "w2", cat: "water", sub: "방수",         title: "골조 조인부위·지하 방수",      desc: "형틀 해체 직후 해야 할 방수 처리",                 hours: 6,  level: "실무", format: "온라인" },
    { id: "w3", cat: "water", sub: "방수",         title: "욕실·발코니 방수 실무",        desc: "액체방수부터 담수 테스트까지",                     hours: 16, level: "실무", format: "온라인+현장실습" },
    { id: "w4", cat: "water", sub: "미장",         title: "내부 미장과 사춤",             desc: "벽 면 잡기, 틈 메우기 실습",                       hours: 24, level: "입문", format: "현장실습",        gov: true },
    { id: "w5", cat: "water", sub: "방바닥(방통)", title: "방바닥 기포·몰탈",             desc: "층간소음재부터 마감 몰탈까지",                     hours: 12, level: "실무", format: "온라인+현장실습" },

    // 설비·배관
    { id: "p1", cat: "mep", sub: "급수·배수",   title: "건축 설비배관 입문",             desc: "급수·급탕·오배수 구조 이해",                       hours: 14, level: "입문", format: "온라인",          gov: true },
    { id: "p2", cat: "mep", sub: "급수·배수",   title: "수압 테스트 제대로 하기",        desc: "마감 전에 새는 곳 잡는 법",                        hours: 3,  level: "실무", format: "온라인" },
    { id: "p3", cat: "mep", sub: "난방",        title: "엑셀(XL) 난방배관 시공",         desc: "배관 간격과 분배기 연결 실습",                     hours: 12, level: "입문", format: "현장실습" },
    { id: "p4", cat: "mep", sub: "냉난방",      title: "시스템에어컨 천장 배관",         desc: "냉매·드레인 배관의 기본",                          hours: 16, level: "실무", format: "온라인+현장실습" },
    { id: "p5", cat: "mep", sub: "위생기·욕실", title: "위생기·수전 교체 실무",          desc: "양변기·세면대·수전 설치부터 욕실 돔천장까지",      hours: 10, level: "입문", format: "온라인+현장실습", voucher: true },

    // 전기·통신·소방
    { id: "e1", cat: "elec", sub: "전기 배선",   title: "전기기능사 실기 대비",           desc: "배관·배선 실습으로 자격증 준비",                   hours: 40, level: "입문", format: "현장실습",        gov: true },
    { id: "e2", cat: "elec", sub: "전기 배선",   title: "건축 전기 입선 기초",            desc: "배관·입선·분전반 이해",                            hours: 16, level: "입문", format: "온라인" },
    { id: "e3", cat: "elec", sub: "조명",        title: "조명·등박스 실무",               desc: "천장 조명 위치 잡기와 설치",                       hours: 8,  level: "입문", format: "온라인+현장실습", voucher: true },
    { id: "e4", cat: "elec", sub: "통신·인터폰", title: "비디오폰·월패드 설치",           desc: "세대 통신 배선의 기본",                            hours: 6,  level: "입문", format: "온라인" },
    { id: "e5", cat: "elec", sub: "소방",        title: "소방배관·감지기 이해",           desc: "소방 검사 전 꼭 볼 체크포인트",                    hours: 8,  level: "실무", format: "온라인" },

    // 창호·외장
    { id: "x1", cat: "exterior", sub: "샷시·창호", title: "샷시 실측과 틀 시공",          desc: "내부 창틀부터 창대석 샷시까지",                    hours: 12, level: "입문", format: "온라인+현장실습" },
    { id: "x2", cat: "exterior", sub: "단열",      title: "외단열 시공 실무",             desc: "단열재 부착과 마감의 기본",                        hours: 10, level: "실무", format: "온라인+현장실습" },
    { id: "x3", cat: "exterior", sub: "샷시·창호", title: "창대석 시공과 사춤 미장",      desc: "비 새지 않는 창 주변 마감",                        hours: 8,  level: "실무", format: "현장실습" },
    { id: "x4", cat: "exterior", sub: "징크·지붕", title: "징크 지붕·다락 마감",          desc: "자재 협의부터 실리콘 마무리까지",                  hours: 6,  level: "실무", format: "온라인" },

    // 목공·인테리어
    { id: "k1", cat: "wood", sub: "문틀·문",   title: "내장목수 입문",                    desc: "공구 다루기부터 문틀 설치까지",                    hours: 40, level: "입문", format: "온라인+현장실습", gov: true },
    { id: "k2", cat: "wood", sub: "가벽·천장", title: "단열 가벽 세우기",                 desc: "각재·석고보드로 벽 만들기",                        hours: 16, level: "입문", format: "현장실습" },
    { id: "k3", cat: "wood", sub: "가벽·천장", title: "천장 등박스·우물천장",             desc: "조명 자리를 만드는 천장 목공",                     hours: 12, level: "실무", format: "현장실습" },
    { id: "k4", cat: "wood", sub: "몰딩",      title: "걸레받이·몰딩 마감 디테일",        desc: "틈 없이 깔끔하게 마무리하기",                      hours: 4,  level: "입문", format: "온라인",          voucher: true },
    { id: "k5", cat: "wood", sub: "주방가구",  title: "싱크대(주방가구) 설치 실무",       desc: "실측·협의·시공 순서",                              hours: 10, level: "실무", format: "온라인+현장실습" },

    // 타일·석재
    { id: "t1", cat: "tile", sub: "타일",      title: "타일 시공 입문",                   desc: "벽·바닥 타일 붙이기 실습",                         hours: 40, level: "입문", format: "현장실습",        gov: true },
    { id: "t2", cat: "tile", sub: "타일",      title: "타일 실측과 자재 수량 계산",       desc: "로스까지 계산하는 실무 노하우",                    hours: 4,  level: "실무", format: "온라인" },
    { id: "t3", cat: "tile", sub: "타일",      title: "욕실 타일 리폼",                   desc: "덧방부터 줄눈까지",                                hours: 12, level: "입문", format: "온라인+현장실습", voucher: true },
    { id: "t4", cat: "tile", sub: "실내 석재", title: "계단 대리석 시공",                 desc: "디딤판·챌판 붙이기",                               hours: 16, level: "실무", format: "현장실습" },
    { id: "t5", cat: "tile", sub: "외장 석재", title: "외부 대리석·보행로 석재 시공",     desc: "외벽과 주차장 보행로 석재 마감",                   hours: 16, level: "실무", format: "현장실습" },

    // 도장·도배·마감
    { id: "n1", cat: "finish", sub: "도장",        title: "건축 도장 입문",               desc: "탄성페인트·일반 페인트 실습",                      hours: 24, level: "입문", format: "현장실습",        gov: true },
    { id: "n2", cat: "finish", sub: "도배",        title: "도배 기능 입문",               desc: "초배부터 정배까지",                                hours: 40, level: "입문", format: "현장실습",        gov: true, voucher: true },
    { id: "n3", cat: "finish", sub: "도배",        title: "셀프 도배·페인트",             desc: "우리 집 직접 바꿔보기",                            hours: 6,  level: "입문", format: "온라인",          voucher: true },
    { id: "n4", cat: "finish", sub: "바닥재",      title: "마루·장판 시공 실무",          desc: "바닥재 종류별 시공 순서",                          hours: 12, level: "입문", format: "온라인+현장실습" },
    { id: "n5", cat: "finish", sub: "실리콘·코킹", title: "실리콘·코킹 마감",             desc: "욕실·창호 실리콘 한 줄 깔끔하게",                  hours: 4,  level: "입문", format: "온라인+현장실습", voucher: true }
  ],

  // 메인 화면 '처음이라면 여기서 시작' 줄에 보여줄 강의
  starter: ["m1", "n2", "t1", "k1", "e1", "f1", "p5", "n5"]
};
