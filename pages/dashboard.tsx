import { GetServerSideProps } from 'next'
import { getCurrentUser } from '@/lib/dal'

export default function Dashboard() {
  return <h1>Dashboard: 보호된 페이지</h1>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getCurrentUser()

  if (!user) {
    return {
      redirect: { destination: '/login', permanent: false },
    }
  }

  return { props: {} }
}
