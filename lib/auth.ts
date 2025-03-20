import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash)
}

export async function signToken(payload: object) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d') // 7일
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
    return jwtVerify(token, JWT_SECRET)
}
