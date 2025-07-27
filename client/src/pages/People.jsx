import Sidebar from "../Components/Sidebar";
import Employees from "../Components/People/Employees";
import Navbar from "../Components/People/Navbar";
import { Nav } from "react-bootstrap";


function People() {
  const role = localStorage.getItem("role")

  return (
    
      <div className="flex-1 flex flex-col">
        {role==="admin" && (
          <Navbar/>
        )}
        <Employees />
      </div>
    
  );
}

export default People;