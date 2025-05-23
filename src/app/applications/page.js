'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_URL } from '../../../config';
import ChairCard from '../components/ChairCard';

export default function ModeratorPage() {
    const { user, loading } = useAuth();
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');
    const [appsLoading, setAppsLoading] = useState(true);
    const router = useRouter();
    const token = Cookies.get('stsessionid');
    const [status, setStatus] = useState('')
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
    }, [user, loading, status]);

    const fetchApplications = async () => {
        try {
            const res = await fetch(`${API_URL}/api/chair/?status=${status}&limit=20`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
            });
            if (!res.ok) throw new Error('Failed to load applications.');

            const data = await res.json();
            setApplications(data.results);
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
            <h1 className="text-3xl font-bold mb-3 text-white">Заявки</h1>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-2 py-1 rounded text-sm mb-5 bg-gray-800 text-white"
            >
                <option value="">Все заявки</option>
                <option value="published">Опубликованные</option>
                <option value="review">На усмотрении</option>
                <option value="rejected">Отклоненные</option>
                
            </select>


            {error && <p className="text-red-500 mb-4">{error}</p>}

            {appsLoading ? (
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
                                    className={`px-4 py-2  hover:bg-green-800 ${chair.status == "published" ? "bg-green-800" : "bg-green-600"} text-white rounded`}
                                    disabled={chair.status === 'published'}
                                >
                                    {chair.status === "published" ? (<span>Опубликовано</span>) : (<span>Опубликовать</span>)}
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(chair.id, 'review')}
                                    className={`px-4 py-2  hover:bg-blue-800 ${chair.status == "review" ? "bg-blue-800" : "bg-blue-600"} text-white rounded`}
                                    disabled={chair.status === 'review'}
                                >
                                    {chair.status === "review" ? (<span>На ревью</span>) : (<span>Ревью</span>)}
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(chair.id, 'rejected')}
                                    className={`px-4 py-2  hover:bg-red-800  ${chair.status == "rejected" ? "bg-red-800" : "bg-red-600"} text-white rounded`}
                                    disabled={chair.status === 'rejected'}
                                >
                                    {chair.status === "rejected" ? (<span>Отклонено</span>) : (<span>Отклонить</span>)}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-white">Нет заявок</p>
            )}
        </div>
    );
}
