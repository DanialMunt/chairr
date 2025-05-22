'use client';

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { API_URL } from "../../../../config";

export default function SinglePage() {
    const token = Cookies.get("stsessionid");
    const [chairs, setChairs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [comments, setComments] = useState([]);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            fetchData();
            fetchComments(id);
        }
    }, [token]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/comment/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    source: 'Chair',
                    source_id: id,
                    message,
                }),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Ошибка отправки комментария');

            fetchComments(id);
            setMessage('');
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this chair?')) return;
        try {
            const response = await fetch(`${API_URL}/api/chair/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Token ${token}` },
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to delete the chair.');

            router.refresh();
            router.push('/chairs');
        } catch (err) {
            alert('Error deleting chair: ' + err.message);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/chair/${id}/`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch chair");
            const data = await response.json();
            setChairs(data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/comment/?source_id=${id}&limit=20`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                credentials: "include",
            });
            if (!response.ok) throw new Error("Failed to fetch comments");
            const data = await response.json();
            setComments(data.results);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Группировка комментариев по авторам
    const groupedComments = comments.reduce((acc, comment) => {
        const email = comment.author?.email || 'unknown';
        if (!acc[email]) acc[email] = [];
        acc[email].push(comment.message);
        return acc;
    }, {});

    return (
        <div className="">
            {loading ? (
                <div className="flex gap-10 text-white mt-10">
                    <div className="w-[500px] h-[500px] rounded-md bg-[#2B2B2B] animate-pulse" />
                    <div className="flex flex-col gap-3 animate-pulse">
                        <div className="h-10 w-50 bg-[#2B2B2B] rounded"></div>
                        <div className="h-7 w-40 bg-[#2B2B2B] rounded"></div>
                        <div className="h-7 w-30 bg-[#2B2B2B] rounded"></div>
                    </div>
                </div>
            ) : (
                <div className="flex gap-10 text-white mt-10">
                    <div className="flex flex-col gap-2">
                        <img src={chairs.thumbnail} alt={chairs.title} className="w-[500px] h-[500px] object-cover rounded-md" />
                        <form onSubmit={handleSubmit} className="mt-4">
                            <label className="block text-sm font-medium mb-1">Комментировать</label>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-white"
                            />
                            <button
                                type="submit"
                                className="mt-2 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Оставить комментарий
                            </button>
                        </form>
                    </div>

                    <div className="flex flex-col w-full max-w-2xl">
                        <h2 className="text-3xl font-semibold mb-2 truncate">{chairs.title}</h2>
                        <div className="flex gap-2 items-center mb-1">
                            <img src="/fluent_text-description-20-regular.png" alt="desc" className="h-6" />
                            <p className="text-xl text-[#A6A199]">{chairs.description}</p>
                        </div>
                        <div className="flex gap-2 items-center mb-4">
                            <img src="/proicons_location.png" alt="loc" className="h-6" />
                            <p className="text-xl text-[#A6A199]">{`${chairs.road}${chairs.city ? ', ' + chairs.city : ''}`}</p>
                        </div>

                        {chairs.is_author && (
                            <div className="flex gap-3 mb-4">
                                <button onClick={() => router.push(`/update/${id}`)} className="bg-green-600 px-3 py-1 rounded">
                                    <img src="/material-symbols_edit-outline.png" alt="edit" className="h-6" />
                                </button>
                                <button onClick={handleDelete} className="bg-red-600 px-3 py-1 rounded">
                                    <img src="/material-symbols_delete-outline.png" alt="delete" className="h-6" />
                                </button>
                            </div>
                        )}

                        <div className="mt-5 text-md">
                            <span className="font-semibold mb-2 block">Комментарии:</span>
                            <div className="flex flex-col gap-4">
                                {Object.entries(groupedComments).map(([email, messages], idx) => (
                                    <div key={idx} className="bg-[#1F1F1F] p-3 rounded-md">
                                        <p className="text-sm text-gray-400 mb-1">{email}</p>
                                        {messages.map((msg, i) => (
                                            <div key={i} className="bg-[#2B2B2B] text-white p-2 rounded mb-1">
                                                {msg}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
