'use client'

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { API_URL } from "../../../../config";
export default function SinglePage() {

    const token = Cookies.get("stsessionid");
    const [chairs, setChairs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('')
    const [comments, setComments] = useState([]);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            fetchData();
            fetchComments(id)
            console.log("The cookie", token);
        } else {
            console.log("User not authenticated. Please log in.");
        }
    }, [token]);

   

    const handleSubmit = async (event) => {
        event.preventDefault();


        try {
            const response = await fetch(`${API_URL}/api/comment/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({
                    source: 'Chair',
                    source_id: id,
                    message: message,
                }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Invalid credentials or server error');
            }

            fetchComments(id);
            setMessage('')




            //   router.push('/chairs');

        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this chair?')) return;

        try {
            const response = await fetch(`${API_URL}/api/chair/${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${token}`,
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to delete the chair.');
            }

            router.refresh();
            router.push('/chairs');
        } catch (err) {
            console.error(err);
            alert('Error deleting chair: ' + err.message);
        }
    };


    const fetchData = async () => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        try {
            const response = await fetch(`${API_URL}/api/chair/${id}/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chairs. Unauthorized or server error.");
            }

            const data = await response.json();
            setChairs(data)
            console.log(data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };


    const fetchComments = async (id) => {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        try {
            const response = await fetch(`${API_URL}/api/comment/?source_id=${id}&limit=20`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chairs. Unauthorized or server error.");
            }

            const data = await response.json();
        
            setComments(data.results)
            console.log(data);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };




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
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">
                                        Комментировать
                                    </label>
                                    <input
                                        type="text"
                                        id="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Оставить комментарий
                                </button>
                            </form>


                        </div>
                    </div>

                    <div className="flex flex-col">
                        <h2 className="text-3xl font-semibold mb-1 truncate">{chairs.title}</h2>
                        <div className="flex gap-2 items-center">
                            <img src="/fluent_text-description-20-regular.png" alt="user" className="h-7" />
                            <p className="text-xl text-[#A6A199] mb-1">{chairs.description}</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <img src="/proicons_location.png" alt="user" className="h-7" />
                            <p className="text-xl text-[#A6A199] mb-1"> {chairs.location}</p>
                        </div>





                        {/* <div className="flex gap-2 mt-3">
                    {chairs.specs.map((spec, index) => (
                        <div key={index} className="px-2 py-1 bg-[#1B1E1F] rounded">
                            <p className="text-sm text-[#A6A199]">{spec}</p>
                        </div>
                    ))}
                </div> */}
                        {chairs.is_author ? (
                            <div className="flex gap-3 mt-5">
                                <button
                                    onClick={() => router.push(`/update/${id}`)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                                >
                                    <img src="/material-symbols_edit-outline.png" alt="user" className="h-7" />
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                                >
                                    <img src="/material-symbols_delete-outline.png" alt="user" className="h-7" />
                                </button>
                            </div>
                        ) : (<div></div>)}




                        <div className="flex flex-col mt-5 text-md text">
                            <span>Комментарий:</span>
                            <div className="flex flex-col gap-2">
                                {comments.slice().reverse().map((comment) => (

                                    <div key={comment.id} className="flex items-center justify-start h-10 w-50 bg-[#2B2B2B] rounded p-2">
                                        <span className="">{comment.message}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            )}
        </div>


    )




}