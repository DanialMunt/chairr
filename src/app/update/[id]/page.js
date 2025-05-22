'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_URL } from '../../../../config';
import dynamic from 'next/dynamic';
const LocationPicker = dynamic(() => import('../../components/LocationPicker'), { ssr: false });

export default function UpdateChair() {
  const token = Cookies.get('stsessionid');
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [currentThumbnail, setCurrentThumbnail] = useState(null);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [city, setCity] = useState('');
  const [road, setRoad] = useState('');
  const [specs, setSpecs] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    const fetchChair = async () => {
      try {
        const response = await fetch(`${API_URL}/api/chair/${id}/`, {
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
        setLat(data.latitude);
        setLong(data.longitude);
        setCity(data.city);
        setRoad(data.road);
        setSpecs(Array.isArray(data.specs) ? data.specs.join(', ') : data.specs);
        setCurrentThumbnail(data.thumbnail);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('latitude', lat);
    formData.append('longitude', long);
    formData.append('city', city);
    formData.append('road', road);
    const specsArray = specs.split(',').map((item) => item.trim()).filter((item) => item);
    formData.append('specs', JSON.stringify(specsArray));
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      const response = await fetch(`${API_URL}/api/chair/${id}/`, {
        method: 'PUT',
        headers: {
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
      await response.json();
      setSuccess('Chair updated successfully!');
      router.push('/chairs');
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#2B2B2B] p-8 rounded-lg shadow-md w-full max-w-md text-white">
          <h1 className="text-2xl font-bold text-center mb-6">Update Chair</h1>
          {loading ? (
              <p className="text-center text-white">Загрузка...</p>
          ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white">Title</label>
                  <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white">Description</label>
                  <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows="3"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-white">Thumbnail</label>
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
                      className="mt-1 block w-full"
                  />
                </div>

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

                  {lat && long && city && road && (
                      <>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white">Координаты</label>
                            <input
                                type="text"
                                value={`${lat}, ${long}`}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-white">Адрес</label>
                            <input
                                type="text"
                                value={`${road}, ${city}`}
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
                        <button
                            type="button"
                            onClick={() => {
                              setLat('');
                              setLong('');
                              setCity('');
                              setRoad('');
                            }}
                            className="text-sm text-blue-400 underline mt-2"
                        >
                          Изменить локацию
                        </button>
                      </>
                  )}
                </div>

                <div>
                  <label htmlFor="specs" className="block text-sm font-medium text-white">Specs (Comma separated)</label>
                  <textarea
                      id="specs"
                      value={specs}
                      onChange={(e) => setSpecs(e.target.value)}
                      rows="2"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Chair
                </button>
              </form>
          )}
        </div>
      </div>
  );
}
