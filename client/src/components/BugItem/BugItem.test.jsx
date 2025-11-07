import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BugItem from './BugItem';

// Mock window.confirm
const mockConfirm = jest.fn();
global.confirm = mockConfirm;

describe('BugItem', () => {
  const mockBug = {
    _id: '1',
    title: 'Test Bug',
    description: 'This is a test bug description',
    status: 'open',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  test('renders bug information correctly', () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Bug')).toBeInTheDocument();
    expect(screen.getByText('This is a test bug description')).toBeInTheDocument();
    expect(screen.getByText('open')).toBeInTheDocument();
    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  test('displays correct status color classes', () => {
    const { rerender } = render(<BugItem bug={{ ...mockBug, status: 'open' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    expect(screen.getByText('open')).toHaveClass('status-open');

    rerender(<BugItem bug={{ ...mockBug, status: 'in-progress' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    expect(screen.getByText('in-progress')).toHaveClass('status-in-progress');

    rerender(<BugItem bug={{ ...mockBug, status: 'closed' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);
    expect(screen.getByText('closed')).toHaveClass('status-closed');
  });

  test('shows "Start Progress" button for open bugs', () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const startButton = screen.getByRole('button', { name: /start progress/i });
    expect(startButton).toBeInTheDocument();
  });

  test('shows "Close Bug" button for in-progress bugs', () => {
    render(<BugItem bug={{ ...mockBug, status: 'in-progress' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const closeButton = screen.getByRole('button', { name: /close bug/i });
    expect(closeButton).toBeInTheDocument();
  });

  test('does not show status change button for closed bugs', () => {
    render(<BugItem bug={{ ...mockBug, status: 'closed' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.queryByRole('button', { name: /start progress|close bug/i })).not.toBeInTheDocument();
  });

  test('shows delete button', () => {
    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  test('calls onUpdate with correct status when Start Progress is clicked', async () => {
    mockOnUpdate.mockResolvedValue();

    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const startButton = screen.getByRole('button', { name: /start progress/i });
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('1', { status: 'in-progress' });
    });
  });

  test('calls onUpdate with correct status when Close Bug is clicked', async () => {
    mockOnUpdate.mockResolvedValue();

    render(<BugItem bug={{ ...mockBug, status: 'in-progress' }} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const closeButton = screen.getByRole('button', { name: /close bug/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('1', { status: 'closed' });
    });
  });

  test('disables buttons during update operation', async () => {
    mockOnUpdate.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const startButton = screen.getByRole('button', { name: /start progress/i });
    const deleteButton = screen.getByRole('button', { name: /delete/i });

    fireEvent.click(startButton);

    expect(startButton).toBeDisabled();
    expect(screen.getByText('Updating...')).toBeInTheDocument();

    await waitFor(() => {
      expect(startButton).not.toBeDisabled();
    });
  });

  test('calls onDelete when delete button is clicked and confirmed', async () => {
    mockOnDelete.mockResolvedValue();

    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this bug?');
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  test('does not call onDelete when delete is cancelled', () => {
    mockConfirm.mockReturnValue(false);

    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this bug?');
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('disables buttons during delete operation', async () => {
    mockOnDelete.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<BugItem bug={mockBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(deleteButton).toBeDisabled();
    expect(screen.getByText('Deleting...')).toBeInTheDocument();

    await waitFor(() => {
      expect(deleteButton).not.toBeDisabled();
    });
  });

  test('displays updated date when different from created date', () => {
    const updatedBug = {
      ...mockBug,
      updatedAt: '2023-01-02T00:00:00.000Z',
    };

    render(<BugItem bug={updatedBug} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });

  test('handles missing status gracefully', () => {
    const bugWithoutStatus = { ...mockBug };
    delete bugWithoutStatus.status;

    render(<BugItem bug={bugWithoutStatus} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText('open')).toBeInTheDocument(); // default status
  });
});