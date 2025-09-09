// In frontend/src/app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Use Next.js Image for better performance

// Define the shape of our video data
type Video = {
  id: number;
  title: string;
  thumbnail: string; // We'll add this field to the DB soon
  views: string;
  createdAt: string; // Prisma sends dates as strings
  duration: string;
};

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch videos from our API endpoint
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch videos:', error);
        setLoading(false);
      });
  }, []); // Empty array ensures this runs only once on mount

  // Helper to format date nicely (e.g., "2 days ago")
  const timeAgo = (dateString: string) => {
    // You can use a library like `date-fns` for more robust formatting
    return new Date(dateString).toLocaleDateString();
  };
  
  const categories = ["All", "React", "Next.js", "Docker", "Database", "CSS", "DevOps"];

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">TubeStream</Link>
          <div className="hidden md:flex items-center space-x-4">
            {categories.map(cat => (
              <button key={cat} className={`px-3 py-1 rounded-md text-sm font-medium ${cat === "All" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <input type="search" placeholder="Search videos..." className="hidden sm:block px-3 py-1.5 border rounded-md" />
            
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center">Latest Videos</h1>
        <p className="text-gray-500 text-center mt-2 mb-8">Discover amazing content from developers around the world</p>

        {loading ? (
          <p className="text-center">Loading videos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link href={`/video/${video.id}`} key={video.id} className="group">
                <div className="aspect-video bg-gray-900 rounded-lg mb-2 overflow-hidden relative">
                  {/* We'll replace this with a real thumbnail Image soon */}
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">{video.duration}</span>
                </div>
                <h3 className="font-semibold text-lg text-blue-600 group-hover:underline">{video.title}</h3>
                <div className="text-sm text-gray-500 flex items-center space-x-4 mt-1">
                  <span>👁️ {video.views}K</span>
                  <span>🕒 {timeAgo(video.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
         <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">TubeStream</h3>
              <p className="text-gray-400 text-sm">The best platform for developers to share knowledge and learn from each other.</p>
            </div>
             <div>
              <h4 className="font-semibold mb-2">Categories</h4>
              <ul className="text-sm space-y-1 text-gray-400">
                <li><a href="#" className="hover:underline">React</a></li>
                <li><a href="#" className="hover:underline">Next.js</a></li>
                <li><a href="#" className="hover:underline">Docker</a></li>
                <li><a href="#" className="hover:underline">Database</a></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="text-sm space-y-1 text-gray-400">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Community</a></li>
                <li><a href="#" className="hover:underline">Guidelines</a></li>
                <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold mb-2">Contact</h4>
               <ul className="text-sm space-y-1 text-gray-400">
                <li>hello@tubestream.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
         </div>
      </footer>
    </div>
  );
}