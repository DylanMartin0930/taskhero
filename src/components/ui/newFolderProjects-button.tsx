import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

export default function NewFolderProjectsButton(props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDropdown = async () => {
    setIsOpen(!isOpen);
  };

  const createProject = async () => {
    try {
      const response = await axios.post("/api/projects/createProject");
      props.onRefresh();
      console.log("Project created successfully", response.data);
      toast.success("Project created successfully");
      router.push(
        `/dashboard/projects/${response.data.data.title}?token=${response.data.data.encryptedId}`,
      );
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="absolute shadow-md shadow-black">
      <button
        onClick={handleDropdown}
        className="bg-[#d9d9d9] text-black  border border-black w-[150px]"
      >
        Create New...
      </button>
      {isOpen && (
        <div className="z-40 top-full bg-white text-black mt-[1px] border border-black  flex flex-col">
          <button className="hover:bg-[#b3b3b3]" onClick={createProject}>
            Project
          </button>
        </div>
      )}
    </div>
  );
}
