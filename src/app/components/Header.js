// components/Header.jsx
'use client';

import Link from 'next/link';
import SearchBar from './searchBar';



export default function Header() {
  const handleSearch = (query) => {
    // Implement your search logic here (e.g., update state or route to a search results page)
    console.log('Searching for:', query);
  };

  return (
    <div className="flex justify-between items-center bg-[#2B2B2B] p-5 xl:px-50">
      {/* Left: Logo and Title */}
      <Link href="/">
      <div className="flex items-center gap-2">
      
        <img src="/logo.png" alt="logo" className="h-10" />
        <span className="font-bold text-white">ChillChair</span>
      </div>
      </Link>
      {/* Center: Tagline and Search Bar */}
      <div className="flex flex-col items-center w-80">
      <input
              type="text"
              id="title"
              placeholder='Поиск'
              required
              className="mt-1 block w-full px-3 py-2 bg-[#1B1E1F] text-white rounded-md"
            />
        {/* <SearchBar onSearch={handleSearch}></SearchBar> */}

        
      </div>

      {/* Right: Add Chair Button and Profile */}
      <div className="flex items-center gap-4">
        <Link href="/add">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
           Добавить скамейку
          </button>
        </Link>
        <div className="flex items-center gap-2 bg-[#1B1E1F] p-3 rounded-full cursor-pointer">
          <span className='text-white'>Профиль</span>
          <img src="/user.png" alt="user" className="h-7" />
        </div>
      </div>
    </div>
  );
}
