import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserForm from './UserForm';
import { createUser } from '../../api/userApi';

// Mock API call
jest.mock('../../api/userApi', () => ({
  createUser: jest.fn(() => Promise.resolve({ success: true }))
}));

describe('UserForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('should render form fields', () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should validate form inputs', async () => {
    render(<UserForm onSubmit={mockOnSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  test('submits form data correctly', async () => {
    render(<UserForm />);
    
    // Fill out the form
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    
    await act(async () => {
      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await fireEvent.click(submitButton);
    });

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('User created successfully!')).toBeInTheDocument();
    });

    expect(createUser).toHaveBeenCalledWith({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
  });
});