import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { fetchWritableProjects } from "../queries/fetchWritableProjects";

export default function ProjectDropDown(props) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [selectedProjectTitle, setSelectedProjectTitle] = React.useState("");

	const { data: projects, isLoading } = useQuery({
		queryFn: () => fetchWritableProjects(true),
		queryKey: ["projectInfo"],
		staleTime: 30000,
		cacheTime: 60000,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		onError: (error) => {
			toast.error("Failed to fetch project information.");
			console.error(error);
		},
	});

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
		<div className="relative">
			<button
				onClick={handleDropdown}
				className="bg-white hover:bg-[#b3b3b3] text-black border-1 border-black w-full p-2 text-left flex justify-between items-center"
			>
				{selectedProjectTitle || "Assign to project"}
				{isOpen ? (
					<IoMdArrowDropdown data-testid="arrow-down" className="ml-2" />
				) : (
					<IoMdArrowDropright data-testid="arrow-right" className="ml-2" />
				)}
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 mt-1 bg-[#d9d9d9] text-black border border-black w-48 shadow-lg z-50">
					{isLoading ? (
						<div className="p-2">Loading...</div>
					) : projects && projects.length > 0 ? (
						projects.map((project) => (
							<div key={project._id}>
								<div
									onClick={() => handleProjectClick(project._id, project.title)}
									className="block p-2 cursor-pointer hover:bg-[#b3b3b3]"
								>
									{project.title}
								</div>
								<hr className="border-1 border-black" />
							</div>
						))
					) : (
						<div className="p-2">No projects available</div>
					)}
				</div>
			)}
		</div>
	);
}
