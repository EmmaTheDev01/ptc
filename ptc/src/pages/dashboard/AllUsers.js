import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/sidebar/SideBar';
import AllUserTable from '../../components/Admin/AllUserTable';

const AllUsers = () => {
 
  return (
    <div>
      <NavBar />
      <div className='flex justify-start items-start w-full bg-gray-50'>
        <SideBar />
        <AllUserTable />
      </div>
    </div>
  );
};

export default AllUsers;
