import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import { env } from '../environment'

export async function createHash(password: string): Promise<string> {
	return await argon2.hash(password)
}

export async function verifyHash(
	hash: string,
	password: string
): Promise<boolean> {
	return await argon2.verify(hash, password)
}

export function createAccessToken<PayloadT extends object>(
	payload: PayloadT
): string {
	const iat = Math.floor(Date.now() / 1000) // Issued At Time in seconds

	return jwt.sign({ ...payload, iat }, env.secret, { expiresIn: '15m' })
}

type AccessTokenPayload<T> = {
	success: boolean
	message: string
	decoded?: T
}

export function checkAccessToken<T>(token: string): AccessTokenPayload<T> {
	try {
		const decoded = jwt.verify(token, env.secret)
		return {
			success: true,
			message: 'Token is valid',
			decoded: decoded as T,
		}
	} catch (error: any) {
		return {
			success: false,
			message: error.name,
		}
	}
}
