import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import NavBar from '../components/NavBar/NavBar';
import AdCard from '../components/Earn/AdCard';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const Earn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate function

  // Check authentication status on component mount
  if (!isLoggedIn) {
    navigate('/login'); // Navigate to login page if not logged in
    return null;
  }

  return (
    <div className="relative z-10">
      <NavBar />
        <AdCard />
      <Footer />
    </div>
  );
};

export default Earn;
