// app/lib/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const token = Cookies.get("stsessionid");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(true)
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/user/profile/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setUser(data);
        setIsLoggedIn(true)
        console.log( data)
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = (token) => {
    Cookies.set("stsessionid", token);
    router.refresh();
  };

  const logout = () => {
    Cookies.remove("stsessionid");
    setUser(null);
    setIsLoggedIn(false)
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
