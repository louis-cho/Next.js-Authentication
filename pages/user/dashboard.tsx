import { withUserPage } from '@/lib/auth/role-guards'
import { getUserById } from '@/lib/dal'

export const getServerSideProps = withUserPage(async (context, session) => {
    const user = await getUserById(session.userId)

    if (!user) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return { props: { user: { name: user.name, email: user.email } } }
})

export default function UserDashboard({ user }) {
    return (
        <div>
            <h1>User Dashboard</h1>
            <p>Welcome, {user.name}!</p>
            <p>Email: {user.email}</p>
        </div>
    )
}
