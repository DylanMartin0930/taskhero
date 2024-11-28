import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { deleteProject } from "../queries/deleteProject";
import { useRouter } from "next/navigation";

function ProjectList(props) {
  const router = useRouter();

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      props.onRefresh();
      toast.success("Project deleted successfully");
      router.push("/dashboard/inbox");
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
            className="p-1 hover:bg-[#b3b3b3] border-b-2 border-black"
          >
            <Link
              href={{
                pathname: `/dashboard/projects/${project.title}`,
                query: { token: project._id },
              }}
            >
              {" "}
              {project.title}{" "}
            </Link>
            <button
              onClick={() => handleDeleteProject(project._id)}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
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
