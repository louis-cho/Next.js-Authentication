// pages/admin/dashboard.tsx
import { withAdminPage } from "@/lib/auth/role-guards"

export const getServerSideProps = withAdminPage(async (context, session) => {
  return { props: { userId: session.userId } }
})

export default function AdminDashboard({ userId }) {
  return <h1>관리자 대시보드 - {userId}</h1>
}
