'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_URL } from '../../../config';
import dynamic from 'next/dynamic';
const LocationPicker = dynamic(() => import('../components/LocationPicker'), { ssr: false });

export default function AddChair() {
  const token = Cookies.get('stsessionid');
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [city, setCity] = useState('');
  const [road, setRoad] = useState('');
  const [specs, setSpecs] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('User not authenticated. Please log in.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }
    formData.append('latitude', lat);
    formData.append('longitude', long);
    formData.append('city', city);
    formData.append('road', road);

    const specsArray = specs.split(',').map((item) => item.trim()).filter((item) => item);
    formData.append('specs', JSON.stringify(specsArray));

    try {
      const response = await fetch(`${API_URL}/api/chair/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error("Error message for jins:", errorData);
      }

      const data = await response.json();
      setSuccess('Chair created successfully!');

      setTitle('');
      setDescription('');
      setThumbnail(null);
      setLat('');
      setLong('');
      setCity('');
      setRoad('');
      setSpecs('');
      router.push('/chairs');

    } catch (err) {
      setSuccess('');
      setError(err.message);
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#2B2B2B] p-8 rounded-lg shadow-md w-full max-w-md text-white">
          <h1 className="text-2xl font-bold text-center mb-6">Add New Chair</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white">Title</label>
              <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
              <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows="3"
              />
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-white">Thumbnail</label>
              <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  required
                  className="mt-1 block w-full text-sm text-gray-900 file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-sky-600 file:text-white hover:file:bg-sky-700 cursor-pointer"
              />
            </div>

            {/* Кнопка + появляющиеся поля */}
            <div className="flex flex-col gap-2">
              {!lat && !long && !city && !road && (
                  <LocationPicker
                      onLocationSelect={({ lat, long, city, road }) => {
                        setLat(lat);
                        setLong(long);
                        setCity(city);
                        setRoad(road);
                      }}
                  />
              )}

              {(lat && long && city && road) && (
                  <>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-white">Latitude</label>
                        <input
                            type="text"
                            value={lat}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-white">Longitude</label>
                        <input
                            type="text"
                            value={long}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-white">City</label>
                        <input
                            type="text"
                            value={city}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-white">Road</label>
                        <input
                            type="text"
                            value={road}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                      </div>
                    </div>

                    <LocationPicker
                        onLocationSelect={({ lat, long, city, road }) => {
                          setLat(lat);
                          setLong(long);
                          setCity(city);
                          setRoad(road);
                        }}
                    />
                  </>
              )}
            </div>

            <div>
              <label htmlFor="specs" className="block text-sm font-medium text-white">Specs (Comma separated if multiple)</label>
              <textarea
                  id="specs"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows="2"
              />
            </div>

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
