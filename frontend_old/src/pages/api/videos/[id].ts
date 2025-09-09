// In frontend/src/pages/api/videos/[id].ts

import type { NextApiRequest, NextApiResponse } from 'next';
// 1. IMPORT our new shared client
import prisma from '@/lib/prisma';

// 2. DELETE these two old lines:
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const video = await prisma.video.findUnique({
        where: { id: Number(id) },
      });
      if (video) {
        return res.status(200).json(video);
      } else {
        return res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch video' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, category } = req.body;
      const updatedVideo = await prisma.video.update({
        where: { id: Number(id) },
        data: { title, description, category },
      });
      return res.status(200).json(updatedVideo);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update video' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.video.delete({
        where: { id: Number(id) },
      });
      return res.status(204).end(); // 204 No Content
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete video' });
    }
  }

  // This part now correctly handles any other method that is not GET, PUT, or DELETE
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}