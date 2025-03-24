# Next.js-Authentication
공식 문서를 보고 만드는 Next.js Authentication 예제

/public                          # 정적 자산 (이미지, 폰트, favicon 등)
/pages
  └── index.tsx                  # 홈
  └── _app.tsx                   # 전역 설정 (AuthProvider 등)
  └── _document.tsx              # 커스텀 Document
  └── api/                       # API 라우트
      └── auth/
          └── login.ts
          └── logout.ts
      └── user/
          └── index.ts
      └── admin/
          └── dashboard.ts
  └── auth/                      # 인증 관련 페이지 (로그인, 회원가입)
      └── signin.tsx
      └── signup.tsx
  └── dashboard/                 # 대시보드 관련 페이지
      └── index.tsx
/components                     # 재사용 가능한 UI 컴포넌트
  └── common/                    # Header, Footer 등 공통
  └── auth/                      # 인증 전용 컴포넌트
  └── dashboard/
/layouts                         # 페이지 레이아웃 (관리자/유저 공통)
/hooks                           # 커스텀 React Hooks (useAuth 등)
/context                         # 글로벌 상태 (AuthContext 등)
/services                        # 비즈니스 로직, API 클라이언트 (서비스 계층)
/repository                      # DB 관련 or 외부 API 호출 (DAO 역할)
/lib                             # 유틸, DB 연결, 인증 처리
  └── db.ts
  └── auth.ts
/types                           # TypeScript 타입 (DTO, Entity)
/constants                       # 고정 상수 (routes, roles, messages)
/middlewares                     # 커스텀 미들웨어
/styles                          # 전역/모듈 CSS
/tests                           # 테스트 코드
/config                          # 환경설정
