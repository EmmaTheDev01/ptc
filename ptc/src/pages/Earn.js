import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import NavBar from '../components/NavBar/NavBar';
import AdCard from '../components/Earn/AdCard';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const Earn = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    // Check authentication status when component mounts
    if (!isLoggedIn) {
      navigate('/login'); // Navigate to login page if not logged in
    }
  }, [isLoggedIn, navigate]); // Dependencies: re-run effect if isLoggedIn or navigate changes

  // Optionally return a loading spinner or placeholder while checking authentication
  if (!isLoggedIn) {
    return <div>Loading...</div>; // Render a loading indicator or null while redirecting
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
