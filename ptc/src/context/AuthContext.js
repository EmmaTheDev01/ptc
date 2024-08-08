import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 
  
  const checkAuthStatus = () => {
    const token = Cookies.get('token') || localStorage.getItem('token'); 
    const role = localStorage.getItem('role'); 

    if (token) {
      setIsLoggedIn(true);
      if (role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
    setLoading(false); 
  };

  const login = (token, role) => {
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    Cookies.set('token', token, { expires: 1, secure: true }); 

    if (role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    localStorage.removeItem('token'); 
    localStorage.removeItem('role'); 
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
