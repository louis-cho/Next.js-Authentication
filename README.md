# Next.js-Authentication
공식 문서를 보고 만드는 Next.js Authentication 예제

/pages
  /signup.tsx           → 회원가입 페이지
  /login.tsx            → 로그인 페이지
  /dashboard.tsx        → 일반 사용자 페이지
  /admin.tsx            → 관리자 전용 보호 페이지
  /unauthorized.tsx
  /api
    /auth
      signup.ts         → 회원가입 API
      login.ts          → 로그인 API
      logout.ts         → 로그아웃 API
/middleware.ts          → 세션/권한 확인
/lib
  session.ts     → 세션 관리 (이미 있음, 그대로 활용)
  auth.ts               → 세션, JWT 처리 함수
  db.ts                 → DB 연결
  validations.ts        → 로그인용 Zod 스키마 추가
  dal.ts         → 세션 검증 + user 데이터 fetch + role 확인
  dto.ts         → DTO 패턴 적용

/middleware.ts   → Optimistic Middleware