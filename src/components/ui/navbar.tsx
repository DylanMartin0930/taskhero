"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { fetchProjects } from "../queries/fetchProjects";
import DefaultOptions from "./defaultoptions";
import Dropdown from "./dropdown";
import NewFolderProjectsButton from "./newFolderProjects-button";
import ProjectList from "./projectList";

export default function Navbar({
	setOnRefresh,
}: {
	setOnRefresh: (fn: () => void) => void;
}) {
	const [userData, setData] = React.useState("");
	const getUserDetails = async () => {
		const res = await axios.get("/api/users/me");
		console.log(res.data);
		setData(res.data.data.username);
	};

	const [projects, setProjects] = useState([]);
	const [defaults, setDefaults] = useState([]);

	const onRefresh = async () => {
		console.log("Refreshing");
		fetchProjects(setProjects, null, false);
		fetchProjects(setDefaults, null, true);
	};

	useEffect(() => {
		fetchProjects(setProjects, null, false);
		fetchProjects(setDefaults, null, true);
		setOnRefresh(onRefresh);
		getUserDetails();
	}, []);

	return (
		<div className="fixed flex flex-col space-y-[10px] top-[60px] left-0 w-[250px] p-[10px] h-screen bg-gray-800">
			{/* Logo */}
			<div>
				<h1>TaskHero</h1>
			</div>

			{/* User */}
			<div className="">
				<Dropdown userInfo={userData} />
			</div>

			{/* Default Routes */}
			<div>
				<DefaultOptions defaultOptions={defaults} />
			</div>

			{/* Project List */}
			<div>
				<ProjectList projects={projects} onRefresh={onRefresh} />
			</div>

			{/* New Folder/Projects Button */}
			<div>
				<NewFolderProjectsButton onRefresh={onRefresh} />
			</div>
		</div>
	);
}
