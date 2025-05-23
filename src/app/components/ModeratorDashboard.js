'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import ChairCard from '../components/ChairCard';
import { API_URL } from "../../../config";
import { useAuth } from '../lib/AuthContext';
import { Router, useRouter } from 'next/navigation';

export default function ModeratorPage() {
  const token = Cookies.get('stsessionid');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter()
  useEffect(() => {
    if (!loading) {

      if (!user || !user.groups.includes('moderator')) {
        router.replace('/list');
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.groups.includes('moderator')) {
    return <p className="text-white">Checking permissions…</p>;
  }

  useEffect(() => {
    if (!token) {
      setError('User not authenticated. Please log in.');
      return;
    }
    fetchApplications();
  }, [token]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {

      const url = `${API_URL}/api/chair/?status=draft&limit=20`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load applications.');

      const data = await res.json();

      setApplications(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!confirm(`Mark chair #${id} as "${newStatus}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/chair/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed.');


      setApplications((apps) => apps.filter((c) => c.id !== id));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Moderator Dashboard</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-60 bg-gray-700 rounded mb-4" />
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {applications.map((chair) => (
            <div key={chair.id} className="flex flex-col">

              <ChairCard chair={chair} />

              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => handleStatusUpdate(chair.id, 'published')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleStatusUpdate(chair.id, 'review')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Mark as Review
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">No applications awaiting moderation.</p>
      )}
    </div>
  );
}
