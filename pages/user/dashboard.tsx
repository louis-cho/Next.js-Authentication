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

    const session = await verifySession(sessionToken);
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

    // 유저 정보 조회
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
        <div>
            <h1>User Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <p>Email: {user.email}</p>
        </div>
    );
}
