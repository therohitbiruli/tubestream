// In frontend/src/app/api/videos/route.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(videos);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const newVideo = await prisma.video.create({ data });
  return NextResponse.json(newVideo, { status: 201 });
}