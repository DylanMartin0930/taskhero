import { UserProvider } from "@/components/context/UserContext";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InboxPage from "../../src/app/dashboard/inbox/[inbox]/page";

// Mock the necessary modules and functions
vi.mock("@/components/queries/fetchTasks", () => ({
  fetchTasks: vi.fn(),
}));
vi.mock("@/components/ui/graphsWrapper", () => ({
  default: () => <div>Graph</div>,
}));
vi.mock("@/components/ui/duesoon", () => ({
  default: () => <div>Due Soon</div>,
}));
vi.mock("@/components/ui/tasklistwrapper", () => ({
  default: () => <div>TaskList</div>,
}));
vi.mock("react-hot-toast");

// Mock the UserContext
vi.mock("@/components/context/UserContext", () => ({
  useUser: () => ({
    userData: {
      currentStreak: 5,
      longestStreak: 10,
      completedTasks: 25,
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  }),
  UserProvider: ({ children }) => <div>{children}</div>,
}));

// Mocking `useQuery` and returning the `QueryClient` export from the mock
vi.mock("@tanstack/react-query", async () => {
  const originalModule = await vi.importActual("@tanstack/react-query");

  return {
    ...originalModule,
    useQuery: vi.fn(),
    QueryClient: originalModule.QueryClient,
    QueryClientProvider: originalModule.QueryClientProvider,
  };
});

describe("InboxPage", () => {
  let token: string;

  beforeEach(() => {
    // Mocking the global location.search for the token
    token = "test-token";
    delete window.location;
    window.location = {
      search: `?token=${token}`,
    } as unknown as Location;
  });

  const queryClient = new QueryClient();

  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          {component}
        </UserProvider>
      </QueryClientProvider>,
    );
  };

  it("renders loading state when data is still being fetched", () => {
    // Mock the `useQuery` hook to simulate loading state
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      isFetching: false,
    } as any);

    renderWithProviders(<InboxPage params={{}} />);

    expect(screen.getByText(/loading, please wait/i)).toBeInTheDocument();
  });

  it("renders error state when project data fails to load", async () => {
    const errorMessage = "Failed to load project info";

    // Mock the `useQuery` hook to simulate error state
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error(errorMessage),
      isFetching: false,
    } as any);

    renderWithProviders(<InboxPage params={{}} />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to load project info/i),
      ).toBeInTheDocument();
    });
  });

  it("renders project info correctly after loading", async () => {
    const projectInfoMock = {
      title: "Sample Project",
      createdDate: "2024-12-03",
      tasks: [{ id: 1 }, { id: 2 }],
      color: "blue",
    };

    // Mock the `useQuery` hook to simulate the fetched project data
    vi.mocked(useQuery).mockReturnValue({
      data: projectInfoMock,
      isLoading: false,
      isError: false,
      isFetching: false,
    } as any);

    renderWithProviders(<InboxPage params={{}} />);

    // Wait for the project info to be displayed
    await waitFor(() => {
      expect(screen.getByText("Sample Project")).toBeInTheDocument();
      expect(screen.getByText("Created on: 2024-12-03")).toBeInTheDocument();
      expect(screen.getByText("TaskList Size: 2")).toBeInTheDocument();
      expect(screen.getByText("Assigned Color: blue")).toBeInTheDocument();
    });

    // Check if other components render
    expect(screen.getByText("Graph")).toBeInTheDocument();
    expect(screen.getByText("Due Soon")).toBeInTheDocument();
    expect(screen.getByText("TaskList")).toBeInTheDocument();
  });

  it("does not render project info if no token is available", () => {
    // Mocking window.location to simulate no token in the URL
    delete window.location;
    window.location = {
      search: "", // Empty search query simulates no token
    } as Location;

    renderWithProviders(<InboxPage params={{}} />);

    // Ensure that the loading text appears when no token is found
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders the due soon component and task list", async () => {
    const projectInfoMock = {
      title: "Sample Project",
      createdDate: "2024-12-03",
      tasks: [{ id: 1 }, { id: 2 }],
      color: "blue",
    };

    // Mock the `useQuery` hook to simulate the fetched project data
    vi.mocked(useQuery).mockReturnValue({
      data: projectInfoMock,
      isLoading: false,
      isError: false,
      isFetching: false,
    } as any);

    renderWithProviders(<InboxPage params={{}} />);

    await waitFor(() => {
      expect(screen.getByText("Sample Project")).toBeInTheDocument();
    });

    expect(screen.getByText("Graph")).toBeInTheDocument();
    expect(screen.getByText("Due Soon")).toBeInTheDocument();
    expect(screen.getByText("TaskList")).toBeInTheDocument();
  });
});