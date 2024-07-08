import React, { useContext, useEffect } from 'react';
import Navbar from '../../components/NavBar/NavBar';
import SideBar from '../../components/sidebar/SideBar';
import DashboardMain from '../../components/Main/DashboardMain';
import { AuthContext } from '../../context/AuthContext'; // Replace with your authentication context
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn } = useContext(AuthContext); // Replace with your authentication state
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if not logged in
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  // Return null if not logged in to prevent rendering of unauthorized content
  if (!isLoggedIn) {
    return null;
  }

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
