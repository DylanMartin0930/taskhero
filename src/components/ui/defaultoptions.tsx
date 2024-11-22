import React from "react";
import Link from "next/link";
import { DEFAULT_ITEMS } from "@/constants/defaultitems";

export default function DefaultOptions(props) {
  return (
    <div className="flex-1 mt-[20px]">
      {props.defaultOptions.length > 0 ? (
        props.defaultOptions.map((project) => (
          <div key={project._id}>
            <Link
              href={{
                pathname: `/dashboard/${project.title}/${project.title}`,
                query: { token: project._id },
              }}
            >
              {" "}
              {project.title}{" "}
            </Link>
          </div>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}
