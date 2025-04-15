'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { API_URL } from '../../../../config';
import ChairCard from '../../components/ChairCard';
import Link from 'next/link';

export default function MyChairsPage() {
    const [chairs, setChairs] = useState([]);
    const [error, setError] = useState('');
    const token = Cookies.get('stsessionid');

    useEffect(() => {
        if (!token) {
            setError('Вы не авторизованы');
            return;
        }

        fetch(`${API_URL}/api/chair/my/`, {
            headers: { Authorization: `Token ${token}` },
            credentials: 'include',
        })
            .then(res => res.json())
            .then(data => setChairs(data))
            .catch(err => setError('Ошибка при загрузке'));
    }, [token]);

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-4">Мои скамейки</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {chairs.map(chair => (
                    <Link key={chair.id} href={`/chair/${chair.id}`}>
                        <ChairCard chair={chair} />
                    </Link>
                ))}
            </div>
        </div>
    );
}
