// pages/index.tsx
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, session, isLoading, isLoggedIn, logout, refreshSession } = useAuth();
  const router = useRouter();

  console.log('Home 렌더링 상태:', { user, session, isLoading, isLoggedIn });

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-4">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
        환영합니다!
      </h1>
      <p className="text-lg sm:text-xl mb-6 text-center">
        이곳은 당신의 멋진 프로젝트의 시작점입니다.
      </p>
      <div className="flex gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-200 hover:bg-red-300 text-red-800 px-5 py-2 rounded-lg shadow-md"
            >
              로그아웃
            </button>
          </div>

        ) : (
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md"
          >
            로그인
          </Link>
        )}

      </div>
    </div>
  );
}
