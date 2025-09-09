// In frontend/src/app/api/auth/admin/route.ts
import { NextResponse, NextRequest } from 'next/server'; // Correct import
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) { // Corrected signature
  const { email, password } = await request.json();
  
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({ adminId: admin.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secret);
    
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin-token', token, { httpOnly: true, secure: true, maxAge: 3600 });
  return response;
}