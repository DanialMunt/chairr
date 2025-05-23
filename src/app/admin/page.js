'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_URL } from '../../../config';
import ChairCard from '../components/ChairCard';
import { PieAdmin } from '../components/pieAdmin';

export default function ModeratorPage() {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [appsLoading, setAppsLoading] = useState(true);
  const router = useRouter();
  const token = Cookies.get('stsessionid');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (!user.groups.includes('moderator')) {
        router.replace('/chairs');
      } else {
        fetchApplications();
      }
    }
  }, [user, loading]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_URL}/api/chair/statistics/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to load applications.');

      const data = await res.json();
      console.log(data)
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setAppsLoading(false);
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
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Update failed.');

      setApplications((apps) => apps.filter((c) => c.id !== id));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading || !user) {
    return <p className="text-white">Checking permissions…</p>;
  }

  if (!user.groups.includes('moderator')) return null;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Панель управления</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {appsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-60 bg-[#2B2B2B] rounded mb-4" />
              <div className="h-6 bg-[#2B2B2B] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#2B2B2B] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : applications != undefined ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
          <PieAdmin
            draftCount={applications.draft_chairs_count}
            publishedCount={applications.published_chairs_count}
            rejectedCount={applications.rejected_chairs_count}
          />
          <PieAdmin
            draftCount={applications.draft_chairs_count}
            publishedCount={applications.published_chairs_count}
            rejectedCount={applications.rejected_chairs_count}
          />
          <PieAdmin
            draftCount={applications.draft_chairs_count}
            publishedCount={applications.published_chairs_count}
            rejectedCount={applications.rejected_chairs_count}
          />
          <PieAdmin
            draftCount={applications.draft_chairs_count}
            publishedCount={applications.published_chairs_count}
            rejectedCount={applications.rejected_chairs_count}
          />
          <PieAdmin
            draftCount={applications.draft_chairs_count}
            publishedCount={applications.published_chairs_count}
            rejectedCount={applications.rejected_chairs_count}
          />
          <PieAdmin
            draftCount={applications.draft_chairs_count}
            publishedCount={applications.published_chairs_count}
            rejectedCount={applications.rejected_chairs_count}
          />
        </div>
      ) : (
        <p className="text-white">No applications awaiting moderation.</p>
      )}
    </div>
  );
}
