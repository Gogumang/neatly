// 자막 안의 ⭐...⭐ 는 강조 표시다.

const STAR = /⭐️?/;

/** "여기 ⭐강조⭐ 문장" → [{text:"여기 ", em:false}, {text:"강조", em:true}, {text:" 문장", em:false}] */
export function parseEmphasis(text: string) {
  return text
    .split(STAR)
    .map((part, i) => ({ text: part, em: i % 2 === 1 }))
    .filter((p) => p.text.length > 0);
}

/** 나레이션용: 강조 기호를 뺀 문장 */
export function plainText(text: string) {
  return text.replace(new RegExp(STAR, "g"), "");
}

/** 장면 제목·키워드로 쓸 짧은 구절: ⭐강조⭐ 구절, 없으면 앞부분을 단어 단위로 자른다 */
export function keyPhrase(text: string, max = 14): string {
  const em = parseEmphasis(text).find((p) => p.em)?.text;
  if (em) return em;
  const plain = plainText(text)
    .replace(/[.!?]+$/, "")
    .trim();
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max);
  const space = cut.lastIndexOf(" ");
  return `${space > max / 2 ? cut.slice(0, space) : cut}…`;
}
