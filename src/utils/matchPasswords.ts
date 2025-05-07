import bcrypt from 'bcrypt';

export default function comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}