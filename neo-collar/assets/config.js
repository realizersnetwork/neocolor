/* NEOCOLLAR 설정값 — 여기에는 공개돼도 괜찮은 값만 넣는다 (비밀번호·비밀 키 금지)
 *
 * 로그인 (수퍼베이스)
 *   supabaseUrl     : 수퍼베이스 → Project Settings → API → Project URL  (예: https://abcd1234.supabase.co)
 *   supabaseAnonKey : Project Settings → API Keys → Publishable key (sb_publishable_…, 원래 공개용이라 여기 넣어도 됨)
 *                     Secret key(sb_secret_…)·service_role 키는 절대 넣지 말 것
 *   → 둘 다 넣으면 로그인·회원가입(이메일, 구글)이 켜진다. 비어 있으면 버튼만 보이고 '곧 열려요' 안내
 *
 * 구글 애드센스
 *   adsenseClient : 게시자 ID (ca-pub-로 시작)
 *   adsenseSlot   : 광고 단위 ID (숫자). 디스플레이 광고 단위 하나를 만들어 모든 화면에 같이 쓴다
 *   → 둘 다 넣으면 화면마다 아래쪽에 광고 한 칸이 생긴다. 비어 있으면 아무것도 안 보인다
 */
window.NEO_CONFIG = {
  supabaseUrl: "https://imlxvwvfqbyznetkgtmv.supabase.co",
  supabaseAnonKey: "sb_publishable_lrYGPqWDTe5aOZYq5XjmsQ_y5lyECKC",
  adsenseClient: "",
  adsenseSlot: ""
};
