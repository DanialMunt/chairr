'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function AddChair() {
  const token = Cookies.get('stsessionid');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [location, setLocation] = useState('');
  const [specs, setSpecs] = useState(''); // User enters comma-separated values
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

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
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    formData.append('location', location);

    // Process specs input: convert comma-separated string into an array,
    // then send as a JSON string.
    const specsArray = specs.split(',').map((item) => item.trim()).filter((item) => item);
    formData.append('specs', JSON.stringify(specsArray));

    try {
      const response = await fetch('http://165.232.79.109:39000/api/chair/', {
        method: 'POST',
        // Do not set the Content-Type header for multipart/form-data.
        headers: {
          Authorization: `Token ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error('Failed to create a new chair. Check the console for details.');
      }

      const data = await response.json();
      setSuccess('Chair created successfully!');
      // Reset form fields
      setTitle('');
      setDescription('');
      setThumbnail(null);
      setLocation('');
      setSpecs('');
      router.push('/chairs')
      // Optionally, redirect to another page:
      // router.push('/chairs');
    } catch (err) {
      setSuccess('');
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="bg-[#2B2B2B] p-8 rounded-lg shadow-md w-full max-w-md text-white">
        <h1 className="text-2xl font-bold text-center mb-6">Add New Chair</h1>
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
            <label htmlFor="description" className="block text-sm font-medium text-white">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
            />
          </div>
          {/* Thumbnail */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-white">
              Thumbnail
            </label>
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required
              className="mt-1 block w-full text-sm text-gray-900 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
            />
          </div>
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-white">
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
            <label htmlFor="specs" className="block text-sm font-medium text-white">
              Specs (Comma separated if multiple)
            </label>
            <textarea
              id="specs"
              value={specs}
              onChange={(e) => setSpecs(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              rows="2"
            />
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
