import { getCurrentUser } from './dal'

export async function getUserProfileDTO() {
  const user = await getCurrentUser()
  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}
