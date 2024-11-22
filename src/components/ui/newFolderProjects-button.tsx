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
				`/dashboard/projects/${response.data.data.title}?token=${response.data.data.encryptedId}`
			);
		} catch (error) {
			console.log(error.message);
			toast.error(error.message);
		}
	};

	return (
		<div className="absolute">
			<button
				onClick={handleDropdown}
				className="mt-2 bg-white text-black rounded-md border border-black w-48"
			>
				Create New...
			</button>
			{isOpen && (
				<div className="z-40 top-full bg-white text-black mt-[1px] rounded-md border border-black w-48 flex flex-col">
					<button>Folder</button>

					<button onClick={createProject}>Project</button>
				</div>
			)}
		</div>
	);
}
