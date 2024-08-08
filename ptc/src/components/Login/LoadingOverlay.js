import React from "react";
import './styles.css'; 

const LoadingOverlay = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-4 border-white rounded-full" />
  </div>
);

export default LoadingOverlay;
