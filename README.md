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

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Implemented Features

- 경매 목록 조회와 페이지 이동
- 경매 상세 조회
- 경매 등록
- 경매 제목/설명 수정
- 경매 삭제
- 입찰 등록
- 입찰 내역 조회
- 회원가입과 로그인 요청
