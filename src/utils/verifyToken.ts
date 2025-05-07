import jwt from 'jsonwebtoken';

export default function verifyToken(token: string) {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
        return decodedToken;
    } catch (error) {
        throw new Error('Invalid token');
    }
}
