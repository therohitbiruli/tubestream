// In frontend/src/app/api/videos/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const video = await prisma.video.findUnique({ where: { id: Number(id) } });
  return NextResponse.json(video);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await request.json();
  const updatedVideo = await prisma.video.update({ where: { id: Number(id) }, data });
  return NextResponse.json(updatedVideo);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  await prisma.video.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}