import EmployeeLeaves from "../Components/Attendance/EmployeeLeaves";
import Sidebar from "../Components/Sidebar";

function EmployeeLeave() {
  return (
    <div className="flex h-screen w-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pr-30">
        <EmployeeLeaves />
      </div>
    </div>
  );
}

export default EmployeeLeave;