import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import NavBar from '../components/NavBar/NavBar';
import Profile from '../components/profile/Profile';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext'; 

const ProfilePage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate(); 

  useEffect(() => {
  
    if (!isLoggedIn) {
      navigate('/login'); 
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return <div>Loading...</div>; 
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
