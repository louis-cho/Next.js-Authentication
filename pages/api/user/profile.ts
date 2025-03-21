import { withUserApi, withAdminApi } from '@/lib/auth/role-guards'

// /api/user/profile.ts
export default withUserApi(async (req, res, session) => {
  res.status(200).json({ message: `User ${session.userId} profile` })
})