import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugForm from './BugForm';
import { BugProvider } from '../../context/BugContext';

// Mock the BugContext
jest.mock('../../context/BugContext', () => ({
  BugProvider: ({ children }) => <div>{children}</div>,
  useBugs: jest.fn(),
}));

const mockUseBugs = require('../../context/BugContext').useBugs;

describe('BugForm', () => {
  const mockAddBug = jest.fn();

  beforeEach(() => {
    mockUseBugs.mockReturnValue({
      addBug: mockAddBug,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form elements correctly', () => {
    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    expect(screen.getByText('Report a Bug')).toBeInTheDocument();
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit bug/i })).toBeInTheDocument();
  });

  test('validates title field - required', async () => {
    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    const submitButton = screen.getByRole('button', { name: /submit bug/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
  });

  test('validates title field - minimum length', async () => {
    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /submit bug/i });

    userEvent.clear(titleInput);
    userEvent.type(titleInput, 'ab');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    });
  });

  test('validates description field - required', async () => {
    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /submit bug/i });

    userEvent.type(titleInput, 'Valid Title');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  test('validates description field - minimum length', async () => {
    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /submit bug/i });

    userEvent.clear(titleInput);
    userEvent.clear(descriptionInput);
    userEvent.type(titleInput, 'Valid Title');
    userEvent.type(descriptionInput, 'short');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 10 characters')).toBeInTheDocument();
    });
  });

  test('clears errors when user starts typing', async () => {
    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole('button', { name: /submit bug/i });

    // Trigger validation error
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });

    // Start typing to clear error
    userEvent.type(titleInput, 'a');
    await waitFor(() => {
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });

  test('submits form successfully', async () => {
    mockAddBug.mockResolvedValue({ _id: '1', title: 'Test Bug', description: 'Test Description' });

    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /submit bug/i });

    userEvent.type(titleInput, 'Test Bug');
    userEvent.type(descriptionInput, 'This is a test description with enough characters');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddBug).toHaveBeenCalledWith({
        title: 'Test Bug',
        description: 'This is a test description with enough characters',
      });
    });

    // Check form reset
    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  test('displays error message from context', () => {
    mockUseBugs.mockReturnValue({
      addBug: mockAddBug,
      loading: false,
      error: 'Failed to create bug',
    });

    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    expect(screen.getByText('Failed to create bug')).toBeInTheDocument();
  });

  test('disables submit button during submission', async () => {
    mockAddBug.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <BugProvider>
        <BugForm />
      </BugProvider>
    );

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /submit bug/i });

    userEvent.type(titleInput, 'Test Bug');
    userEvent.type(descriptionInput, 'This is a test description with enough characters');
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Submitting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByText('Submit Bug')).toBeInTheDocument();
    });
  });
});