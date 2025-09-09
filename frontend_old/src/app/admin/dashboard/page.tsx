// In frontend/src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Video = {
  id: number;
  title: string;
  category: string;
  views: string;
  createdAt: string; // Prisma returns dates as ISO strings
};

export default function AdminDashboardPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    // We reuse the same API endpoint from the homepage!
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);
  
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this video?')) {
      const token = localStorage.getItem('admin-token');
      await fetch(`/api/videos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` } // We will use this token later for security
      });
      // Remove the deleted video from the list to update the UI instantly
      setVideos(videos.filter(video => video.id !== id));
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Link href="/admin/video/new">
            <button className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
              Upload New Video
            </button>
          </Link>
        </div>
        <div className="bg-gray-800 rounded-lg shadow">
          <ul className="divide-y divide-gray-700">
            {videos.map((video) => (
              <li key={video.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{video.title}</p>
                  <p className="text-sm text-gray-400">
                    {video.category} - {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href={`/admin/video/edit/${video.id}`}>
                    <button className="text-blue-400 hover:text-blue-300">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}