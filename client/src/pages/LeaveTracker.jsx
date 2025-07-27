import LeaveTrack from "../Components/Attendance/LeaveTrack";
import Sidebar from "../Components/Sidebar";

function LeaveTracker() {
  return (
    <div className="flex h-screen w-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col pr-30">
        <LeaveTrack />
      </div>
    </div>
  );
}

export default LeaveTracker;