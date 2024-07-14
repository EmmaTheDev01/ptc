import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/sidebar/SideBar';
import AllContactSubmits from '../../components/Admin/AllContactSubmits';
const AllMessages = () => {
  return (
    <div>
      <NavBar />
      <div className='flex justify-start items-start w-full bg-gray-50'>
        <SideBar />
        <AllContactSubmits />
      </div>
    </div>
  );
};

export default AllMessages;
