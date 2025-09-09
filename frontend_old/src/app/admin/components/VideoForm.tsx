// In frontend/src/app/admin/components/VideoForm.tsx
"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type VideoData = {
  id?: number;
  title: string;
  description: string;
  category: string;
  thumbnail?: string; // Add optional fields
  videoUrl?: string;
  duration?: string;
} | null;

export default function VideoForm({ initialData }: { initialData: VideoData }) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [duration, setDuration] = useState(initialData?.duration || '');

  const videoFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const isEditing = !!initialData;

  // Helper function to upload a file
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file); // Use generic 'file' field name

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload ${file.type.startsWith('image') ? 'thumbnail' : 'video'}.`);
    }

    const uploadData = await uploadRes.json();
    return uploadData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const toastId = toast.loading('Processing...');

    try {
      const videoFile = videoFileInputRef.current?.files?.[0];
      const thumbnailFile = thumbnailFileInputRef.current?.files?.[0];

      if (!isEditing && (!videoFile || !thumbnailFile)) {
        throw new Error("Please select both a video and a thumbnail file.");
      }

      let thumbnailPublicUrl = initialData?.thumbnail || '';
      if (thumbnailFile) {
        toast.loading('Uploading thumbnail...', { id: toastId });
        thumbnailPublicUrl = await uploadFile(thumbnailFile);
      }

      let videoPublicUrl = initialData?.videoUrl || '';
      if (videoFile) {
        toast.loading('Uploading video... (this may take a moment)', { id: toastId });
        videoPublicUrl = await uploadFile(videoFile);
      }

      const videoData = {
        title,
        description,
        category,
        duration,
        thumbnail: thumbnailPublicUrl,
        videoUrl: videoPublicUrl,
      };

      const url = isEditing ? `/api/videos/${initialData?.id}` : '/api/videos';
      const method = isEditing ? 'PUT' : 'POST';

      toast.loading('Saving video details...', { id: toastId });
      const dbRes = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData),
      });

      if (!dbRes.ok) {
        throw new Error('Failed to save video to database.');
      }

      toast.success(`Video successfully ${isEditing ? 'updated' : 'created'}!`, { id: toastId });
      router.push('/admin/dashboard');

    } catch (error: any) {
      toast.error(error.message || 'An error occurred.', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {isEditing ? 'Edit Video' : 'Upload New Video'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg">
          {/* Title, Description, Category inputs are the same */}
          <div><label>Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-gray-700 p-2 rounded" /></div>
          <div><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full bg-gray-700 p-2 rounded" rows={4} /></div>
          <div><label>Category</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full bg-gray-700 p-2 rounded" /></div>

          {/* New Duration Input */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300">Duration (e.g., 15:30)</label>
            <input
              type="text"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              className="w-full bg-gray-700 p-2 rounded"
            />
          </div>

          {/* Thumbnail Input */}
          <div>
            <label htmlFor="thumbnailFile" className="block text-sm font-medium text-gray-300">Thumbnail Image</label>
            <input
              type="file"
              id="thumbnailFile"
              ref={thumbnailFileInputRef}
              accept="image/*"
              required={!isEditing}
              className="w-full mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
            />
          </div>
          
          {/* Video File Input */}
          <div>
            <label htmlFor="videoFile" className="block text-sm font-medium text-gray-300">Video File</label>
            <input
              type="file"
              id="videoFile"
              ref={videoFileInputRef}
              accept="video/*"
              required={!isEditing}
              className="w-full mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => router.push('/admin/dashboard')} className="px-4 py-2 bg-gray-600 rounded">Cancel</button>
            <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 rounded disabled:bg-gray-500">
              {uploading ? 'Processing...' : (isEditing ? 'Save Changes' : 'Create Video')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}