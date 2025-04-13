'use client'

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import ChairCard from "../components/ChairCard";

export default function ListPage() {
  const API = "http://165.232.79.109:39000/api";
  const token = Cookies.get("stsessionid");

  const [chairs, setChairs] = useState([]);
  const [error, setError] = useState("");
  const [currentPageUrl, setCurrentPageUrl] = useState(`${API}/chair/?limit=8`);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchData(currentPageUrl);
      console.log("The cookie", token);
    } else {
      setError("User not authenticated. Please log in.");
    }
  }, [token, currentPageUrl]);

  const fetchData = async (url) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const response = await fetch(url, {
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
      console.log(data);
      setChairs(data.results);      // update the list of chairs
      setNextPage(data.next);       // next page URL provided by the API
      setPrevPage(data.previous);   // previous page URL provided by the API
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

  return (
    <div className="w-full gap-1">
      <h1 className="text-2xl text-white font-bold p-5">Скамейки</h1>

      {error && <p className="text-red-500">{error}</p>}
      <div className="py-2">
        {loading ? (
          // Skeleton loaders: 8 blocks using animate-pulse
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 p-5">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-[#2B2B2B] rounded mb-4"></div>
                <div className="h-6 bg-[#2B2B2B] rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : chairs.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {chairs.map((chair) => (
              <ChairCard key={chair.id} chair={chair} />
            ))}
          </div>
        ) : (
          !error && <p className="text-white">No chairs available</p>
        )}
      </div>
      <div className="flex gap-3 justify-center m-10">
        {prevPage ? (
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Назад
          </button>
        ) : <div></div>}
        {nextPage ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-gray-700 text-white rounded cursor-pointer"
          >
            Следующая
          </button>
        ) : <div></div>}
      </div>
    </div>
  );
}
