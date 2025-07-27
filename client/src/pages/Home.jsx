import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg"; // Replace with your actual logo path

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e1627] text-white p-6">
      {/* Logo Section */}
      <img src={logo} alt="Arkitek Logo" style={{borderRadius:"100px"}} className="w-30 h-30 mb-6" />

      {/* Title */}
      <h1 className="text-4xl font-bold mb-2">Welcome to Anveshan Architects</h1>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        Office Management System for Project and Employee management.<br/> Please Login to Continue
      </p>

      {/* Login Button */}
      <button
        onClick={handleLoginClick}
        style={{borderRadius:"5px"}}
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-5 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
      >
        Login
      </button>
    </div>
  );
}

export default Home;


// create a home page with a login button 
// in the login page, create a new schema/collection in the database and then connect it with the login page. Check whether the user is in the employee table. If yes then check for password in the user database.
// If all the conditions are met then redirect to the dashboard.