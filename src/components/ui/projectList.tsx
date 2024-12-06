import React from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { deleteProject } from "../queries/deleteProject";
import { useRouter } from "next/navigation";
import { IoTrashBin } from "react-icons/io5"; // Import the trash icon

function ProjectList(props) {
  const router = useRouter();

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      props.onRefresh();
      toast.success("Project deleted successfully");
      router.back();
    } catch (error) {
      toast.error("Something went wrong");
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-[#d9d9d9] text-black flex flex-col border border-black p-0">
      {props.projects.length > 0 ? (
        props.projects.map((project) => (
          <div
            key={project._id}
            className="p-1 hover:bg-[#b3b3b3] border-b-2 border-black flex justify-between items-center"
          >
            <Link
              href={{
                pathname: `/dashboard/projects/${project.title}`,
                query: { token: project._id },
              }}
              className="flex-1"
            >
              {project.title}
            </Link>
            <button
              onClick={() => handleDeleteProject(project._id)}
              className="text-[#777777] hover:text-red-700"
            >
              <IoTrashBin size={24} /> {/* React icon for trash */}
            </button>
          </div>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}

export default ProjectList;
