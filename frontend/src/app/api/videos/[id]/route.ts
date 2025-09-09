// frontend/src/app/api/videos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET video by ID
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // <- await is required in Next.js 15

  try {
    const video = await prisma.video.findUnique({
      where: { id: Number(id) }, // id must be a number if your DB uses int
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json(video);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

// Update video
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await request.json();

  try {
    const updatedVideo = await prisma.video.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updatedVideo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

// Delete video
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await prisma.video.delete({ where: { id: Number(id) } });
    return new NextResponse(null, { status: 204 }); // Success, no content
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
