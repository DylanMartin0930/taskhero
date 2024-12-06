// Updated Code
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Project from "@/models/projectModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import Cryptr from "cryptr";

connect();

export async function POST(request: NextRequest) {
  try {
    const { task, editedTask, selectedProject } = await request.json();

    // Get user from token
    const userID = getDataFromToken(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let projectIdToUse;

    if (!selectedProject) {
      // If selectedProject is null, use task.parent to find the current project
      projectIdToUse = task.parent;
    } else {
      // Decrypt the selected project ID
      const cryptr = new Cryptr(process.env.TOKEN_SECRET!);
      try {
        projectIdToUse = cryptr.decrypt(selectedProject);
      } catch (err) {
        return NextResponse.json(
          { error: "Invalid selectedProject value for decryption" },
          { status: 400 },
        );
      }
    }

    // Find the project using the determined project ID
    const project = await Project.findOne({
      _id: projectIdToUse,
      userId: user._id,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if the task already exists in the project's task array
    const existingTask = project.tasks.find(
      (t) => t._id.toString() === task._id.toString(),
    );

    if (existingTask) {
      // Update the task's values if it exists
      existingTask.title = editedTask.title || existingTask.title;
      existingTask.description =
        editedTask.description || existingTask.description;
      existingTask.folder = editedTask.folder || existingTask.folder;
      existingTask.dueDate = editedTask.dueDate || existingTask.dueDate;
      existingTask.assignedDate =
        editedTask.assignedDate || existingTask.assignedDate;
    } else {
      // Create a new task using the provided values
      const newTask = {
        title: editedTask.title || task.title,
        description: editedTask.description || task.description,
        parent: project._id,
        folder: editedTask.folder || task.folder,
        dueDate: editedTask.dueDate || task.dueDate,
        assignedDate: editedTask.assignedDate || task.assignedDate,
      };

      project.tasks.push(newTask);

      // If selectedProject is not null, remove the task from its parent project
      if (selectedProject) {
        const parentProject = await Project.findOne({
          _id: task.parent,
          userId: userID,
        });

        if (!parentProject) {
          return NextResponse.json(
            { error: "Parent project not found" },
            { status: 404 },
          );
        }

        // Remove the task from the parent project
        parentProject.tasks = parentProject.tasks.filter(
          (t) => t._id.toString() !== task._id.toString(),
        );

        // Save the updated parent project
        await parentProject.save();
      }
    }

    // Save the updated project
    await project.save();

    // Initialize today's date at UTC 00:00:00
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00 UTC

    // Convert task assigned date to a comparable UTC date with time 00:00:00
    const assignedDateUTC = new Date(editedTask.assignedDate);
    assignedDateUTC.setUTCHours(0, 0, 0, 0); // Normalize to 00:00:00 UTC

    // Compare the two dates
    if (assignedDateUTC.getTime() === todayUTC.getTime()) {
      const todayProject = await Project.findOne({
        title: "today",
        userId: userID,
      });

      if (todayProject) {
        // Prepare the task to add to the "today" project
        const taskCopy = {
          ...editedTask,
        };

        // Push a copy of the updated task into the "today" project
        todayProject.tasks.push(taskCopy);
        await todayProject.save();
        console.log("Task also added to 'today' project");
      } else {
        console.log("No 'today' project found for the user");
      }
    } else {
      console.log("Task assigned date does not match today's date");
      console.log("Task assigned date (UTC):", assignedDateUTC);
      console.log("Today's date (UTC):", todayUTC);
    }

    return NextResponse.json({
      message: "Task updated successfully",
      success: true,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "Update Task API Failed" },
      { status: 500 },
    );
  }
}
