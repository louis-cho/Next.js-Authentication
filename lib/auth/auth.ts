import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
}

export const hasRole = (
    userRole: string | undefined,
    requiredRole: string
): boolean => {
    if (!userRole) return false;

    const hierarchy = ['viewer', 'user', 'staff', 'admin'];

    return (
        hierarchy.indexOf(userRole) >= hierarchy.indexOf(requiredRole)
    );
};