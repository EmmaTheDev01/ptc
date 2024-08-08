import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';
import AdCard from '../components/Earn/AdCard';
import Footer from '../components/Footer';
import { AuthContext } from '../context/AuthContext';

const Earn = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
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
