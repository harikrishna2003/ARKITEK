import { useState, useEffect } from 'react';
import {
  FaUser,
  FaSearch,
  FaClock,
  FaPlus,
  FaCheckCircle,
  FaCalendarAlt,
  FaStickyNote,
  FaUserFriends,
  FaFolderPlus,
  FaFolder,
  FaInfo,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
import { GrSchedules } from "react-icons/gr";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import CreateProject from './CreateProject';
import axios from 'axios';

function Sidebar() {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [user, setUser] = useState("");

  const userId = localStorage.getItem("userId");
  const employeeId = localStorage.getItem("employeeId");
  const role = localStorage.getItem("role")
  const navigate = useNavigate();

  const location = useLocation();
  const isAttendanceActive = location.pathname.startsWith('/attendance');
  const showRightSection = !isAttendanceActive || selectedProjectId;

  const [expandProjects, setExpandProjects] = useState(false);
  const [expandAttendance, setExpandAttendance] = useState(false);
  const [expandAgency, setExpandAgency] = useState(false);
  const [expandCompleted, setExpandCompleted] = useState(false);
  const [manuallyToggled, setManuallyToggled] = useState(false);

  useEffect(() => {
    if (!userId || userId === "undefined") {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem("token")

    axios.get(`http://localhost:3000/login/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
              }
        })
      .then(response => {
        const employee = response.data.employee;
        setUser(`${employee.firstName} ${employee.lastName}`);
        localStorage.setItem("username", `${employee.firstName} ${employee.lastName}`);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        navigate('/login');
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token")
    axios.get(`http://localhost:3000/projects/${employeeId}/assigned`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        })
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));

    axios.get(`http://localhost:3000/projects/${employeeId}/completed`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        })
      .then(response => setCompletedProjects(response.data))
      .catch(error => console.error('Error fetching completed projects:', error));
  }, [employeeId]);

  useEffect(() => {
    if (manuallyToggled) return;

    if (location.pathname.includes('/completed')) {
      setExpandCompleted(true);
      setExpandProjects(false);
      setExpandAttendance(false);
      setExpandAgency(false);
    } else if (location.pathname.startsWith('/projects')) {
      setExpandProjects(true);
      setExpandAttendance(false);
      setExpandAgency(false);
      setExpandCompleted(false);
    } else if (location.pathname.startsWith('/attendance')) {
      setExpandAttendance(true);
      setExpandAgency(false);
      setExpandProjects(false);
      setExpandCompleted(false);
    } else if (location.pathname.startsWith('/agency')) {
      setExpandAgency(true);
      setExpandAttendance(false);
      setExpandProjects(false);
      setExpandCompleted(false);
    }
  }, [location.pathname, manuallyToggled]);


  const handleProjectSelect = (projectId) => {
    setSelectedProjectId(projectId);
    navigate(`/projects/${projectId}`);
  };

  const toggleProjectDropdown = () => setShowProjectDropdown(prev => !prev);
  const handleCreateProject = () => {
    setIsCreateProjectOpen(true);
    setShowProjectDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('employeeId');
    navigate('/login');
  };

  const handleExpandAttendance = () => {
    setManuallyToggled(true);
    setExpandAttendance(prev => !prev);
    setExpandProjects(false);
    setExpandAgency(false);
    setExpandCompleted(false);
  };

  const handleExpandAgency = () => {
    setManuallyToggled(true);
    setExpandAgency(prev => !prev);
    setExpandProjects(false);
    setExpandAttendance(false);
    setExpandCompleted(false);
  };

  const handleExpandProjects = () => {
    setManuallyToggled(true);
    setExpandProjects(prev => !prev);
    setExpandAttendance(false);
    setExpandAgency(false);
    setExpandCompleted(false);
  };

  const handleExpandCompleted = () => {
    setManuallyToggled(true);
    setExpandCompleted(prev => !prev);
    setExpandProjects(false);
    setExpandAttendance(false);
    setExpandAgency(false);
  };

  const linkStyle = "flex items-center space-x-2 px-2 py-1 rounded-sm text-sm text-white no-underline hover:text-white";
  const activeStyle = "bg-orange-600 text-white";

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-white w-90">
        {/* Left Sidebar */}
        <div className="w-[clamp(15rem,25vw,18rem)] border-r border-gray-700 p-4 space-y-6 relative">
          <div className="flex items-center space-x-2">
            <FaUser size={20}/>
            <span className="text-md font-medium ml-2">{user}</span>
          </div>

          <div className="flex items-center border-b border-gray-600 pb-1">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="search..."
              className="bg-transparent focus:outline-none text-sm placeholder-gray-400 w-full"
            />
          </div>

          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <FaClock />
            <span>All Activity</span>
          </div>

    
          {/* Projects Section */}
          <div className="text-gray-400 text-sm space-y-1 relative">
            <div className="flex items-center justify-between cursor-pointer" onClick={handleExpandProjects}>
              <div className="flex items-center space-x-1">
                {expandProjects ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                <span className="uppercase tracking-wide">Projects</span>
              </div>
              <FaPlus className="cursor-pointer" onClick={e => { e.stopPropagation(); toggleProjectDropdown(); }} />
            </div>

            {/* Animated Dropdown */}
            <div
              className={`absolute mt-1 left-[105%] bg-gray-800 text-white shadow-lg rounded-md w-52 z-20 transition-all duration-300 ease-out transform ${
                showProjectDropdown ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div onClick={handleCreateProject} className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer">
                <FaFolder className="mr-3" /> Create Project
              </div>
              <div className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer">
                <FaFolderPlus className="mr-3" /> Create Folder
              </div>
            </div>

            {/* Project List Animated */}
            <div
              className={`ml-5 mt-1 space-y-2 text-white transition-all duration-300 ease-in-out overflow-hidden ${
                expandProjects ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              {projects.map((project) => (
                <div
                  key={project._id}
                  className={`cursor-pointer ${selectedProjectId === project._id ? 'font-bold text-orange-400' : ''}`}
                  onClick={() => handleProjectSelect(project._id)}
                >
                  {project.name}
                </div>
              ))}

              {completedProjects.length > 0 && (
                <>
                  <div className="text-gray-400 mt-3 uppercase tracking-wide">Completed</div>
                  {completedProjects.map((project) => (
                    <div
                      key={project._id}
                      className={`cursor-pointer text-gray-400 hover:text-orange-400 ${
                        selectedProjectId === project._id ? 'font-bold text-orange-400' : ''
                      }`}
                      onClick={() => handleProjectSelect(project._id)}
                    >
                      {project.name}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Attendance Section (role-based rendering) */}
          {(role === "admin" || role === "employee") && (
            <div className="text-gray-400 text-sm space-y-1">
              <div className="flex items-center justify-between cursor-pointer" onClick={handleExpandAttendance}>
                <div className="flex items-center space-x-1">
                  {expandAttendance ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                  <span className="uppercase tracking-wide">Attendance</span>
                </div>
                <FaPlus className="cursor-pointer" />
              </div>

              {/* Dropdown */}
              <div
                className={`ml-5 mt-1 space-y-2 text-white transition-all duration-300 ease-in-out overflow-hidden ${
                  expandAttendance ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                {role === "admin" && (
                  <>
                    <NavLink to="/attendance/employees" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}>
                      All Employee
                    </NavLink>
                    <NavLink to="/attendance/leave" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}>
                      Leave Track
                    </NavLink>
                    <NavLink to="/attendance/leaveHistory" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}>
                      Leave History
                    </NavLink>
                  </>
                )}

                {role === "employee" && (
                  <NavLink to="/attendance/EmployeeLeave" className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}>
                    Your Leaves
                  </NavLink>
                )}
              </div>
            </div>
          )}


          {/* Agency Section */}
          <div className="text-gray-400 text-sm space-y-1">
            <div className="flex items-center justify-between cursor-pointer" onClick={handleExpandAgency}>
              <div className="flex items-center space-x-1">
                {expandAgency ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                <span className="uppercase tracking-wide">Agency</span>
              </div>
              <FaPlus className="cursor-pointer" />
            </div>

            {/* Animated Agency Dropdown */}
            <div
              className={`ml-5 mt-1 space-y-2 text-white transition-all duration-300 ease-in-out overflow-hidden ${
                expandAgency ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
              }`}
            >
              <div>All Agency</div>
              <div>New Agency</div>
            </div>
          </div>




  
        

          <div className="mt-auto">
            <button style={{ borderRadius:"5px"}} onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-sm text-sm">
              Logout
            </button>
          </div>
        </div>

        {/* Tools Section */}
        {showRightSection && (
          <div className="w-50 border-r border-gray-700 p-4 space-y-5">
            <div className="uppercase text-gray-300 text-sm">Tools</div>
            <div className="space-y-4 text-sm">
              <NavLink to={`/projects/${selectedProjectId}/tasks`} end className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}><FaCheckCircle /><span>Task</span></NavLink>
              <NavLink to={`/projects/${selectedProjectId}/calendar`} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}><FaCalendarAlt /><span>Calendar</span></NavLink>
              <NavLink to={`/projects/${selectedProjectId}/notes`} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}><FaStickyNote /><span>Notes</span></NavLink>
              <NavLink to={`/projects/${selectedProjectId}/people`} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}><FaUserFriends /><span>People</span></NavLink>
              <NavLink to={`/projects/${selectedProjectId}/details`} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}><FaInfo /><span>Details</span></NavLink>
              <NavLink to={`/projects/${selectedProjectId}/schedule`} className={({ isActive }) => `${linkStyle} ${isActive ? activeStyle : ''}`}><GrSchedules /><span>Schedule</span></NavLink>
              
              {!completedProjects.some(p => p._id === selectedProjectId) && role === "admin" && (
                <div onClick={() => setShowCloseModal(true)} className={`${linkStyle} cursor-pointer`}>
                  <button style={{ borderRadius:"5px"}} className="w-full bg-orange-600 hover:bg-red-600 text-white px-4 py-1 rounded-sm text-sm">Close</button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* Close Project Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h4 className="text-lg font-bold text-white">Confirm Close Project</h4>
            <p className="text-sm text-gray-300 px-10 py-2">Are you sure you want to mark this project as completed?</p>
            <div className="flex justify-end gap-3">
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded" onClick={() => setShowCloseModal(false)}>Cancel</button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token")
                    await axios.patch(`http://localhost:3000/projects/${selectedProjectId}/close`,
                      {},
                      {
                      headers: {
                        Authorization:`Bearer ${token}`,
                        // 'Content-Type':'application/json'
                      }
                    });
                    alert("Successfully closed Project")
                    const [active, completed] = await Promise.all([
                      axios.get(`http://localhost:3000/projects/${employeeId}/assigned`,{
                        headers: {
                          Authorization:`Bearer ${token}`,
                       
                        }
                      }),
                      axios.get(`http://localhost:3000/projects/${employeeId}/completed`,{
                        headers: {
                          Authorization:`Bearer ${token}`,
                         
                        }
                      })
                    ]);
                    setProjects(active.data);
                    setCompletedProjects(completed.data);
                    setShowCloseModal(false);
                    setSelectedProjectId(null);
                  } catch (err) {
                    console.error('Failed to close project', err);
                    alert('Failed to close project.');
                  }
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Render */}
      <CreateProject
        isOpen={isCreateProjectOpen}
        onClose={() => {
          setIsCreateProjectOpen(false);
          const token = localStorage.getItem("token")
          Promise.all([
          axios.get(`http://localhost:3000/projects/${employeeId}/assigned`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:3000/projects/${employeeId}/completed`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]).then(([activeRes, completedRes]) => {
          setProjects(activeRes.data);
          setCompletedProjects(completedRes.data);
        })

        .then(res => setProjects(res.data));
        }}
      />
    </>
  );
}

export default Sidebar;
