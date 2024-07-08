import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/NavBar/NavBar';
import SideBar from '../../components/sidebar/SideBar';
import DashboardMain from '../../components/Main/DashboardMain';
import { AuthContext } from '../../context/AuthContext'; // Replace with your authentication context
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn, loading } = useContext(AuthContext); // Replace with your authentication state
  const navigate = useNavigate();
  
  // Use a loading state to handle initial authentication check
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoggedIn && !loading) {
      navigate('/login');
    }
    
    // Ensure the authentication check is complete
    setAuthChecked(true);
  }, [isLoggedIn, loading, navigate]);

  // Return null while checking authentication to prevent rendering unauthorized content
  if (!authChecked) {
    return null;
  }

  // If not logged in, redirect has already been handled above
  if (!isLoggedIn) {
    return null;
  }

  // Render Dashboard if logged in
  return (
    <div>
      <Navbar/>
      <div className='flex justify-start items-start h-screen bg-gray-50/50'>
        <SideBar/>
        <DashboardMain/>
      </div>
    </div>
  );
}

export default Dashboard;
