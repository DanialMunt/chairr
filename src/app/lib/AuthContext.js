// app/lib/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const token = Cookies.get('stsessionid');
    if (!token) {
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
        // make sure we never get a stale cached response
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch once on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (newToken) => {
    // 1) store the token
    Cookies.set('stsessionid', newToken);
    // 2) immediately refresh your context
    await fetchProfile();
    // 3) optionally navigate away (this will also re‐render any server components)
    router.push('/');
  };

  const logout = () => {
    Cookies.remove('stsessionid');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
