"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DefaultOptions(props) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch all links for improved performance
    props.defaultOptions.forEach((project) => {
      const href = `/dashboard/${project.title}/${project.title}`;
      console.log(`Prefetching: ${href}`); // Log the href being prefetched
      router.prefetch(href);
    });
  }, [props.defaultOptions, router]);

  return (
    <div className="border border-black bg-[#d9d9d9]">
      {props.defaultOptions.length > 0 ? (
        props.defaultOptions.map((project, index) => (
          <Link
            prefetch={true}
            key={project._id}
            href={{
              pathname: `/dashboard/${project.title}/${project.title}`,
              query: { token: project._id },
            }}
            className={`block py-2 p-2 ${
              index !== props.defaultOptions.length - 1
                ? "border-b-2 border-black"
                : ""
            } hover:bg-[#b3b3b3] transition duration-200 ease-in-out`}
          >
            <div className="text-black">{project.title}</div>
          </Link>
        ))
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
}
