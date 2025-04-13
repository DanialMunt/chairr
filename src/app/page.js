'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link';
export default function Home() {

  const API = "http://165.232.79.109:39000/api"

  const [chairs, setChairs] = useState([])


  

  return (
    <div className="flex flex-col md:flex-row items-center justify-center p-6">
      <div className="text-center md:text-left mb-8 md:mb-0 md:mr-8">
        <div className='flex flex-col gap-3'>
        <h1 className="text-5xl font-bold text-white ">
          Найдите скамейку мечты!
        </h1>
        <span className='text-gray-400 text=2xl'>
          Найдите самые интересные и комичные, смешные и забавные, оригинальные и просто веселые скамейки, чтобы повесилитсья отдуши!
        </span>
        <Link href="/chairs">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition cursor-pointer">
           Смотреть скамейки
          </button>
        </Link>
        </div>
      </div>
      <div>
        {/* Замените src на путь к вашей картинке */}
        <img src="1725641367129522697.jpg" alt="Лендинг" className="max-w-[600px] h-auto rounded-full" />
      </div>
    </div>
  );
}
