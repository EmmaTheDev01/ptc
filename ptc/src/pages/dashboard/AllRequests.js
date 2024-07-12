import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/sidebar/SideBar';
import AllRequestTable from '../../components/Admin/AllRequestTable';
const AllRequests = () => {
  return (
    <div>
      <NavBar />
      <div className='flex justify-start items-start w-full bg-gray-50'>
        <SideBar />
        <AllRequestTable />
      </div>
    </div>
  );
};

export default AllRequests;
