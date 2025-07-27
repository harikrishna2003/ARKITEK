import Sidebar from "../Components/Sidebar";
import AllEmployees from "../Components/Attendance/AllEmployees";
import { useState } from "react";
import Navbar from "../Components/Attendance/Navbar";

function Employees() {

  return (
    <div className="flex h-screen w-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pr-30">
        <Navbar />
        <AllEmployees />
      </div>
    </div>
  );
}

export default Employees;