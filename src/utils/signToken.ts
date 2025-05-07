import jwt from 'jsonwebtoken';

export default function signToken(payload: { userId: string }): string {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
        throw new Error('JWT_SECRET environment variable is required');
    }

    return jwt.sign(payload, secretKey);
}