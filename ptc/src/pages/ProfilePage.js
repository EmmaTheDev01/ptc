import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from '../components/NavBar/NavBar';
import Profile from '../components/profile/Profile';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext'; 

// Spinner component
const Spinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="w-16 h-16 border-4 border-t-4 border-green-500 border-solid rounded-full animate-spin"></div>
  </div>
);

const ProfilePage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); 
    }
  }, [isLoggedIn, navigate]);

  if (isLoggedIn === undefined) {
    // Display the spinner while checking the authentication status
    return <Spinner />;
  }

  if (!isLoggedIn) {
    return <div>Redirecting to login...</div>; 
  }

  return (
    <div>
      <NavBar />
      <Profile />
      <Footer />
    </div>
  );
};

export default ProfilePage;
