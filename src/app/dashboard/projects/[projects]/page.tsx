"use client";
import { fetchTasks } from "@/components/queries/fetchTasks";
import DueSoon from "@/components/ui/duesoon";
import TaskListWrapper from "@/components/ui/tasklistwrapper";
import GraphWrapper from "@/components/ui/graphsWrapper";
import { updateProjectInfo } from "@/components/queries/updateProjectInfo";
import { useNavbarFunction } from "@/components/context/NavbarFunctionContext";
import { useGraphContext } from "@/components/context/GraphContext";
import { getProjectInfo } from "@/components/queries/getProjectInfo";
import { HexColorPicker } from "react-colorful";
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";

export default function ProjectPage({ params }: any) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    title: "",
    description: "",
    tasks: [],
    color: "#000000", // Initialize color state
  });
  const [isEditing, setIsEditing] = useState(false); // State to toggle title editing
  const [newTitle, setNewTitle] = useState(""); // State to hold the new title when editing
  const [newColor, setNewColor] = useState("#000000"); // State to hold the new color when editing
  const [showColorPicker, setShowColorPicker] = useState(false); // State to toggle color picker visibility

  const { onRefresh } = useNavbarFunction();
  const { refreshGraphs } = useGraphContext(); // Access refreshGraphs from GraphContext

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    console.log("URL Token: ", urlToken);
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token) {
      getProjectInfo(token, setProjectInfo, setIsLoading);
    }
  }, [token]); // Run getProjectInfo when the token changes and is set

  const isSaveButtonDisabled = !(newTitle || newColor); // Disable button if neither title nor color is changed

  return (
    <div className="bg-[#FDF5E8] text-black h-screen flex flex-col p-[10px] overflow-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-5xl font-bold">Loading, please wait...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <h1 className="text-4xl font-bold italic capitalize">
              {projectInfo.title}
            </h1>
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="ml-2 text-gray-500 hover:text-black"
            >
              <span className="text-xl">•••</span> {/* Three dots button */}
            </button>
          </div>
          {/* Editable section */}
          {isEditing && (
            <div className="mt-4 p-4 bg-[#d9d9d9] border-2 border-black text-black shadow-md shadow-black">
              <label className="font-bold text-lg">Edit Project Info</label>
              <hr className="border-t-2 border-black mt-1 mb-2" />
              <div className="flex items-center mb-4">
                <label htmlFor="titleInput" className="mr-2 font-semibold">
                  Project Title:
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter new title"
                  className="pl-1 pr-1 border-b border-black text-lg w-1/5"
                />
              </div>
              <div className="flex items-center mb-4">
                <label htmlFor="colorPicker" className="mr-2 font-semibold">
                  Project Color:
                </label>
                <div
                  style={{
                    backgroundColor: newColor,
                    width: "30px",
                    height: "30px",
                    borderRadius: "4px",
                    border: "1px solid #000",
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                />
                <span className="mr-4">{newColor}</span>{" "}
                {/* Display color code */}
                {/* Button to toggle the visibility of the color picker */}
                <button
                  onClick={() => setShowColorPicker((prev) => !prev)}
                  className="bg-[#d9d9d9] text-black border-2 border-black hover:bg-[#b3b3b3] px-3 py-1"
                >
                  Select Color
                </button>
              </div>
              {/* Conditionally render the HexColorPicker */}
              {showColorPicker && (
                <div className="mt-2">
                  <HexColorPicker color={newColor} onChange={setNewColor} />
                </div>
              )}
              {/* Save button placed below color picker */}
              <button
                onClick={() =>
                  updateProjectInfo(
                    token,
                    newTitle,
                    newColor,
                    onRefresh,
                    refreshGraphs,
                    setIsEditing,
                    setProjectInfo,
                  )
                }
                className="mt-1 bg-[#d9d9d9] tex-black px-3 py-1 border-2 border-black hover:bg-[#b3b3b3]"
                disabled={isSaveButtonDisabled} // Disable button if no change
              >
                Save
              </button>
            </div>
          )}
          <hr className="border-t-2 border-black my-4" /> {/* Black hr */}
          {/* Graph and DueSoon container*/}
          <Grid container spacing={2}>
            {/* GraphWrapper */}
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <div className="border border-black flex flex-grow items-center w-full">
                <GraphWrapper token={token} />
              </div>
            </Grid>

            {/* DueSoon */}
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
              <div className="flex flex-col w-full">
                {/* Header Container */}
                <h1 className="bg-[#d9d9d9] text-lg border border-black font-bold text-left w-fit pl-1 pr-1">
                  DUE SOON!
                </h1>
                <DueSoon token={token} />
              </div>
            </Grid>
          </Grid>
          {/* TaskList Wrapper */}
          <div className="w-full mt-[10px]">
            <TaskListWrapper
              projectId={token}
              fetchcall={fetchTasks}
              writeperm={true}
            />
          </div>
        </>
      )}
    </div>
  );
}
