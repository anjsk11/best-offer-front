# Best Offer Frontend

희귀 물품 경매 플랫폼 `Best Offer`의 React 프론트엔드입니다.

## Stack

- Vite
- React
- TypeScript
- lucide-react

## API

개발 서버는 `/api` 요청을 `http://43.201.197.227:8080`으로 프록시합니다. 브라우저 CORS를 피하기 위해 로컬 개발에서는 `VITE_API_BASE_URL`을 비워둡니다.

환경별로 바꾸려면 `.env`를 만들고 아래 값을 설정하세요.

```env
VITE_API_BASE_URL=
```

정적 배포처럼 Vite 프록시를 사용할 수 없는 환경에서는 백엔드 CORS 설정 또는 별도 리버스 프록시가 필요합니다.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
```

PowerShell에서 `npm` 실행 정책 문제가 있으면 `npm.cmd`를 사용하세요.

## Project Structure

```text
src/
  api.ts
  App.tsx
  components/
  constants/
  features/
    account/
    auctions/
    home/
    mypage/
  types/
  utils/
```

- `App.tsx`: 전역 탭, 알림, 페이지 조립만 담당합니다.
- `features/home`: 홈 페이지, 메인 배너, 홈에 노출되는 인증 영역을 담당합니다.
- `features/account`: 홈에서 사용하는 회원가입/로그인 폼을 담당합니다.
- `features/auctions`: 경매 탐색, 상세, 입찰, 등록 흐름을 담당합니다.
- `features/mypage`: 백엔드 마이페이지 API가 준비되기 전까지 로컬에 저장한 닉네임 표시를 담당합니다.
- `components`: 도메인에 덜 묶인 레이아웃/공통 UI입니다.
- `constants`, `utils`, `types`: 표시 상수, 포맷터, 공통 타입입니다.

## Implemented Features

- 경매 제목/설명 수정은 상세 액션 영역의 버튼을 눌러 팝업에서 진행

- 홈 전용 메인 배너
- 홈 화면의 회원가입과 로그인 요청
- 경매 목록 조회와 페이지 이동
- 경매 상세 조회
- 경매 등록
- 경매 제목/설명 수정
- 경매 삭제
- 입찰 등록
- 입찰 내역 조회
- 마이페이지 닉네임 표시
