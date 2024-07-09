import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Initially set loading to true
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
  
  // Function to check initial authentication status
  const checkAuthStatus = () => {
    const token = Cookies.get('token') || localStorage.getItem('token'); // Check if token exists in cookies
    const role = localStorage.getItem('role'); // Get role from localStorage

    if (token) {
      setIsLoggedIn(true);
      // Check if user is admin based on role stored in localStorage
      if (role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
    setLoading(false); // Once checked, set loading to false
  };

  // Simulated login function (replace with your actual logic)
  const login = (token, role) => {
    setIsLoggedIn(true);
    localStorage.setItem('token', token); // Set token in localStorage
    localStorage.setItem('role', role); // Set role in localStorage
    Cookies.set('token', token, { expires: 7, secure: true }); // Set token in cookies

    // Check if user is admin and set isAdmin state
    if (role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Simulated logout function (replace with your actual logic)
  const logout = () => {
    Cookies.remove('token'); // Remove the token from cookies
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('role'); // Remove role from localStorage
    setIsLoggedIn(false);
    setIsAdmin(false);
    window.location.reload();
  };

  // Call checkAuthStatus on component mount to initialize authentication check
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
