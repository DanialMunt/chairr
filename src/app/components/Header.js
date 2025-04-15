
"use client"
import { useAuth } from '../lib/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="flex justify-between items-center bg-[#2B2B2B] p-5">
      <Link href="/">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="h-10" />
          <span className="text-white font-bold">ChillChair</span>
        </div>
      </Link>

      {isLoggedIn ? (
        <div className="flex gap-3 justify-between items-center">
          <Link href="/add">
            <button className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Добавить скамейку</button>
          </Link>
          <Link href="/chair/my">
            <button className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Мои скамейки</button>
          </Link>
          <button onClick={logout} className="py-3 px-5 text-red-500 border border-b-red-500 rounded-md cursor-pointer hover:opacity-50">
            Выйти
          </button>
        </div>
      ) : (
        <Link href="/login">
          <button className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">Войти</button>
        </Link>
      )}
    </div>
  );
}
