import { render, screen } from "@testing-library/react";
import TaskList from "@/components/testers/tasklist";
import { server } from "../mocks/server";
import { HttpResponse, http } from "msw";

//TaskList.test.tsx
describe("TaskList", () => {
  it("should render list of tasks", async () => {
    //api call in this case will be in the comonent itself
    render(<TaskList />);

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no tasks available if no tasks found", async () => {
    //mocking the same API endpoint but with empty response case
    server.use(http.get("/api/tasks", () => HttpResponse.json([])));

    render(<TaskList />);

    const errorMessage = await screen.findByText(/no tasks/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it("should render error message if error is returned", async () => {
    //mocking the same API endpoint but with error response case
    server.use(http.get("/api/tasks", () => HttpResponse.error()));

    render(<TaskList />);

    const errorMessage = await screen.findByText(/error/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
