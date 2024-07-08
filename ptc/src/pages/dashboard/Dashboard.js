import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../../components/NavBar/NavBar';
import SideBar from '../../components/sidebar/SideBar';
import DashboardMain from '../../components/Main/DashboardMain';
import { AuthContext } from '../../context/AuthContext'; // Import your authentication context
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { isLoggedIn, loading, isAdmin } = useContext(AuthContext); // Destructure isAdmin from AuthContext
  const navigate = useNavigate();

  // Use a loading state to handle initial authentication check
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoggedIn && !loading) {
      navigate('/login');
    } else if (isLoggedIn && !isAdmin) {
      // Redirect to home or another route if the user is not an admin
      navigate('/earn');
    }

    // Ensure the authentication check is complete
    setAuthChecked(true);
  }, [isLoggedIn, loading, isAdmin, navigate]);

  // Return null while checking authentication to prevent rendering unauthorized content
  if (!authChecked) {
    return null;
  }

  // If not logged in, redirect has already been handled above
  if (!isLoggedIn) {
    return null;
  }

  // If not an admin, redirect has already been handled above
  if (!isAdmin) {
    return null;
  }

  // Render Dashboard if logged in and isAdmin is true
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
