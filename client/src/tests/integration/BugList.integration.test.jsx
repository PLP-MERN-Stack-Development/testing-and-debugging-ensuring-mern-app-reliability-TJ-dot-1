import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BugProvider } from '../../context/BugContext';
import BugList from '../../components/BugList/BugList';
import BugForm from '../../components/BugForm/BugForm';

// Mock the API calls
jest.mock('../../api/bugApi', () => ({
  createBug: jest.fn(),
  getBugs: jest.fn(),
  updateBug: jest.fn(),
  deleteBug: jest.fn(),
}));

const mockCreateBug = require('../../api/bugApi').createBug;
const mockGetBugs = require('../../api/bugApi').getBugs;
const mockUpdateBug = require('../../api/bugApi').updateBug;
const mockDeleteBug = require('../../api/bugApi').deleteBug;

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

describe('BugList Integration Tests', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Integration Test Bug 1',
      description: 'This is the first integration test bug',
      status: 'open',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      _id: '2',
      title: 'Integration Test Bug 2',
      description: 'This is the second integration test bug',
      status: 'in-progress',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  test('loads and displays bugs on mount', async () => {
    mockGetBugs.mockResolvedValue(mockBugs);

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    await waitFor(() => {
      expect(mockGetBugs).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('All Bugs (2)')).toBeInTheDocument();
    expect(screen.getByText('Integration Test Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Integration Test Bug 2')).toBeInTheDocument();
  });

  test('shows loading state initially', () => {
    mockGetBugs.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve([]), 100)));

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    expect(screen.getByText('Loading bugs...')).toBeInTheDocument();
  });

  test('shows error state when API fails', async () => {
    mockGetBugs.mockRejectedValue(new Error('Network error'));

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch bugs. Please try again.')).toBeInTheDocument();
    });
  });

  test('shows empty state when no bugs', async () => {
    mockGetBugs.mockResolvedValue([]);

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No bugs reported yet')).toBeInTheDocument();
    });
  });

  test('updates bug status and refreshes list', async () => {
    mockGetBugs.mockResolvedValue(mockBugs);
    mockUpdateBug.mockResolvedValue({
      ...mockBugs[0],
      status: 'in-progress',
      updatedAt: '2023-01-03T00:00:00.000Z',
    });

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Integration Test Bug 1')).toBeInTheDocument();
    });

    // Find and click the "Start Progress" button for the first bug
    const startProgressButton = screen.getByRole('button', { name: /start progress/i });
    fireEvent.click(startProgressButton);

    await waitFor(() => {
      expect(mockUpdateBug).toHaveBeenCalledWith('1', { status: 'in-progress' });
    });

    // Verify the bug status was updated in the UI
    await waitFor(() => {
      expect(screen.getByText('in-progress')).toBeInTheDocument();
    });
  });

  test('deletes bug and refreshes list', async () => {
    mockGetBugs.mockResolvedValue(mockBugs);
    mockDeleteBug.mockResolvedValue();

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('All Bugs (2)')).toBeInTheDocument();
    });

    // Find and click the delete button for the first bug
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this bug?');
      expect(mockDeleteBug).toHaveBeenCalledWith('1');
    });

    // Verify the bug was removed from the UI
    await waitFor(() => {
      expect(screen.getByText('All Bugs (1)')).toBeInTheDocument();
      expect(screen.queryByText('Integration Test Bug 1')).not.toBeInTheDocument();
    });

    // Re-fetch bugs to update the list
    mockGetBugs.mockResolvedValue([mockBugs[1]]);
  });

  test('handles API errors during update', async () => {
    mockGetBugs.mockResolvedValue(mockBugs);
    mockUpdateBug.mockRejectedValue(new Error('Update failed'));

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Integration Test Bug 1')).toBeInTheDocument();
    });

    const startProgressButton = screen.getByRole('button', { name: /start progress/i });
    fireEvent.click(startProgressButton);

    await waitFor(() => {
      expect(mockUpdateBug).toHaveBeenCalledWith('1', { status: 'in-progress' });
    });

    // Error should be displayed (handled by context)
    // Note: The exact error message depends on how the context handles it
  });

  test('handles API errors during delete', async () => {
    mockGetBugs.mockResolvedValue(mockBugs);
    mockDeleteBug.mockRejectedValue(new Error('Delete failed'));

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Integration Test Bug 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteBug).toHaveBeenCalledWith('1');
    });

    // Error should be displayed (handled by context)
  });

  test('full workflow: create, update, and delete bug', async () => {
    // Initial empty state
    mockGetBugs.mockResolvedValue([]);

    render(
      <BugProvider>
        <BugForm />
        <BugList />
      </BugProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('No bugs reported yet')).toBeInTheDocument();
    });

    // Create a new bug
    const newBug = {
      _id: '3',
      title: 'New Integration Bug',
      description: 'This is a newly created bug for integration testing',
      status: 'open',
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-03T00:00:00.000Z',
    };

    mockCreateBug.mockResolvedValue(newBug);
    mockGetBugs.mockResolvedValue([newBug]);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /submit bug/i });

    userEvent.clear(titleInput);
    userEvent.clear(descriptionInput);
    userEvent.type(titleInput, 'New Integration Bug');
    userEvent.type(descriptionInput, 'This is a newly created bug for integration testing');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateBug).toHaveBeenCalledWith({
        title: 'New Integration Bug',
        description: 'This is a newly created bug for integration testing',
      });
    });

    // Verify bug appears in list
    await waitFor(() => {
      expect(screen.getByText('New Integration Bug')).toBeInTheDocument();
    });

    // Update the bug status
    mockUpdateBug.mockResolvedValue({
      ...newBug,
      status: 'in-progress',
      updatedAt: '2023-01-04T00:00:00.000Z',
    });

    const startProgressButton = screen.getByRole('button', { name: /start progress/i });
    fireEvent.click(startProgressButton);

    await waitFor(() => {
      expect(mockUpdateBug).toHaveBeenCalledWith('3', { status: 'in-progress' });
    });

    // Delete the bug
    mockDeleteBug.mockResolvedValue();
    mockGetBugs.mockResolvedValue([]);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteBug).toHaveBeenCalledWith('3');
    });

    // Verify empty state returns
    await waitFor(() => {
      expect(screen.getByText('No bugs reported yet')).toBeInTheDocument();
    });
  });
});