import React, { useEffect } from "react";
import { fetchProjects } from "../queries/fetchProjects";

export default function ProjectDropDown(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const [selectedProjectTitle, setSelectedProjectTitle] = React.useState("");

  useEffect(() => {
    fetchProjects(setProjects, null, false);
  }, []); // Add an empty dependency array to avoid repeated fetching

  const handleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProjectClick = (projectId, projectTitle) => {
    props.setSelectedProject(projectId); // Set the selected project ID
    setSelectedProjectTitle(projectTitle); // Set the selected project title
    setIsOpen(false); // Close the dropdown menu
  };

  return (
    <div className="relative">
      <button
        onClick={handleDropdown}
        className="mt-2 bg-white text-black rounded-md border border-black w-48 p-2 text-left"
      >
        {selectedProjectTitle || "Assign to project"}
      </button>
      {isOpen && (
        <div className="absolute left-0 z-50 bg-white text-black rounded-md border border-black w-48 shadow-lg">
          {projects.map((project) => (
            <div
              key={project._id}
              onClick={() => handleProjectClick(project._id, project.title)}
              className="block p-2 cursor-pointer hover:bg-gray-200"
            >
              {project.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
