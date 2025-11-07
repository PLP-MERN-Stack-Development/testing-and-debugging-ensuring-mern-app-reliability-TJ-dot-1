import { render, screen, waitFor, act } from '@testing-library/react';
import { UserProvider } from '../../context/UserContext';
import UserList from './UserList';

// Mock API
const mockGetUsers = jest.fn();

jest.mock('../../api/userApi', () => ({
  getUsers: () => mockGetUsers()
}));

describe('UserList Integration', () => {
  it('should fetch and display users', async () => {
    const mockUsers = [
      { _id: '1', name: 'John Doe', email: 'john@example.com' },
      { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    mockGetUsers.mockResolvedValue(mockUsers);

    render(
      <UserProvider>
        <UserList />
      </UserProvider>
    );

    // Should show loading initially
    expect(screen.getByText(/loading users/i)).toBeInTheDocument();

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.queryByText(/loading users/i)).not.toBeInTheDocument();
    });

    expect(mockGetUsers).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    mockGetUsers.mockRejectedValue(new Error('API Error'));

    await act(async () => {
      render(
        <UserProvider>
          <UserList />
        </UserProvider>
      );
    });

    await waitFor(async () => {
      await act(async () => {
        expect(screen.getByText(/error loading users/i)).toBeInTheDocument();
      });
    });
  });
});