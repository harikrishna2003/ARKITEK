import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TaskDetailsModal from './TaskDetailsModal';


function CompletedTable() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, taskIndex: null });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

   const token = localStorage.getItem("token")


  useEffect(() => {

    axios.get(`http://localhost:3000/projects/${projectId}/tasks/completed`,{
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [projectId]);

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.pageX, y: event.pageY, taskIndex: index });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleAction = async (action) => {
    const task = tasks[contextMenu.taskIndex];
    if (!task) return;

    if (action === 'Activate Task') {
      try {
        // 1. Send task to `completedTasks` collection
        const updateTask = {...task, status:"Active"}
        await axios.put(`http://localhost:3000/projects/${projectId}/tasks/${task._id}`, updateTask, {
          headers: {
            Authorization:`Bearer ${token}`,
            'Content-Type':'application/json'
          }
        });

        // 3. Update UI
        setTasks(prev => prev.filter((_, index) => index !== contextMenu.taskIndex));
      } catch (err) {
        console.error("Error completing task:", err);
      }
    }

    if (action === 'Show details') {
      setSelectedTask(task);
      setShowDetailsModal(true);
      handleCloseContextMenu();
      return;
    }



    // You can handle other actions here...
    console.log(`Action "${action}" activated on task: ${task._id}`);
    handleCloseContextMenu();
    // window.location.reload();
  };


  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-gray-900">
        <h4 className="text-white p-3">
          <span className="mr-2">Completed/Interrupted Task</span>
          <span className="bg-gray-200 text-xs px-2 py-2 rounded-full text-gray-900">{tasks.length}</span>
        </h4>
      </div>

      {/* Header table */}
      <table className="min-w-full text-sm table-fixed" style={{ tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead className="bg-gray-800 text-left text-white">
          <tr>
            <th className="px-4 py-3">All Task</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Due Date</th>
            <th className="px-4 py-3">Assignee</th>
            <th className="px-4 py-3">Estimated Time</th>
            <th className="px-4 py-3">Spent Time</th>
          </tr>
        </thead>
      </table>

      {/* Scrollable body */}
      <div className="max-h-50 overflow-y-auto">
        <table className="min-w-full text-sm table-fixed" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <tbody className="bg-gray-900 divide-y divide-gray-700 text-white">
            {tasks.map((task, i) => (
              <tr key={task._id} onContextMenu={(e) => handleContextMenu(e, i)} className="cursor-pointer hover:bg-gray-800">
                <td className="px-4 py-3 text-white">{task.name}</td>
                <td className="px-4 py-3">
                  {task.priority === "High" ? "🔼" : task.priority === "Medium" ? "⏺️" : "🔽"} {task.priority}
                </td>
                <td className="px-4 py-3">{formatDate(task.dueDate)}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  <div className="bg-orange-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {task.assignee?.firstName?.[0] || "U"}
                  </div>
                  <span>{task.assignee?.firstName} {task.assignee?.lastName}</span>
                </td>
                <td className="px-4 py-3">{task.estimatedTime || "-"}</td>
                <td className="px-4 py-3">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contextMenu.visible && (
        <ul
          className="absolute z-50 bg-gray-700 text-white rounded shadow-lg w-60"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onMouseLeave={handleCloseContextMenu}
        >
          <li className="px-4 py-2 hover:text-red-600 cursor-pointer" onClick={() => handleAction('Activate Task')}>Activate Task</li>
          <li className="px-4 py-2 hover:text-red-600 cursor-pointer" onClick={() => handleAction('Show details')}>Show Details</li>
        </ul>
      )}

      <TaskDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        task={selectedTask}
      />

    </div>
  );
}

export default CompletedTable;
