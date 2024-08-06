import React, { useContext } from 'react';
import Login from '../components/Login/Login';
import { AuthContext } from '../context/AuthContext'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const { isAuthenticated } = useContext(AuthContext); // Adjust based on your AuthContext structure
  const navigate = useNavigate();
  if (isAuthenticated) {
    navigate('/earn');
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-grow">
        <Login />
      </div>

      {/* Bottom Menu */}
      <footer className="text-black py-3 fixed bottom-0 inset-x-0 flex justify-center items-center">
        <a href="/about" className="hover:underline ml-5">About Us</a>
        <a href="/contact" className="hover:underline ml-5">Contact</a>
        <a href="/privacy" className="hover:underline ml-5">Privacy Policy</a>
      </footer>
    </div>
  );
};

export default LoginPage;
