"use client";
import React, { useEffect, useState } from "react";

export default function PlainTaskList({ tasks }) {
  const generateDots = (title) => {
    const maxLength = 40; // Max length for the title (adjust this as needed)
    const titleLength = title.length;
    if (titleLength >= maxLength) return ""; // No dots if the title is too long
    const dotsCount = maxLength - titleLength;
    return ".".repeat(dotsCount); // Fill the remaining space with dots
  };

  return (
    <div className="w-full h-full bg-purple-100 border-2 border-black">
      {/* Add black border */}
      {tasks.length > 0 ? (
        <ul className="list-disc pl-5 overflow-y-auto">
          {tasks.map((task) => (
            <li key={task._id} className="mb-2">
              <span className="font-medium">
                {task.title}
                {generateDots(task.title)} {/* Add dots to fill the space */}
                <span className="ml-2">
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                    weekday: "long",
                    day: "numeric",
                  })}
                </span>{" "}
                {/* Display the due date */}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
}
