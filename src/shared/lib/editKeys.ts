// 내가 만든 나레이션의 수정 키. 이 브라우저에만 저장한다 (없어도 나레이션 보기는 문제없다)
const key = (talkId: string) => `stage:edit:${talkId}`;

export function rememberEditKey(talkId: string, editKey: string) {
  try {
    localStorage.setItem(key(talkId), editKey);
  } catch {
    // 저장소를 못 쓰면 이 브라우저가 만든 나레이션임을 기억하지 못할 뿐이다
  }
}
