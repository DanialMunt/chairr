// components/SearchBar.jsx
'use client';

import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, placeholder = 'Search chairs...', debounceDelay = 500 }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [query, onSearch, debounceDelay]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
    />
  );
}
