import { http, HttpResponse } from "msw";

export const handlers = [
  // Mock for /api/users/login
  http.get("/api/users/login", () => {
    return HttpResponse.json([
      { id: 1, name: "Grace Town" },
      { id: 2, name: "Henry Page" },
    ]);
  }),

  // Mock for /api/tasks
  http.get("/api/tasks", () => {
    return HttpResponse.json([
      { id: 1, title: "Task 1", description: "Description 1" },
      { id: 2, title: "Task 2", description: "Description 2" },
      { id: 3, title: "Task 3", description: "Description 3" },
    ]);
  }),

  // Mock for /api/projects/getWritableProjects
  http.post("/api/projects/getWritableProjects", (req) => {
    const canWrite = req;

    if (canWrite) {
      // Return a list of projects when `canWrite` is true
      return HttpResponse.json({
        projects: [
          { id: 1, title: "Project 1" },
          { id: 2, title: "Project 2" },
        ],
      });
    } else {
      // Return an empty list if `canWrite` is false
      return HttpResponse.json({
        projects: [],
      });
    }
  }),

  // Mock for login response (you have a duplicate entry in your example)
  http.get("/api/users/login", () => {
    return HttpResponse.json({
      message: "Login successful",
      success: true,
    });
  }),
];
