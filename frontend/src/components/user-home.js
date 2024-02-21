import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';



function UserHome() {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage

  const [badges, setBadges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchBadges = async () => {
      try {
        const response = await fetch(`http://localhost:4000/badges?user_id=${user.user_id}`);
        const data = await response.json();
        setBadges(data);
      } catch (error) {
        console.error('Error fetching badges:', error);
      }
    };
  
    // New function to fetch badges of employees within the manager's organization
    const fetchEmployeeBadges = async () => {
      try {
        const response = await fetch(`http://localhost:4000/badges/organization/${user.organization_id}`);
        const data = await response.json();
        setEmployees(data); // Assuming the endpoint returns structured data as discussed
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error('Error fetching employee badges:', error);
        setLoading(false); // Ensure loading is set to false even if there is an error
      }
    };
  
    // Call fetchBadges for all users
    fetchBadges();
  
    // Call fetchEmployeeBadges if the user is a manager
    if (user.user_role === 'management') {
      fetchEmployeeBadges();
    } else {
      // If not a manager, ensure loading is set to false
      // This is necessary if no other data fetching is performed for non-managers
      setLoading(false);
    }
  }, [user.user_id, user.user_role, user.organization_id]); // Added dependencies for useEffect
  


  if (loading) {
    return <p>Loading badges...</p>;
  }

  return (
    <div>

      <Link to='/TrainingModule' className='btn btn-default border w-15 bg-light rounded 0 text-decoration-none'>Training Module Page</Link>


      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      <p>User ID: {user.user_id}</p>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>
      <p>Organization ID: {user.organization_id}</p>
      <p>User Role: {user.user_role}</p>

      <h3>Your Badges:</h3>
      <ul>
        {badges.map(badge => (
          <li key={badge.badge_id}>
            <img src={`${process.env.PUBLIC_URL}${badge.image_path}`} alt={badge.badge_name} style={{ width: '100px', height: '100px' }} />
          </li>
        ))}
      </ul>
      {user.user_role === 'management' && (
        <div className='bg-info p-3 rounded w-25'>
          <h3>Employees in Your Organization:</h3>
          <ul>
            {employees.map(employee => (
              <li key={employee.user_id}>
                <p>First Name: {employee.first_name}</p>
                <p>Last Name: {employee.last_name}</p>
                <p>Email: {employee.email}</p>
                <p>User ID: {employee.user_id}</p>
                <ul>
                  {employee.badges.map(badge => ( // Assuming each employee object has a badges array
                    <li key={badge.badge_id}>
                      <img src={process.env.PUBLIC_URL + badge.image_path} alt={badge.badge_name} style={{ width: '100px', height: '100px' }} />
                      {badge.badge_id} - {badge.badge_name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserHome;