import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

function ProjectList() {
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    try {
      const response = await axios.post("/api/projects/getProjectList");
      setProjects(response.data.data); // Access the 'data' array from the response
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="bg-gray-100 text-black flex flex-col">
      {projects.length > 0 ? (
        projects.map((project) => (
          <div key={project._id}>
            <Link href={`/dashboard/${project._id}`}> {project.title} </Link>
          </div>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}

export default ProjectList;
