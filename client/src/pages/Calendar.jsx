// import Navbar from "../Components/Calendar/Navbar";
import Sidebar from "../Components/Sidebar";
import Timeline from "../Components/Calendar/Timeline";
import { useState } from "react";

function Calendar() {
    const [currentView, setCurrentView] = useState("Today");

  return (
    
      <div className="flex-1 flex flex-col">
        {/* <Navbar /> */}
        <Timeline />
      </div>
   
  );
}

export default Calendar;