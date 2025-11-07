import { logger } from '../utils/logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createUser = async (userData) => {
  try {
    logger.info('Creating user', { email: userData.email });
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error || 'Failed to create user account. Please try again.';
      logger.error('User creation failed', { status: response.status, message });
      throw new Error(message);
    }

    const result = await response.json();
    logger.info('User created successfully', { id: result._id });
    return result;
  } catch (error) {
    logger.error('Error creating user', { error: error.message });

    // Re-throw with user-friendly message if it's a network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error || 'Failed to load users. Please try again.';
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }

    throw error;
  }
};