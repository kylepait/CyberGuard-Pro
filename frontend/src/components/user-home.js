import React from 'react';

function UserHome() {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
      <p>Organization ID: {user.organization_id}</p>
      <p>User Role: {user.user_role}</p>
    </div>
  );
}

export default UserHome;