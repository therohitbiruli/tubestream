// In frontend/src/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { formidable } from 'formidable';
import path from 'path';
import fs from 'fs/promises';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '500mb',
  },
};

const ensureUploadDirExists = async (dir: string) => {
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const form = formidable({ keepExtensions: true });

  try {
    const [fields, files] = await form.parse(req);
    const uploadedFile = files.file?.[0]; // Use a generic 'file' field name

    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Determine if the file is an image or video
    const isImage = uploadedFile.mimetype?.startsWith('image');
    const subfolder = isImage ? 'thumbnails' : 'videos';

    const uploadDir = path.join(process.cwd(), 'public', subfolder);
    await ensureUploadDirExists(uploadDir);
    
    const uniqueFilename = `${Date.now()}_${uploadedFile.originalFilename}`;
    const newPath = path.join(uploadDir, uniqueFilename);
    
    // Move the file from the temp location to our final destination
    await fs.rename(uploadedFile.filepath, newPath);

    const publicUrl = `/${subfolder}/${uniqueFilename}`;

    res.status(200).json({ publicUrl: publicUrl });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'File upload failed.' });
  }
}