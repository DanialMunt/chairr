'use client';

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../config';
import { usePathname } from 'next/navigation';
export default function ChairCard({ chair, onDelete }) {


  const pathname = usePathname();

  const isCompactPage = pathname === '/chairs' || pathname.startsWith('/chairs');


  const {
    id,
    title = 'Без названия',
    thumbnail,
    description,
    status,
    specs = [],
    road = 'Неизвестно',
    city = '',
  } = chair;

  const statusColor = []

  const token = Cookies.get('stsessionid');
  const router = useRouter();

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

      if (onDelete) {
        onDelete(id);
      } else {
        router.refresh();
        router.push('/');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting chair: ' + err.message);
    }
  };

  return (
    <div className="relative w-full bg-[#2B2B2B] border border-[#3B3B3B] rounded-2xl shadow-md overflow-hidden hover:opacity-70 cursor-pointer text-white">
      {thumbnail ? (
        <img src={thumbnail} alt={title} className="w-full h-60 object-cover" />
      ) : (
        <div className="w-full h-60 bg-[#1B1E1F] flex items-center justify-center"></div>
      )}
      <div className="p-4 space-y-2">
        <h2 className="text-md font-semibold truncate">{title}</h2>
        <div className="flex gap-2 items-center">
          <img src="/fluent_text-description-20-regular.png" alt="desc" className="h-7" />
          <p className="text-sm text-[#A6A199] mb-1">{description}</p>
        </div>

        <div className="flex gap-2 items-center">
          <img src="/proicons_location.png" alt="location" className="h-7" />
          <p className="text-sm text-[#A6A199] mb-1">{`${road}${city ? ', ' + city : ''}`}</p>
        </div>

        <div className="flex gap-2">
          {specs.map((spec, index) => (
            <div key={index} className="px-2 py-1 bg-[#1B1E1F] rounded">
              <p className="text-sm text-[#A6A199]">{spec}</p>
            </div>
          ))}
        </div>

        {!isCompactPage && (
          <div className="flex items-center">

            <p
              className={`px-2 py-1 mt-3 rounded text-white ${status === 'published'
                ? 'bg-green-600'
                : status === 'review'
                  ? 'bg-yellow-500'
                  : status === 'rejected'
                    ? 'bg-red-500'
                    : 'bg-gray-600'
                }`}
            >
              {status}
            </p>
          </div>

        )}



        {/* <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => router.push(`/update/${id}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
          >
            <img src="/material-symbols_edit-outline.png" alt="edit" className="h-7" />
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
          >
            <img src="/material-symbols_delete-outline.png" alt="delete" className="h-7" />
          </button>
        </div> */}
      </div>
    </div>
  );
}
