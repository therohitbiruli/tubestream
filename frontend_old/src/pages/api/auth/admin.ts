// In frontend/src/pages/api/auth/admin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose'; // <-- Import from 'jose'
import { serialize } from 'cookie';
import prisma from '@/lib/prisma';
  
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // --- NEW TOKEN CREATION LOGIC using 'jose' ---
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    
    const token = await new SignJWT({ adminId: admin.id, email: admin.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h') // Token expires in 1 hour
      .sign(secret);
    // --- END OF NEW LOGIC ---

    const cookie = serialize('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });
    
    res.setHeader('Set-Cookie', cookie);
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("Login API Error:", error); // Add a console log to see future errors
    res.status(500).json({ message: 'Internal server error' });
  }
}