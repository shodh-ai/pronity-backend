import { Request, Response } from 'express';
import { findUserByEmail, registerUser } from '../services/authService.js';
import AuthPayload from '../types/AuthPayload.js';
import hashPassword from '../utils/hashPassword.js';
import signToken from '../utils/signToken.js';
import comparePassword from '../utils/matchPasswords.js';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as AuthPayload;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const token = signToken({ userId: user.id });
        res.status(200).json({ message: 'Login successful', data: token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
}

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body as AuthPayload;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }

    try {
        const existingUser = await findUserByEmail(email);
        const hashedPassword = await hashPassword(password);
        if (existingUser) {
            res.status(409).json({ message: 'Email already in use' });
            return;
        }
        const newUser = await registerUser(email, hashedPassword);
        const token = signToken({ userId: newUser.id });
        res.status(201).json({ message: "User registered successfully", data: token });

    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error && error.message === 'Email already exists') {
            res.status(409).json({ message: 'Email already in use' });
        } else {
            res.status(500).json({ message: 'Internal server error during registration' });
        }
    }
};