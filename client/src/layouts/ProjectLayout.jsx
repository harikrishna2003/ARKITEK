// src/layouts/ProjectLayout.jsx
import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const ProjectLayout = () => {
  const { projectId } = useParams();

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar selectedProjectId={projectId} />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default ProjectLayout;
