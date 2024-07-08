// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Initially set loading to true

  // Function to check initial authentication status
  const checkAuthStatus = () => {
    const token = Cookies.get('token'); // Check if token exists in cookies
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false); // Once checked, set loading to false
  };

  // Simulated login function (replace with your actual logic)
  const login = () => {
    setIsLoggedIn(true);
    const token = 'your_token_here'; // Replace with actual token received from server
    Cookies.set('token', token, { expires: 7, secure: true }); // Set token in cookies
  };

  // Simulated logout function (replace with your actual logic)
  const logout = () => {
    Cookies.remove('token'); // Remove the token from cookies
    setIsLoggedIn(false);
  };

  // Call checkAuthStatus on component mount to initialize authentication check
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
