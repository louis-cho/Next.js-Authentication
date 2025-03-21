import { GetServerSideProps } from 'next'
import { isAdmin } from '@/lib/dal'

export default function AdminPage() {
    return <h1>Admin Dashboard</h1>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const admin = await isAdmin(context.req.cookies)

    if (!admin) {
        return {
            redirect: { destination: '/unauthorized', permanent: false },
        }
    }


    return { props: {} }
}
