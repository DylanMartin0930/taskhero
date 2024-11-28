import React, { useEffect } from "react";
import { fetchWritableProjects } from "../queries/fetchWritableProjects";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";

export default function ProjectDropDown(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const [selectedProjectTitle, setSelectedProjectTitle] = React.useState("");

  useEffect(() => {
    fetchWritableProjects(setProjects, true);
  }, []); // Add an empty dependency array to avoid repeated fetching

  const handleDropdown = () => {
    setIsOpen(!isOpen);
    console.log("Projects: ", projects);
  };

  const handleProjectClick = (projectId, projectTitle) => {
    props.setSelectedProject(projectId); // Set the selected project ID
    setSelectedProjectTitle(projectTitle); // Set the selected project title
    setIsOpen(false); // Close the dropdown menu
  };

  return (
    <div className="">
      <button
        onClick={handleDropdown}
        className="bg-white hover:bg-[#b3b3b3] text-black border-1 border-black w-full p-2 text-left flex justify-between items-center"
      >
        {selectedProjectTitle || "Assign to project"}

        {/* Conditionally render the arrow icon */}
        {isOpen ? (
          <IoMdArrowDropdown className="ml-2" />
        ) : (
          <IoMdArrowDropright className="ml-2" />
        )}
      </button>

      {isOpen && (
        <div className="absolute  z-50 bg-[#d9d9d9] text-black  border border-black w-48 shadow-lg">
          {projects.map((project) => (
            <div>
              <div
                key={project._id}
                onClick={() => handleProjectClick(project._id, project.title)}
                className="block p-2 cursor-pointer hover:bg-[#b3b3b3]"
              >
                {project.title}
              </div>
              <hr className=" border-1 border-black" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
