import { verifySession } from '@/lib/auth/session';
import { findUserById } from '@/repository/userRepository';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
    console.log("[Dashboard] req.cookies >>", context.req.cookies);

    const sessionToken = context.req.cookies.session;

    if (!sessionToken) {
        console.log("[Dashboard] 세션 쿠키 없음, 로그인 페이지로 리디렉트");
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const session = await verifySession(context.req.cookies);
    console.log("[Dashboard] 세션 >>", session);

    if (!session || session.role !== 'user') {
        console.log("[Dashboard] 세션 유효하지 않음 or 권한 부족, 로그인 페이지로 리디렉트");
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const user = await findUserById(session.userId);
    console.log("[Dashboard] 유저 >>", user);

    if (!user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            user: {
                name: user.name,
                email: user.email,
            },
        },
    };
}

export default function UserDashboard({ user }: { user: { name: string; email: string } }) {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-700 mb-4">👤 사용자 대시보드</h1>
                <p className="text-lg text-gray-700 mb-6">
                    <span className="font-medium text-gray-800">{user.name}</span>님, 환영합니다!
                </p>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">📧 이메일</p>
                    <p className="text-base font-semibold text-gray-800">{user.email}</p>
                </div>
            </div>
        </div>
    );
}
