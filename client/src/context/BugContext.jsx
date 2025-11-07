import React, { createContext, useState, useContext, useCallback } from 'react';
import { createBug, getBugs, updateBug as apiUpdateBug, deleteBug as apiDeleteBug } from '../api/bugApi';

const BugContext = createContext();

export const BugProvider = ({ children }) => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addBug = async (bugData) => {
    setLoading(true);
    setError(null);
    try {
      const newBug = await createBug(bugData);
      setBugs(prevBugs => [...prevBugs, newBug]);
      return newBug;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create bug. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBug = async (id, updatedBugData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBug = await apiUpdateBug(id, updatedBugData);
      setBugs(prevBugs => prevBugs.map(bug =>
        bug._id === id ? updatedBug : bug
      ));
      return updatedBug;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update bug. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBug = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiDeleteBug(id);
      setBugs(prevBugs => prevBugs.filter(bug => bug._id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete bug. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchBugs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedBugs = await getBugs();
      setBugs(fetchedBugs);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch bugs. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    bugs,
    setBugs,
    loading,
    setLoading,
    error,
    setError,
    addBug,
    updateBug,
    deleteBug,
    fetchBugs
  };

  return (
    <BugContext.Provider value={value}>
      {children}
    </BugContext.Provider>
  );
};

export const useBugs = () => {
  const context = useContext(BugContext);
  if (!context) {
    throw new Error('useBugs must be used within a BugProvider');
  }
  return context;
};