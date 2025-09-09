// In frontend/src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  
  const buffer = Buffer.from(await file.arrayBuffer());
  const subfolder = file.type.startsWith('image') ? 'thumbnails' : 'videos';
  const uploadDir = path.join(process.cwd(), 'public', subfolder);
  await fs.mkdir(uploadDir, { recursive: true });
  
  const uniqueFilename = `${Date.now()}_${file.name}`;
  await fs.writeFile(path.join(uploadDir, uniqueFilename), buffer);
  
  const publicUrl = `/${subfolder}/${uniqueFilename}`;
  return NextResponse.json({ publicUrl });
}