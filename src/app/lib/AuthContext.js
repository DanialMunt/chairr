
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("stsessionid");
    setIsLoggedIn(!!token);
  }, []);

  const login = (token) => {
    Cookies.set("stsessionid", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove("stsessionid");
    setIsLoggedIn(false);
    router.push('/')
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
