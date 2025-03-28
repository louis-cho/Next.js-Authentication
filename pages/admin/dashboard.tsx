// pages/admin/dashboard.tsx
import { withAdminPage } from "@/lib/auth/roleGuard"
import { useRouter } from "next/router"

export const getServerSideProps = withAdminPage(async (context, session) => {
  return { props: { userId: session.userId } }
})

export default function AdminDashboard({ userId }) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              🛠️ 관리자 대시보드
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            안녕하세요, <span className="font-semibold text-blue-600">{userId}</span>님.
            이곳은 관리자 전용 페이지입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
