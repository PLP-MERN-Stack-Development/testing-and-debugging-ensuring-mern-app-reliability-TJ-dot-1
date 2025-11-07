import axios from 'axios';
import { logger } from '../utils/logger';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createBug = async (bugData) => {
  try {
    logger.info('Creating bug', { title: bugData.title });
    const response = await api.post('/bugs', bugData);
    logger.info('Bug created successfully', { id: response.data._id });
    return response.data;
  } catch (error) {
    logger.error('Error creating bug', {
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Provide user-friendly error messages
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'Failed to create bug. Please try again.';
      throw new Error(message);
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

export const getBugs = async () => {
  try {
    const response = await api.get('/bugs');
    return response.data;
  } catch (error) {
    console.error('Error fetching bugs:', error);

    if (error.response) {
      const message = error.response.data?.error || 'Failed to load bugs. Please try again.';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred while loading bugs.');
    }
  }
};

export const updateBug = async (id, bugData) => {
  console.log('bugApi: updateBug called with id:', id, 'and data:', bugData);
  try {
    console.log('bugApi: Making PUT request to /bugs/' + id);
    const response = await api.put(`/bugs/${id}`, bugData);
    console.log('bugApi: Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating bug:', error);

    if (error.response) {
      const message = error.response.data?.error || 'Failed to update bug. Please try again.';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred while updating the bug.');
    }
  }
};

export const deleteBug = async (id) => {
  try {
    const response = await api.delete(`/bugs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting bug:', error);

    if (error.response) {
      const message = error.response.data?.error || 'Failed to delete bug. Please try again.';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error('An unexpected error occurred while deleting the bug.');
    }
  }
};