import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const SurveyComponent = () => {
  const navigate = useNavigate(); // Create navigate function using useNavigate

  const handleButtonClick = () => {
    navigate('/earn'); // Navigate to the /earn page
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen p-4">
      <span className="text-gray-500 mb-4 text-center">
        There are currently no surveys available!
      </span>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-[#29625d] text-white rounded hover:bg-black"
      >
        Go to Earning Page
      </button>
    </div>
  );
};

export default SurveyComponent;
