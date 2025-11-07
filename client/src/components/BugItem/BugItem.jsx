import React, { useState } from 'react';
import Button from '../Button';
import './BugItem.css';

const BugItem = ({ bug, onUpdate, onDelete }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    console.log('BugItem: handleStatusChange called with newStatus:', newStatus);
    console.log('BugItem: current bug status:', bug.status);
    setIsUpdating(true);
    try {
      // Bug: Incorrect status transition logic - always sets to 'closed' regardless of newStatus
      console.log('BugItem: About to call onUpdate with hardcoded status: closed');
      await onUpdate(bug._id, { status: 'closed' });
      console.log('BugItem: Status update completed');
    } catch (error) {
      console.error('Error updating bug status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bug?')) {
      setIsDeleting(true);
      try {
        await onDelete(bug._id);
      } catch (error) {
        console.error('Error deleting bug:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-in-progress';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  return (
    <div className="bug-item">
      <div className="bug-header">
        <h3 className="bug-title">{bug.title}</h3>
        <span className={`bug-status ${getStatusColor(bug.status)}`}>
          {bug.status || 'open'}
        </span>
      </div>

      <div className="bug-description">
        <p>{bug.description}</p>
      </div>

      <div className="bug-meta">
        <small>
          Created: {new Date(bug.createdAt).toLocaleDateString()}
          {bug.updatedAt && bug.updatedAt !== bug.createdAt && (
            <> | Updated: {new Date(bug.updatedAt).toLocaleDateString()}</>
          )}
        </small>
      </div>

      <div className="bug-actions">
        {bug.status !== 'closed' && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleStatusChange(bug.status === 'open' ? 'in-progress' : 'closed')}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : bug.status === 'open' ? 'Start Progress' : 'Close Bug'}
          </Button>
        )}

        <Button
          variant="danger"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  );
};

export default BugItem;