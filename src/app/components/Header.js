'use client';
import { useAuth } from '../lib/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { isLoggedIn, user, loading, logout } = useAuth();

  // if you want to show a spinner while we’re re-validating:
  if (loading) return null; // or a loading indicator

  const isModerator = user?.groups?.includes('moderator');

  return (
    <div className="flex justify-between items-center bg-[#2B2B2B] p-5">
      <Link href="/">
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="h-10" />
          <span className="text-white font-bold">ChillChair</span>
        </div>
      </Link>

      {isLoggedIn ? (
        <div className="flex gap-3 items-center">
          {isModerator && (
            <>
              <Link href="/admin">
                <button className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Админ панель
                </button>
              </Link>
              <Link href="/applications">
                <button className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Заявки
                </button>
              </Link>
            </>
          )}

          <Link href="/add">
            <button className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Добавить скамейку
            </button>
          </Link>
          <Link href="/chair/my">
            <button className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
              Мои скамейки
            </button>
          </Link>

          <button
            onClick={logout}
            className="py-3 px-5 text-red-500 border border-red-500 rounded hover:opacity-50"
          >
            Выйти
          </button>
        </div>
      ) : (
        <Link href="/login">
          <button className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Войти
          </button>
        </Link>
      )}
    </div>
  );
}
