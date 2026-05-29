import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
}

interface JWTPayload {
  userId: number;
  email: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key';

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
      }

      const payload = decoded as JWTPayload;
      req.userId = payload.userId;
      req.userEmail = payload.email;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
};

export const generateToken = (userId: number, email: string): string => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  return jwt.sign(
    { userId, email },
    secret,
    { expiresIn }
  );
};

