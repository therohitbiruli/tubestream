// In frontend/src/pages/api/videos/index.ts
// ... (keep the imports)
import prisma from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === 'GET') {
      // This part stays the same
      const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json(videos);
    } 
    
    if (req.method === 'POST') {
      // --- ADD THIS NEW LOGIC ---
      // TODO: Add token authentication here
      try {
        const { title, description, category } = req.body;
        const newVideo = await prisma.video.create({
          data: {
            title,
            description,
            category,
            thumbnail: 'https://via.placeholder.com/400x225.png?text=New+Video', // Placeholder
            videoUrl: 'placeholder.mp4', // Placeholder
            duration: '00:00', // Placeholder
          },
        });
        return res.status(201).json(newVideo);
      } catch (error) {
        return res.status(500).json({ message: 'Failed to create video' });
      }
      // --- END OF NEW LOGIC ---
    }
    
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }