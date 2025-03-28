import { SignJWT, jwtVerify } from 'jose';

export const DB_SECRET = new TextEncoder().encode(process.env.DB_SECRET!);
export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(payload: object, useSessionSecret = false) {
    const secret = useSessionSecret ? DB_SECRET : JWT_SECRET;
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secret);
}

export async function verifyToken(token: string, useSessionSecret = false) {
    const secret = useSessionSecret ? DB_SECRET : JWT_SECRET;
    try {
        const result = await jwtVerify(token, secret);
        console.log('[verifyToken] payload >>', result.payload);
        return result;
    } catch (err) {
        console.error('[verifyToken] JWT 검증 실패 >>', err);
        throw err;
    }
}
