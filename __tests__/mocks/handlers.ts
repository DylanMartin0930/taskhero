import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users/login", () => {
    return HttpResponse.json([
      { id: 1, name: "Grace Town" },
      { id: 2, name: "Henry Page" },
    ]);
  }),

  http.get("/api/tasks", () => {
    return HttpResponse.json([
      { id: 1, title: "Task 1", description: "Description 1" },
      { id: 2, title: "Task 2", description: "Description 2" },
      { id: 3, title: "Task 3", description: "Description 3" },
    ]);
  }),

  http.get("/api/users/login", () => {
    return HttpResponse.json({
      message: "Login successful",
      success: true,
    });
  }),
];
