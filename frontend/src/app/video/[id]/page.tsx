// In frontend/src/app/video/[id]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type Video = {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string;
  views: string;
};

export default function VideoPlayerPage() {
  const params = useParams();
  const id = params.id;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run the fetch if we have an ID
    if (id) {
      setLoading(true);
      setError(null);
      fetch(`/api/videos/${id}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Video not found');
          }
          return res.json();
        })
        .then((data: Video) => {
          setVideo(data);
        })
        .catch((err) => {
          console.error(err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // --- START OF THE FIX ---
  // This is the crucial part. We render different UI based on the state.

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading video...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">Error: {error}</div>;
  }

  if (!video) {
    // This handles the case where loading is done but there's still no video data
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Video data is not available.</div>;
  }
  // --- END OF THE FIX ---


  // This JSX will only be rendered if loading is false, there is no error, AND we have a video object.
  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black aspect-video mb-4">
          <video
            key={video.id}
            controls
            autoPlay
            playsInline
            className="w-full h-full"
          >
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{video.title}</h1>
        <p className="text-gray-400 mb-4">{video.views} views</p>
        <p className="text-gray-300">{video.description}</p>
      </div>
    </div>
  );
}