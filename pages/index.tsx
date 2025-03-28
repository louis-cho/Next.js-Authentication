// pages/index.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
        환영합니다!
      </h1>
      <p className="text-lg sm:text-xl mb-6 text-center">
        이곳은 당신의 멋진 프로젝트의 시작점입니다.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg shadow-md"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}
