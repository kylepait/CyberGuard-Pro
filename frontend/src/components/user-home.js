import React, { useState, useEffect } from 'react';



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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching badges:', error);
        setLoading(false);
      }

      const fetchEmployees = async () => {
        try {
          const response = await fetch(`http://localhost:4000/employees?organization_id=${user.organization_id}`);
          const data = await response.json();
          setEmployees(data);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
  
      if (user.user_role === 'management') {
        fetchEmployees();
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

      <h3>Your Badges:</h3>
      <ul>
        {badges.map(badge => (
          <li key={badge.badge_id}>
            {badge.badge_id === 1 && (
              <>
                <img src={process.env.PUBLIC_URL + '/gold_badge.jpg'} alt="Gold Badge" style={{ width: '100px', height: '100px' }} />
                {badge.badge_id} - {badge.badge_name}
              </>
            )}
            {badge.badge_id === 2 && (
              <>
                <img src={process.env.PUBLIC_URL + '/silver_badge.jpg'} alt="Silver Badge" style={{ width: '100px', height: '100px' }} />
                {badge.badge_id} - {badge.badge_name}
              </>
            )}
            {badge.badge_id === 3 && (
              <>
                <img src={process.env.PUBLIC_URL + '/bronze_badge.jpg'} alt="Bronze Badge" style={{ width: '100px', height: '100px' }} />
                {badge.badge_id} - {badge.badge_name}
              </>
            )}
          </li>
        ))}
      </ul>
      {user.user_role === 'management' && (
        <div>
          <h3>Employees in Your Organization:</h3>
          <ul>
            {employees.map(employee => (
              <li key={employee.user_id}>
                <p>First Name: {employee.first_name}</p>
                <p>Last Name: {employee.last_name}</p>
                <p>Email: {employee.email}</p>
                <p>User ID: {employee.user_id}</p>
                <ul>
                  {console.log("Badges for user ID", employee.user_id, ":", badges.filter(badge => badge.user_id === employee.user_id))}
                  {badges.map(badge => (
                    <li key={badge.badge_id}>
                      {badge.badge_id === 1 && (
                        <>
                          <img src={process.env.PUBLIC_URL + '/gold_badge.jpg'} alt="Gold Badge" style={{ width: '100px', height: '100px' }} />
                          {badge.badge_id} - {badge.badge_name}
                        </>
                      )}
                      {badge.badge_id === 2 && (
                        <>
                          <img src={process.env.PUBLIC_URL + '/silver_badge.jpg'} alt="Silver Badge" style={{ width: '100px', height: '100px' }} />
                          {badge.badge_id} - {badge.badge_name}
                        </>
                      )}
                      {badge.badge_id === 3 && (
                        <>
                          <img src={process.env.PUBLIC_URL + '/bronze_badge.jpg'} alt="Bronze Badge" style={{ width: '100px', height: '100px' }} />
                          {badge.badge_id} - {badge.badge_name}
                        </>
                      )}
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