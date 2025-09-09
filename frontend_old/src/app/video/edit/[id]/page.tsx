// In frontend/src/app/admin/video/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VideoForm from '@/app/admin/components/VideoForm';

export default function EditVideoPage() {
  const params = useParams();
  const id = params.id;
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/videos/${id}`)
        .then(res => res.json())
        .then(data => setVideoData(data));
    }
  }, [id]);

  // Show a loading state until the video data is fetched
  if (!videoData) return <div>Loading...</div>;

  return <VideoForm initialData={videoData} />;
}