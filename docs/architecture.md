# 폴더 구조 (FSD)

기능이 늘어도 어디에 둘지 헷갈리지 않도록 Feature-Sliced Design 의 계층을 따른다.
**위 계층은 아래 계층만 가져다 쓴다.** 아래가 위를 가져오는 순간 구조가 무너지므로 그것만은 막는다.

```
app        Next.js 라우팅, 레이아웃, API 라우트
widgets    한 화면을 이루는 조립 단위 (플레이어, 웹툰, 숏폼, 나레이션 모음, 랜딩 구획)
features   사용자가 하는 일 (나레이션 만들기, 좋아요, 수어 자막 켜기, 공유하기)
entities   도메인 그 자체 (나레이션 = 형식·장르·길이·목소리·장면 템플릿)
shared     어디서나 쓰는 것 (디자인 토큰과 UI 조각, 작은 함수, 서버 공용 코드)
```

의존 방향: `app → widgets → features → entities → shared`

## 각 계층에 무엇이 있나

- **app** — `src/app`. 라우트 파일과 API 라우트. 화면 조립은 widgets 에 맡기고 여기서는 데이터를 읽어 넘긴다.
- **widgets** — `src/widgets`. 여러 feature·entity 를 모아 한 덩어리 화면을 만든다.
  - `player` 나레이션 재생, `webtoon` 세로로 읽는 웹툰, `shortform` 세로 숏폼,
    `gallery` 나레이션 모음, `landing` 첫 화면 구획들, `lock` 비밀번호 화면
- **features** — `src/features`. 하나의 행동에 필요한 화면과 로직.
  - `create-talk` 만들기 퍼널, `sign` 수어 어순 자막, `share` 공유 이미지·링크
- **entities** — `src/entities/talk`. 나레이션의 타입, 형식·장르·길이·목소리 목록,
  자막·타임라인 계산(`karaoke.ts`, `timeline.ts`), 재생 훅(`lib/usePlayback` 등),
  장면 템플릿(`ui/scene-templates`).
- **shared** — `src/shared`. 디자인 토큰과 버튼·입력 같은 UI 조각(`ui`), 작은 함수(`lib`),
  그리고 서버에서만 쓰는 공용 코드(`server`: 저장소, LLM·음성·이미지 호출, 링크 가져오기).

## 지키는 규칙

- 같은 계층끼리는 서로 가져오지 않는다. 둘 다 필요하면 한 단계 아래로 내리거나, 위에서 조립한다.
- `shared/server` 는 서버 전용이다(`import "server-only"`). 화면 코드에서 부르지 않는다.
- 한 파일은 150줄, 한 함수는 80줄을 넘기지 않는다 (biome 이 막는다).
- 쓰지 않는 파일·export 는 남기지 않는다 (knip 이 막는다).
