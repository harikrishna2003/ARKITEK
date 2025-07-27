import LeaveHistory from "../Components/Attendance/LeaveHistory";
import Sidebar from "../Components/Sidebar";

function LeaveHistoryTracker() {
  return (
    <div className="flex h-screen w-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pr-30">
        <LeaveHistory />
      </div>
    </div>
  );
}

export default LeaveHistoryTracker;