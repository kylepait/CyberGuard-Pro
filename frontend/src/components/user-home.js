import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';



function UserHome() {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage

  const [badges, setBadges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');


  const generatePassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    setGeneratedPassword(password);
  };

  const updatePassword = async () => {
    if (!generatedPassword) return;
  
    try {
      const response = await fetch('http://localhost:4000/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user_id, newPassword: generatedPassword }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Password updated successfully!');
        setGeneratedPassword(''); // Clear the password field after update
      } else {
        alert('Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password');
    }
  };

  const awardBadge = async (badgeId) => {
    try {
      const response = await fetch('http://localhost:4000/add-badge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user_id, badgeId }),
      });
  
      const data = await response.json();
      if (data.success) {
        alert('Badge awarded successfully!');
      } else {
        alert('Failed to award Badge.');
      }
    } catch (error) {
      console.error('Error awarding Badge:', error);
      alert('Error awarding Badge');
    }
  };



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
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>

      <Link to='/TrainingModule' style={{ margin: '10px 0', display: 'inline-block', textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
        Training Module Page
      </Link>

      <div style={{ display: 'flex', marginBottom: '20px' }}>
      {/* User Info Section */}
      <div style={{ flex: 1, paddingRight: '20px' }}> {/* Adjust the paddingRight as needed */}
        <h2>Welcome, {user.username}!</h2>
        <p>Email: {user.email}</p>
        <p>User ID: {user.user_id}</p>
        <p>First Name: {user.first_name}</p>
        <p>Last Name: {user.last_name}</p>
        <p>Organization ID: {user.organization_id}</p>
        <p>User Role: {user.user_role}</p>
      </div>

      {/* Badges Section */}
      <div style={{ flex: 1 }}>
        <h3>Your Badges:</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
          {badges.map(badge => (
            <li key={badge.badge_id} style={{ marginBottom: '10px' }}>
              <img src={process.env.PUBLIC_URL + badge.image_path} alt={badge.badge_name} style={{ width: '100px', height: '100px', marginRight: '10px' }} />
              {badge.badge_id} - {badge.badge_name}
            </li>
          ))}
        </ul>
      </div>
    </div>

      <div className='password-generator' style={{ marginBottom: '20px' }}>
        <button onClick={() => { generatePassword(12); awardBadge(4); }} style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Generate Password
        </button>
        {generatedPassword && (
          <>
            <p>Generated Password: <strong>{generatedPassword}</strong></p>
            <button onClick={updatePassword} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Set as My New Password
            </button>
          </>
        )}
      </div>

      {user.user_role === 'management' && (
        <div style={{ backgroundColor: '#17a2b8', padding: '20px', borderRadius: '5px', color: 'white', marginTop: '20px' }}>
          <h3>Employees in Your Organization:</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {employees.map(employee => (
              <li key={employee.user_id} style={{ marginBottom: '10px' }}>
                <p>First Name: {employee.first_name}</p>
                <p>Last Name: {employee.last_name}</p>
                <p>Email: {employee.email}</p>
                <p>User ID: {employee.user_id}</p>
                <ul style={{ listStyleType: 'none', paddingLeft: '20px' }}>
                  {employee.badges.map(badge => (
                    <li key={badge.badge_id}>
                      <img src={process.env.PUBLIC_URL + badge.image_path} alt={badge.badge_name} style={{ width: '100px', height: '100px', marginRight: '10px', verticalAlign: 'middle' }} />
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