"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import FullCalendar from "@fullcalendar/react";

export default function Calendar() {
	const [events, setEvents] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null); // To track the selected project for displaying tasks
	const [taskListPosition, setTaskListPosition] = useState({ top: 0, left: 0 }); // Track position of the task list

	const getEvents = async () => {
		try {
			const response = await axios.get("/api/calendar/getEvents");
			const formattedEvents = response.data.data.map((event) => ({
				title: event.projectTitle, // Use the project title as the event title
				start: event.tasks.length > 0 ? event.tasks[0].start : "", // Use the first task's start date for event start
				end:
					event.tasks.length > 0
						? event.tasks[event.tasks.length - 1].start
						: "", // Use the last task's start date for event end
				extendedProps: {
					project: event, // Pass the entire project data (including tasks)
				},
			}));

			setEvents(formattedEvents); // Store the formatted events
			console.log("Event Retrieval Successful", formattedEvents);
			toast.success("Event Retrieval Successful");
		} catch (error) {
			console.error("Event Retrieval error", error);
			toast.error("Event Retrieval error");
		}
	};

	useEffect(() => {
		getEvents();
	}, []);

	const handleEventClick = (eventInfo) => {
		const project = eventInfo.event.extendedProps.project;

		// If the same project is clicked again, close the task details window
		if (selectedProject?.projectId === project.projectId) {
			setSelectedProject(null);
			setTaskListPosition({ top: 0, left: 0 });
		} else {
			// Otherwise, set the selected project and position the task list
			setSelectedProject(project);

			// Calculate the position relative to the calendar container
			const eventRect = eventInfo.el.getBoundingClientRect();
			const containerRect = document
				.querySelector(".calendar-container")
				.getBoundingClientRect();

			setTaskListPosition({
				top: eventRect.bottom - containerRect.top, // Position below the event
				left: eventRect.left - containerRect.left, // Align left to the event
			});
		}
	};

	return (
		<div className="calendar-container w-1/2 p-4 absolute bottom-0  border-2 border-black bg-white">
			<FullCalendar
				plugins={[dayGridPlugin, interactionPlugin]}
				initialView="dayGridMonth"
				events={events}
				eventColor="#000000"
				headerToolbar={{
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,dayGridWeek,dayGridDay",
				}}
				eventContent={(eventInfo) => (
					<div className="text-black">{eventInfo.event.title}</div>
				)}
				dayCellClassNames={(date) => "fc-daygrid-day"}
				eventClassNames="custom-event"
				eventClick={handleEventClick}
			/>

			{/* Expanding div for showing tasks */}
			{selectedProject && (
				<div
					data-testid="task-list-container"
					className="absolute bg-white border border-gray-300 shadow-lg rounded-md p-4 w-80 z-50"
					style={{
						top: `${taskListPosition.top}px`,
						left: `${taskListPosition.left}px`,
					}}
				>
					<h3 className="text-xl font-semibold mb-2">
						{selectedProject.projectTitle}
					</h3>
					<ul className="space-y-2">
						{selectedProject.tasks.map((task) => (
							<li key={task.id} className="p-2 border-b border-gray-200">
								<span className="font-medium">{task.title}</span>
								<div className="text-sm text-gray-500">Due: {task.start}</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
