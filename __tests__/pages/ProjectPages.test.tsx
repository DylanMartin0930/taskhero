import { DueSoonbProvider } from '@/components/context/DueSoonContext';
import { GraphProvider } from '@/components/context/GraphContext';

import { UserProvider } from '@/components/context/UserContext';
import LogBookWrapper from '@/components/ui/logbookwrapper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import toast from 'react-hot-toast';
import { vi } from 'vitest';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('LogBookWrapper', () => {
  const mockTasks = [
    {
      _id: '1',
      title: 'Task 1',
      description: 'Description 1',
      completed: true,
    },
    {
      _id: '2',
      title: 'Task 2',
      description: 'Description 2',
      completed: true,
    },
  ];

  const mockFetchCall = vi.fn();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Helper function to render with all required providers
  const renderWithProviders = (component) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <GraphProvider>
            <DueSoonbProvider>
                {component}
            </DueSoonbProvider>
          </GraphProvider>
        </UserProvider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when no tasks are available', () => {
    mockFetchCall.mockImplementation((projectId, setTasks) => setTasks([]));

    renderWithProviders(
      <LogBookWrapper
        projectId="test-project"
        fetchcall={mockFetchCall}
        writeperm={true}
      />
    );

    expect(screen.getByText('No tasks available.')).toBeInTheDocument();
  });

  it('renders tasks when they are available', async () => {
    mockFetchCall.mockImplementation((projectId, setTasks) => setTasks(mockTasks));

    renderWithProviders(
      <LogBookWrapper
        projectId="test-project"
        fetchcall={mockFetchCall}
        writeperm={true}
      />
    );

    await waitFor(() => {
      expect(mockFetchCall).toHaveBeenCalledWith(
        'test-project',
        expect.any(Function)
      );
    });
  });

  it('shows success toast when project is selected', async () => {
    mockFetchCall.mockImplementation((projectId, setTasks) => setTasks(mockTasks));

    renderWithProviders(
      <LogBookWrapper
        projectId="test-project"
        fetchcall={mockFetchCall}
        writeperm={true}
      />
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('project selected');
    });
  });

  it('shows error toast when no project is selected', async () => {
    renderWithProviders(
      <LogBookWrapper
        projectId=""
        fetchcall={mockFetchCall}
        writeperm={true}
      />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No project selected');
    });
  });

  it('calls fetchcall with correct projectId', async () => {
    const projectId = 'test-project';
    mockFetchCall.mockImplementation((projectId, setTasks) => setTasks(mockTasks));

    renderWithProviders(
      <LogBookWrapper
        projectId={projectId}
        fetchcall={mockFetchCall}
        writeperm={true}
      />
    );

    await waitFor(() => {
      expect(mockFetchCall).toHaveBeenCalledWith(
        projectId,
        expect.any(Function)
      );
    });
  });
});