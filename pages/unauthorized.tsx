// pages/unauthorized.tsx
import Link from 'next/link';

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800">
            <h1 className="text-6xl font-bold mb-4">403</h1>
            <p className="text-xl mb-6">이 페이지에 접근할 권한이 없습니다.</p>
            <Link href="/" className="text-blue-500 hover:underline">
                메인 페이지로 돌아가기 →
            </Link>
        </div>
    );
}
