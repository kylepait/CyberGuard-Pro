import React, { useState, useEffect } from 'react';

function UserHome() {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage

  const [badges, setBadges] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await fetch(`http://localhost:4000/badges?user_id=${user.user_id}`);
        const data = await response.json();
        setBadges(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching badges:', error);
        setLoading(false);
      }
    };

    fetchBadges();
  }, [user.id]);

  if (loading) {
    return <p>Loading badges...</p>;
  }

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      <p>User ID: {user.user_id}</p>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
      <p>Organization ID: {user.organization_id}</p>
      <p>User Role: {user.user_role}</p>

      <h3>Badges:</h3>
      <ul>
      {badges.length > 0 ? (
        <ul>
          {badges.map(badge => (
            <li key={badge.badge_id}>
              {badge.badge_id} - {badge.badge_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No badges found.</p>
      )}
      </ul>
    </div>
  );
}

export default UserHome;