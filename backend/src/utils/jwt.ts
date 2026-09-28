import jwt from 'jsonwebtoken';
import { UserRole } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smart_bus_secret_key_2026_fallback';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
