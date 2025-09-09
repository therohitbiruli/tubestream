// In frontend/src/app/admin/video/new/page.tsx

// This is a simple wrapper component.
// For now, it doesn't do much, but it's where we would
// fetch data for an existing video if we were editing.
// We will build the actual form in a separate component to keep it clean.
import VideoForm from '@/app/admin/components/VideoForm';

export default function NewVideoPage() {
  // For a new video, we pass `null` as the initial data.
  return <VideoForm initialData={null} />;
}