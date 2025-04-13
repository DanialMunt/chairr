'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function UpdateChair() {
  const token = Cookies.get('stsessionid');
  const router = useRouter();
  const { id } = useParams(); // Requires a dynamic route: /update-chair/[id]
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [location, setLocation] = useState('');
  const [specs, setSpecs] = useState(''); // Comma-separated string
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch current chair details when component mounts
  useEffect(() => {
    if (!token || !id) return;
    const fetchChair = async () => {
      try {
        const response = await fetch(`http://localhost:39000/api/chair/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch chair details');
        }
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        // Convert the specs array (if applicable) to a comma-separated string
        if (Array.isArray(data.specs)) {
          setSpecs(data.specs.join(', '));
        } else {
          setSpecs(data.specs);
        }
        setCurrentThumbnail(data.thumbnail);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchChair();
  }, [token, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!token) {
      setError('User not authenticated. Please log in.');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('location', location);
    
    // Process specs: convert comma-separated string into an array and send as a JSON string
    const specsArray = specs
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
    formData.append('specs', JSON.stringify(specsArray));
    
    // Append a new thumbnail only if the user selects one
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      const response = await fetch(`http://165.232.79.109:39000/api/chair/${id}/`, {
        method: 'PUT', // Use PATCH if you prefer partial updates
        headers: {
          // Let the browser set the Content-Type when sending multipart/form-data
          Authorization: `Token ${token}`,
        },
        credentials: 'include',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error('Failed to update the chair. Check the console for details.');
      }
      const data = await response.json();
      setSuccess('Chair updated successfully!');
      router.push("/chairs")
      // Optionally, redirect to the chairs list page
      // router.push('/chairs');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-[#2B2B2B] p-8 rounded-lg shadow-md w-full max-w-md text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Update Chair</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
              Thumbnail (Leave empty to keep current)
            </label>
            {currentThumbnail && !thumbnail && (
              <div className="mb-2">
                <img src={currentThumbnail} alt={title} className="w-full h-32 object-cover" />
              </div>
            )}
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-900 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
            />
          </div>
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Specs */}
          <div>
            <label htmlFor="specs" className="block text-sm font-medium text-gray-700">
              Specs (Comma separated if multiple)
            </label>
            <textarea
              id="specs"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              rows="2"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Chair
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
