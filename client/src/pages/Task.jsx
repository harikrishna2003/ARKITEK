import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Tasks/Navbar";
import ActivityTable from "../Components/Tasks/ActivityTable";
import CompletedTable from "../Components/Tasks/CompletedTable";

const Task = () => {
  return (
      <div className="flex-1 flex flex-col">
        <Navbar />
        <ActivityTable />
        <CompletedTable />
      </div>
  
  );
};

export default Task;
