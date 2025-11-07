import React, { useEffect } from 'react';
import { useUsers } from '../../context/UserContext';
import { getUsers } from '../../api/userApi';

const UserList = () => {
  const { users, setUsers, loading, setLoading, error, setError } = useUsers();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        setError('Error loading users');
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [setUsers, setLoading, setError]);

  if (loading) {
    return <div className="user-list-loading" data-testid="loading">Loading users...</div>;
  }

  if (error) {
    return <div className="user-list-error">{error}</div>;
  }

  return (
    <div className="user-list">
      <h2>Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="user-list-items">
          {users.map(user => (
            <li key={user._id || user.id} className="user-list-item">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;