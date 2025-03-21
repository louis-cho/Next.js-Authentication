# Next.js-Authentication
공식 문서를 보고 만드는 Next.js Authentication 예제

/lib
 └── /auth
      ├── access-control.ts       // public/user/admin 경로 변수 관리
      ├── session.ts              // 세션 생성/검증 (지금 쓰시던 거)
      ├── role-guards.ts          // SSR + API 공통 보호 wrapper
      └── middleware-guard.ts     // Middleware 보호 빠른 처리
/pages
 ├── index.tsx                   // Public
 ├── login.tsx                   // Public
 ├── /dashboard.tsx              // User
 ├── /admin/dashboard.tsx        // Admin
 └── api
      ├── /user/profile.ts       // User API
      └── /admin/session-manage.ts // Admin API