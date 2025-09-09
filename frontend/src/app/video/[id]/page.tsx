// In frontend/src/app/video/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type Video = {
  id: number;
  title: string;
  description: string;
  videoUrl: string; // We'll use a placeholder for now
  views: string;
  category: string;
};

export default function VideoPlayerPage() {
  const params = useParams();
  const id = params.id;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/videos/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setVideo(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch video:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading video...</div>;
  }

  if (!video) {
    return <div className="p-8 text-center">Video not found.</div>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
      <div className="bg-black aspect-video mb-4">
  <video
    key={video.id} // Add a key to force re-render when video changes
    controls
    autoPlay
    playsInline
    className="w-full h-full"
  >
    <source src={video.videoUrl} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
        <h1 className="text-3xl font-bold mb-2">{video.title}</h1>
        <p className="text-gray-400 mb-4">{video.views} views</p>
        <p className="text-gray-200">{video.description}</p>
        {/* Suggested Videos section would go here */}
      </div>
    </div>
  );
}