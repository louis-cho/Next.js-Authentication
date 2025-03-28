import { ROLES } from "@/constants/role";
import { AuthContext } from "@/context/AuthContext";
import { hasRole } from "@/lib/auth/auth";
import { useContext } from "react";

export const useAuth = () => {
    const { user, session, logout } = useContext(AuthContext)

    const isLoggedIn = !!user
    const isLoading = user === null && session === null // 로딩 중 판단

    return {
        user,
        session,
        isLoggedIn,
        isLoading,
        isAdmin: hasRole(user?.role, ROLES.ADMIN),
        isUser: hasRole(user?.role, ROLES.USER),
        isStaff: hasRole(user?.role, ROLES.STAFF),
        isViewer: hasRole(user?.role, ROLES.VIEWER),
        logout
    }
}
