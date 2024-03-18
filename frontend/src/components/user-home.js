import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';



function UserHome() {
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage

  const [badges, setBadges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);


  


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

  const [passwordStrength, setPasswordStrength] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1; // Length at least 8
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase letters
    if (/[a-z]/.test(password)) strength += 1; // Lowercase letters
    if (/[0-9]/.test(password)) strength += 1; // Digits
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Special characters

    switch (strength) {
      case 0:
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Moderate";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "Unknown";
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setUserPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
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

  const fetchLeaderboard = async (organizationId) => {
    try {
      const response = await fetch(`http://localhost:4000/leaderboard/${user.organization_id}`)
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
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
        setEmployees(data); // Assuming the endpoint returns structured data
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

    fetchLeaderboard();

  }, [user.user_id, user.user_role, user.organization_id]); // Added dependencies for useEffect
  


  if (loading) {
    return <p>Loading badges...</p>;
  }

  return (
    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>



    <Link to='/TrainingModule' style={{ margin: '10px 10px 10px 0', display: 'inline-block', textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
      Training Page
    </Link>

    <Link to='/triviaGame' style={{ margin: '10px 10px 10px 0', display: 'inline-block', textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
      Test Your Knowledge!
    </Link>

    {user.user_role === 'management' && (
        <Link to='/manager_metrics' style={{ margin: '10px 0', display: 'inline-block', textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
          Manager Metrics Dashboard
        </Link>
    )}

    {user.user_role === 'dev' && (
        <Link to='/dev_hub' style={{ margin: '10px 0', display: 'inline-block', textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
          Developer Hub
        </Link>
    )}

    <div style={{ display: 'flex', marginBottom: '20px', gap: '20px' }}>
      <div style={{ 
          flex: 1, 
          backgroundColor: '#ffffff', 
          padding: '20px', 
          borderRadius: '5px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px' }}>
          
          <h2 style={{ margin: '0 0 10px 0', paddingBottom: '5px' }}>
              Welcome, {user.username}!
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: '20px', rowGap: '5px' }}>
              <strong>Email:</strong>
              <span>{user.email}</span>
              <strong>User ID:</strong>
              <span>{user.user_id}</span>
              <strong>First Name:</strong>
              <span>{user.first_name}</span>
              <strong>Last Name:</strong>
              <span>{user.last_name}</span>
              <strong>Organization ID:</strong>
              <span>{user.organization_id}</span>
              <strong>User Role:</strong>
              <span>{user.user_role}</span>
              <strong>Score:</strong>
              <span>{user.score}</span>
              {user.user_role !== 'management' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: '20px' }}>
                  <strong>Leaderboard Rank: </strong> 
                  {leaderboard.map(employee => {
                    if(employee.user_id === user.user_id) {
                      return <span key={employee.user_id}> {employee.rank}</span>;
                    }
                    return null;
                  })}
                </div>
              )}
              </div>
          </div>

      <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Your Badges:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
            {badges.map(badge => (
              <div key={badge.badge_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <img src={process.env.PUBLIC_URL + badge.image_path} alt={badge.badge_name} style={{ width: '100px', height: '100px' }} title={badge.badge_name} />
                <span style={{ marginTop: '5px', textAlign: 'center', fontSize: '14px', visibility: 'hidden' }}>{badge.badge_name}</span>
              </div>
            ))}
          </div>
      </div>
    </div>

    <div className='password-generator' style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
      <button onClick={() => { generatePassword(12); awardBadge(4); }} style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Generate Password
      </button>
      {generatedPassword && (
        <>
          <p data-testid="generatedPassword">Generated Password: <strong>{generatedPassword}</strong></p>
          <button onClick={updatePassword} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Set as My New Password
          </button>
        </>
      )}



    </div>

    <input 
    type="password" 
    value={userPassword} 
    onChange={handlePasswordChange} 
    placeholder="Test Your Password"
/>

      <div className="strength-meter">
          <div style={{
              width: passwordStrength === "Very Weak" ? "20%" :
                    passwordStrength === "Weak" ? "40%" :
                    passwordStrength === "Moderate" ? "60%" :
                    passwordStrength === "Strong" ? "80%" : 
                    passwordStrength === "Very Strong" ? "100%" : "0%",
              backgroundColor: passwordStrength === "Very Weak" ? "#ff3e3e" :
                              passwordStrength === "Weak" ? "#ffae00" :
                              passwordStrength === "Moderate" ? "#f7ff00" :
                              passwordStrength === "Strong" ? "#90ee90" :
                              passwordStrength === "Very Strong" ? "#008000" : "#dddddd",
              height: "10px",
              borderRadius: "5px"
          }}></div>
      </div>
      <div>Password Strength: {passwordStrength}</div>

      {user.user_role === 'management' && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', color: '#343a40', marginTop: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ color: '#17a2b8' }}>Employees in Your Organization:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
            {employees.map(employee => (
              <div key={employee.user_id} style={{ background: 'white', borderRadius: '5px', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{employee.first_name} {employee.last_name}</h4>
                <p style={{ margin: '0' }}>Email: {employee.email}</p>
                <p style={{ margin: '0' }}>User ID: {employee.user_id}</p>
                <div style={{ marginTop: '10px' }}>
                  {employee.badges.map(badge => (
                    <span key={badge.badge_id} style={{ display: 'inline-block', background: '#e9ecef', borderRadius: '5px', padding: '5px 10px', marginRight: '5px', marginBottom: '5px', fontSize: '14px' }}>
                      {badge.badge_name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserHome;