export const ROLES = {
    VIEWER: 'viewer',
    USER: 'user',
    STAFF: 'staff',
    ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_HIERARCHY = [
    ROLES.VIEWER,
    ROLES.USER,
    ROLES.STAFF,
    ROLES.ADMIN,
];
