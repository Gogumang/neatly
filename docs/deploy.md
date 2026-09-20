# 배포 안내

## 1. Vercel 로그인 (사람이 한 번 해야 함)
```
npx vercel login
```

## 2. 프로젝트 연결 + 환경변수
저장소 루트에서:
```
npx vercel link
npx vercel env add OPENAI_API_KEY production
npx vercel env add ELEVENLABS_API_KEY production
npx vercel env add DATABASE_URL production
npx vercel env add NEXT_PUBLIC_SITE_URL production   # 예: https://ttobak.vercel.app
```
선택(기본값이 있어서 없어도 동작):
- `LLM_MODEL` (기본 gpt-5.4-mini), `TTS_MODEL`, `ELEVENLABS_MODEL`, `ELEVENLABS_CONCURRENCY`(기본 3)
- `IMAGE_MODEL` (기본 gpt-image-2). 표지 그림을 끄려면 `COVER_IMAGE=off`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — 넣으면 파일을 DB 대신 Supabase Storage 에 저장한다

## 3. 배포
```
npx vercel --prod
```

## 4. 배포 후 확인
- `/` 소개, `/new` 만들기, `/talks` 목록
- 나레이션 하나 만들어 보기 (약 15초)
- `node scripts/seed.mjs https://<배포주소>` — "또박을 또박으로 소개하는 나레이션" 생성
- 공유 카드: `https://<배포주소>/talks/<id>/opengraph-image`

## 알아둘 것
- **데이터베이스**: Supabase Postgres 의 `stage` 스키마만 쓴다. 기존 `public` 테이블은 건드리지 않는다.
  서버리스에서는 트랜잭션 풀러(6543 포트)를 쓴다.
- **파일**: Supabase Storage 키가 없으면 음성·이미지를 `stage.media` 테이블에 저장한다.
  이 경우 브라우저 → 서버 업로드가 Vercel 요청 크기 제한(4.5MB)을 넘을 수 없다.
- **실행 시간**: 무료 플랜은 함수 60초 제한. 대본 생성 약 6~15초, 목소리 약 5~10초라 여유가 있다.
- **비용 방어선**: OpenAI 프로젝트 예산 상한과 ElevenLabs 잔여 글자 수를 미리 확인한다.
