import React from "react"
import "./App.css"
import { Task,Calendar,Notes,People,Details,Schedule,Employees,LeaveTracker,Project,Login, Home, LeaveHistoryTracker, EmployeeLeave } from "./pages"
import ProjectLayout from "./layouts/ProjectLayout"; // Create this file
import { Routes, Route, Navigate } from "react-router-dom"
import "./CSS/calendar-dark.css"
import "./CSS/notepad-dark.css"
import "./CSS/table-dark.css"
import ProtectedRoute from "./Components/ProtectedRoute";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense("ORg4AjUWIQA/Gnt2XFhhQlJHfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTH5WdE1jUX1bc3JXRWNcWkZ/");


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="tasks" />} />
        <Route path="tasks" element={<Task />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="notes" element={<Notes />} />
        <Route path="people" element={<People />} />
        <Route path="details" element={<Details />} />
        <Route path="schedule" element={<Schedule />} />
      </Route>

      {/* ✅ Always define routes, check role inside ProtectedRoute */}
      <Route
        path="attendance/employees"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Employees />
          </ProtectedRoute>
        }
      />
      <Route
        path="attendance/leave"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <LeaveTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="attendance/leaveHistory"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <LeaveHistoryTracker />
          </ProtectedRoute>
        }
      />
      <Route
        path="attendance/EmployeeLeave"
        element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeLeave />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}


export default App
