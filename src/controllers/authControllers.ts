import { Request, Response } from 'express';
import { findUserByEmail, registerUser } from '../services/authService.js';
import AuthPayload from '../types/AuthPayload.js';
import RegisterPayload from '../types/RegisterPayload.js';
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
        
        // Return token in expected format with user info
        res.status(200).json({
            token: token,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
}

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body as RegisterPayload;

    if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
    }
    
    // Name is optional, will use default if not provided

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            res.status(409).json({ message: 'Email already in use' });
            return;
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await registerUser(email, hashedPassword, name); // Update the registerUser call to pass the name parameter
        const token = signToken({ userId: newUser.id });
        
        // Return token in expected format with user info
        res.status(201).json({
            token: token,
            user: {
                id: newUser.id,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof Error && error.message === 'Email already exists') {
            res.status(409).json({ message: 'Email already in use' });
        } else {
            res.status(500).json({ message: 'Internal server error during registration' });
        }
    }
};