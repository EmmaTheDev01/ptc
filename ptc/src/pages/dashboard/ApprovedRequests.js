import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import SideBar from '../../components/sidebar/SideBar';
import AllApprovedRequests from '../../components/Admin/AllApprovedRequests';

const ApprovedRequests = () => {
  return (
    <div>
      <NavBar />
      <div className="flex justify-start items-start w-full bg-gray-50">
        <SideBar />
        <AllApprovedRequests />
      </div>
    </div>
  );
};

export default ApprovedRequests;
