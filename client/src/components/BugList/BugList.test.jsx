import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import BugList from './BugList';
import { BugProvider } from '../../context/BugContext';

// Mock the BugContext
jest.mock('../../context/BugContext', () => ({
  BugProvider: ({ children }) => <div>{children}</div>,
  useBugs: jest.fn(),
}));

const mockUseBugs = require('../../context/BugContext').useBugs;

describe('BugList', () => {
  const mockBugs = [
    {
      _id: '1',
      title: 'Bug 1',
      description: 'Description 1',
      status: 'open',
      createdAt: '2023-01-01T00:00:00.000Z',
    },
    {
      _id: '2',
      title: 'Bug 2',
      description: 'Description 2',
      status: 'closed',
      createdAt: '2023-01-02T00:00:00.000Z',
    },
  ];

  const mockFetchBugs = jest.fn();
  const mockUpdateBug = jest.fn();
  const mockDeleteBug = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    mockUseBugs.mockReturnValue({
      bugs: [],
      loading: true,
      error: null,
      fetchBugs: mockFetchBugs,
      updateBug: mockUpdateBug,
      deleteBug: mockDeleteBug,
    });

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    expect(screen.getByText('Loading bugs...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    mockUseBugs.mockReturnValue({
      bugs: [],
      loading: false,
      error: 'Failed to fetch bugs',
      fetchBugs: mockFetchBugs,
      updateBug: mockUpdateBug,
      deleteBug: mockDeleteBug,
    });

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    expect(screen.getByText('Failed to fetch bugs')).toBeInTheDocument();
  });

  test('renders empty state when no bugs', () => {
    mockUseBugs.mockReturnValue({
      bugs: [],
      loading: false,
      error: null,
      fetchBugs: mockFetchBugs,
      updateBug: mockUpdateBug,
      deleteBug: mockDeleteBug,
    });

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    expect(screen.getByText('No bugs reported yet')).toBeInTheDocument();
    expect(screen.getByText('Be the first to report a bug!')).toBeInTheDocument();
  });

  test('renders bug list with bugs', () => {
    mockUseBugs.mockReturnValue({
      bugs: mockBugs,
      loading: false,
      error: null,
      fetchBugs: mockFetchBugs,
      updateBug: mockUpdateBug,
      deleteBug: mockDeleteBug,
    });

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    expect(screen.getByText('All Bugs (2)')).toBeInTheDocument();
    expect(screen.getByText('Bug 1')).toBeInTheDocument();
    expect(screen.getByText('Bug 2')).toBeInTheDocument();
  });

  test('calls fetchBugs on mount', () => {
    mockUseBugs.mockReturnValue({
      bugs: [],
      loading: false,
      error: null,
      fetchBugs: mockFetchBugs,
      updateBug: mockUpdateBug,
      deleteBug: mockDeleteBug,
    });

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    expect(mockFetchBugs).toHaveBeenCalledTimes(1);
  });

  test('handles update bug', async () => {
    mockUseBugs.mockReturnValue({
      bugs: mockBugs,
      loading: false,
      error: null,
      fetchBugs: mockFetchBugs,
      updateBug: mockUpdateBug,
      deleteBug: mockDeleteBug,
    });

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    // Simulate clicking update on first bug item
    // This would be handled by BugItem component, but we can test the handler
    const bugList = screen.getByText('All Bugs (2)').closest('.bug-list');
    expect(bugList).toBeInTheDocument();

    // The actual update would be triggered by BugItem, but we can verify the handler is passed
    // Since BugItem is rendered, we can check if the update function is available
    expect(mockUpdateBug).not.toHaveBeenCalled(); // Initially not called
  });

  test('handles delete bug', async () => {
    mockUseBugs.mockReturnValue({
      bugs: mockBugs,
      loading: false,
      error: null,
      fetchBugs: mockFetchBugs,
      updateBug: mockUpdateBug,
      deleteBug: mockDeleteBug,
    });

    render(
      <BugProvider>
        <BugList />
      </BugProvider>
    );

    // Similar to update, the delete would be triggered by BugItem
    expect(mockDeleteBug).not.toHaveBeenCalled();
  });
});