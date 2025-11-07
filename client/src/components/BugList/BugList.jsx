import React, { useEffect, useCallback } from 'react';
import { useBugs } from '../../context/BugContext';
import BugItem from '../BugItem/BugItem';
import './BugList.css';

const BugList = () => {
  const { bugs, loading, error, updateBug, deleteBug, fetchBugs } = useBugs();

  const fetchBugsCallback = useCallback(() => {
    fetchBugs();
  }, [fetchBugs]);

  useEffect(() => {
    fetchBugsCallback();
  }, [fetchBugsCallback]);

  const handleUpdateBug = async (id, bugData) => {
    console.log('BugList: handleUpdateBug called with id:', id, 'data:', bugData);
    await updateBug(id, bugData);
  };

  const handleDeleteBug = async (id) => {
    console.log('BugList: handleDeleteBug called with id:', id);
    await deleteBug(id);
  };

  if (loading) {
    return (
      <div className="bug-list">
        <div className="loading">Loading bugs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bug-list">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (bugs.length === 0) {
    return (
      <div className="bug-list">
        <div className="empty-state">
          <h3>No bugs reported yet</h3>
          <p>Be the first to report a bug!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bug-list">
      <h2>All Bugs ({bugs.length})</h2>
      <div className="bug-items">
        {bugs.map(bug => (
          <BugItem
            key={bug._id}
            bug={bug}
            onUpdate={handleUpdateBug}
            onDelete={handleDeleteBug}
          />
        ))}
      </div>
    </div>
  );
};

export default BugList;