import React, { useState } from "react";
import { deleteTasks } from "../queries/deleteTask";

import { FaTrash } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";

export default function TaskElement({ task, deleteTodo }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      <div onClick={handleToggle} className="flex items-center">
        <IoMdArrowDropdown />
        <h2>{task.title}</h2>
      </div>
      {isOpen && (
        <div>
          <p>{task.description}</p>
          <button onClick={() => deleteTasks(task._id, deleteTodo)}>
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
}
