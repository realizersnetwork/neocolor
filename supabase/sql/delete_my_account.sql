-- NEO-COLLAR 회원 탈퇴: 로그인한 사람이 '자기 계정만' 지울 수 있게 하는 함수
-- 수퍼베이스 → SQL Editor → New query 에 이 내용을 통째로 붙여넣고 Run (한 번만 하면 됨)
-- 사이트의 '회원 탈퇴' 버튼이 이 함수를 부른다 (app.js 의 deleteAccount)
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not logged in';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

-- 로그인 안 한 사람은 못 부르게, 로그인한 사람만 부를 수 있게
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
