'use client';

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ChairCard from "../components/ChairCard";
import { useAuth } from '../lib/AuthContext';
import { API_URL } from "../../../config";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

const BenchMap = dynamic(() => import('../components/BenchMap'), { ssr: false });

export default function ListPage() {
  const token = Cookies.get("stsessionid");
  const { isLoggedIn } = useAuth();

  const cities = ['Алматы', 'Астана', 'Шымкент', 'Актобе'];
  const [selectedCity, setSelectedCity] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const [chairs, setChairs] = useState([]);
  const [error, setError] = useState("");
  const [currentPageUrl, setCurrentPageUrl] = useState(`${API_URL}/api/chair/?status=published&limit=8`);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // if (token) {
      fetchData(currentPageUrl);
    //   console.log("The cookie", token);
    // } else {
    //   setError("User not authenticated. Please log in.");
    // }
  }, [token, currentPageUrl]);

  const fetchData = async (url) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Token ${token}`
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chairs. Unauthorized or server error.");
      }

      const data = await response.json();
      console.log(data);
      setChairs(data.results);
      setNextPage(data.next);
      setPrevPage(data.previous);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (nextPage) {
      setCurrentPageUrl(nextPage);
    }
  };

  const handlePrev = () => {
    if (prevPage) {
      setCurrentPageUrl(prevPage);
    }
  };

  const filteredChairs = selectedCity
      ? chairs.filter(chair => chair.city?.includes(selectedCity))
      : chairs;

  return (
      <div className="w-full gap-1">
        <h1 className="text-2xl text-white font-bold p-5">Скамейки</h1>

        {/* Переключатель + Фильтр */}
        <div className="flex flex-wrap items-center gap-4 px-5 pb-5">
          <div>
            <label className="text-white mr-2">Город:</label>
            <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-2 py-1 rounded text-sm bg-gray-800 text-white"
            >
              <option value="">Все города</option>
              {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              Карта
            </button>
            <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
            >
              Список
            </button>
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <AnimatePresence mode="wait">
          {viewMode === 'map' && filteredChairs.length > 0 && (
              <motion.div
                  key="map"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 mb-8"
              >
                <BenchMap benches={filteredChairs} />
              </motion.div>
          )}

          {viewMode === 'list' && (
              <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="py-2"
              >
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 p-5">
                      {Array.from({ length: 8 }, (_, index) => (
                          <div key={index} className="animate-pulse">
                            <div className="h-48 bg-[#2B2B2B] rounded mb-4"></div>
                            <div className="h-6 bg-[#2B2B2B] rounded w-3/4"></div>
                          </div>
                      ))}
                    </div>
                ) : filteredChairs.length > 0 ? (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                      {filteredChairs.map((chair) => (
                          <Link key={chair.id} href={`/chair/${chair.id}`}>
                            <ChairCard chair={chair} />
                          </Link>
                      ))}
                    </div>
                ) : (
                    !error && <p className="text-white">Нет скамеек по выбранному фильтру</p>
                )}
              </motion.div>
          )}
        </AnimatePresence>

        {/* Пагинация */}
        <div className="flex gap-3 justify-center m-10">
          {prevPage && (
              <button
                  onClick={handlePrev}
                  className="px-4 py-2 bg-gray-700 text-white rounded"
              >
                Назад
              </button>
          )}
          {nextPage && (
              <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer"
              >
                Следующая
              </button>
          )}
        </div>
      </div>
  );
}
