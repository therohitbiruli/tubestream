// frontend/src/app/api/videos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const CDN_BASE = "https://tubestream01.b-cdn.net"; // ✅ your Bunny CDN base

// -------------------- GET video by ID --------------------
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const video = await prisma.video.findUnique({
      where: { id: Number(id) },
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // ✅ Normalize videoUrl before sending to frontend
    const normalizedVideo = {
      ...video,
      videoUrl: video.videoUrl.startsWith("http")
        ? video.videoUrl.replace(/https?:\/\/[^/]+/, CDN_BASE) // replace old domain
        : `${CDN_BASE}/${video.videoUrl}`, // prepend if only filename is stored
    };

    return NextResponse.json(normalizedVideo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

// -------------------- UPDATE video --------------------
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const data = await request.json();

  try {
    // ✅ Ensure we only store filename, not full URL
    if (data.videoUrl) {
      data.videoUrl = data.videoUrl.replace(/https?:\/\/[^/]+\//, ""); 
    }

    const updatedVideo = await prisma.video.update({
      where: { id: Number(id) },
      data,
    });

    // ✅ Normalize response before returning
    const normalizedVideo = {
      ...updatedVideo,
      videoUrl: updatedVideo.videoUrl.startsWith("http")
        ? updatedVideo.videoUrl.replace(/https?:\/\/[^/]+/, CDN_BASE)
        : `${CDN_BASE}/${updatedVideo.videoUrl}`,
    };

    return NextResponse.json(normalizedVideo);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 });
  }
}

// -------------------- DELETE video --------------------
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
