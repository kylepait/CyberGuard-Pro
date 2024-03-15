import React, { useState, useEffect } from 'react';

function TrainingModulesPage() {
  const [assignedModules, setAssignedModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);

  const [allTrainings, setAllTrainings] = useState([]);

  const [trainingAssignments, setTrainingAssignments] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));


  const [selectedEnrollEmployee, setSelectedEnrollEmployee] = useState('');
  const [selectedEnrollModule, setSelectedEnrollModule] = useState('');
  const [dropdownEnrollEmployee, setDropdownEnrollEmployee] = useState([]);
  const [dropdownEnrollModule, setDropdownEnrollModule] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [selectedUnenrollEmployee, setSelectedUnenrollEmployee] = useState('');
  const [selectedUnenrollModule, setSelectedUnenrollModule] = useState('');
  const [dropdownUnenrollEmployee, setDropdownUnenrollEmployee] = useState([]);
  const [dropdownUnenrollModule, setDropdownUnenrollModule] = useState([]);
  
  const [badges, setBadges] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const [rarestBadge, setRarestBadge] = useState({ badge_name: '', count: 0 });



  const refreshAllData = async () => {
    await fetchTrainingAssignments();
    await fetchEmployeeBadges();
    await fetchAllTrainings();
    await fetchTrainingAssignments();
    await fetchBadges();
  

    await fetchEnrollEmployees();
    await fetchUnenrollEmployees(); // Ensuring this calls the correct function to refresh employee badges
    // Include any other fetch calls needed to refresh your UI accordingly
  };
  

    const enrollEmployeeInTraining = async () => {
      const response = await fetch('http://localhost:4000/enroll-employee-training', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeUserId: selectedEnrollEmployee, moduleId: selectedEnrollModule })
      });
      const data = await response.json();
      if (data.success) {
          alert('Employee enrolled successfully!');
          await refreshAllData(); // Refresh all relevant data after a successful operation
      } else {
          alert('Failed to enroll employee.');
      }
  };

  const unenrollEmployeeFromTraining = async () => {
    const response = await fetch('http://localhost:4000/unenroll-employee-training', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeUserId: selectedUnenrollEmployee, moduleId: selectedUnenrollModule })
    });
    const data = await response.json();

    if (data.success) {
      alert('Employee unenrolled successfully!');
      await refreshAllData(); // Refresh all relevant data after a successful operation
    } else {
      alert('Failed to unenroll employee.');
    }
  };

  const fetchBadges = async () => {
    try {
      const response = await fetch(`http://localhost:4000/badges?user_id=${user.user_id}`);
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };

  const fetchEmployeeBadges = async () => {
    try {
      const response = await fetch(`http://localhost:4000/badges/organization/${user.organization_id}`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
  
        // Initialize a map to count occurrences of each badge
        let badgeCounts = new Map();
  
        // Iterate over each employee and their badges
        data.forEach(employee => {
          employee.badges.forEach(badge => {
            let count = badgeCounts.get(badge.badge_id) || { count: 0, name: badge.badge_name };
            badgeCounts.set(badge.badge_id, { count: count.count + 1, name: badge.badge_name });
          });
        });
  
        // Find the rarest badge by looking for the minimum count
        let rarestBadge = Array.from(badgeCounts.values()).reduce((acc, val) => val.count < acc.count ? val : acc, { count: Infinity, name: '' });
  
        setRarestBadge({ badge_name: rarestBadge.name, count: rarestBadge.count });
      } else {
        console.error('Failed to fetch employee badges');
      }
    } catch (error) {
      console.error('Error fetching employee badges:', error);
    }
  };






  useEffect(() => {

      refreshAllData();

      fetchAllTrainings();
    
      if (user.user_role === 'management') {
        fetchTrainingAssignments();
      }
      fetchTrainingModules();

      const fetchEmployees = async () => {
        if (user.user_role === 'management') {
          const url = `http://localhost:4000/employees/organization/${user.organization_id}`; // Updated URL to match the new endpoint
          const response = await fetch(url);
          const data = await response.json();
          setEmployees(data);
        }
      };
      
      fetchEmployees();




    
      // Call fetchBadges for all users
      fetchBadges();
      fetchEmployeeBadges();

      fetchEnrollEmployees();
      fetchUnenrollEmployees();

    }, [user.user_id, user.user_role, user.organization_id]);


  // Declare fetchAllTrainings outside useEffect
  const fetchAllTrainings = async () => {
    const response = await fetch('http://localhost:4000/all-trainings'); 
    const data = await response.json();
    setAllTrainings(data);
  };



  const fetchTrainingAssignments = async () => {
    const response = await fetch(`http://localhost:4000/training-assignments/${user.organization_id}`);
    const data = await response.json();
    setTrainingAssignments(data);
  };

  const fetchTrainingModules = async () => {
    const response = await fetch(`http://localhost:4000/user-training-modules?userId=${user.user_id}`);
    const data = await response.json();

    setAssignedModules(data.assignedModules);
    setCompletedModules(data.completedModules);
  };

  const fetchEnrollEmployees = async () => {
    const response = await fetch(`http://localhost:4000/employees/organization/${user.organization_id}`);
    const data = await response.json();

    setDropdownEnrollEmployee(data);
  };
  
  
  const fetchUnenrollEmployees = async () => {
    const response = await fetch(`http://localhost:4000/employees/organization/${user.organization_id}`);
    const data = await response.json();

    setDropdownUnenrollEmployee(data);
  };
  
  const handleEnrollEmployeeChange = async (event) => {
    const selectedValue = event.target.value;
    try {
        const response = await fetch(`http://localhost:4000/enroll-modules/${selectedValue}`);
        const data = await response.json();
        setSelectedEnrollEmployee(selectedValue);
        setDropdownEnrollModule(data);

    } catch (error) {
        console.error('Error fetching enroll module data:', error);
    }
  };
  
  const handleUnenrollEmployeeChange = async (event) => {
    const selectedValue = event.target.value;
    try {
        const response = await fetch(`http://localhost:4000/unenroll-modules/${selectedValue}`);
        const data = await response.json();
        setSelectedUnenrollEmployee(selectedValue);
        setDropdownUnenrollModule(data);
    } catch (error) {
        console.error('Error fetching unenroll module data:', error);
    }
  };

  const handleEnrollModuleChange = async (event) => {
    const selectedValue = event.target.value;
    
    setSelectedEnrollModule(selectedValue);
  };

  const handleUnenrollModuleChange = async (event) => {
    const selectedValue = event.target.value;
    
    setSelectedUnenrollModule(selectedValue);
  };


  

  return (
    <div style={{ padding: '20px' }}>

        <h2 style={{ borderBottom: '25px solid #17a2b8', paddingBottom: '10px' }}>Metrics Dashboard</h2>
  

        {/* Section for Employee Badges */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', color: '#343a40', marginTop: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>Employees in Your Organization:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                {employees.map(employee => (
                <div key={employee.user_id} style={{ background: 'white', borderRadius: '5px', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{employee.first_name} {employee.last_name}</h4>
                    <p style={{ margin: '0' }}>Email: {employee.email}</p>
                    <p style={{ margin: '0' }}>User ID: {employee.user_id}</p>
                    {/* Display total badges count */}
                    <p>Total Badges: {Array.isArray(employee.badges) ? employee.badges.length : 0}</p>
                    <div style={{ marginTop: '10px' }}>
                    {Array.isArray(employee.badges) ? employee.badges.map(badge => (
                        <span key={badge.badge_id} style={{ display: 'inline-block', background: '#e9ecef', borderRadius: '5px', padding: '5px 10px', marginRight: '5px', marginBottom: '5px', fontSize: '14px' }}>
                        {badge.badge_name}
                        </span>
                    )) : <p>No badges</p>}
                    </div>
                </div>
                ))}
            </div>
        </div>

            

  
      
        <>
        <div style={{ marginTop: '40px', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h2>Training Assignments for My Employees</h2>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '20px' }}>
                {trainingAssignments.map((assignment) => (
                <li key={`${assignment.user_id}-${assignment.module_name}`} style={{ 
                    padding: '10px', 
                    marginBottom: '10px',
                    backgroundColor: '#ffffff',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    }}>
                    <span style={{ fontWeight: 'bold' }}>{`${assignment.first_name} ${assignment.last_name}`}</span>  <span style={{ fontWeight: 'bold' }}>{assignment.module_name}</span>
                    <span style={{ 
                        padding: '5px 10px', 
                        borderRadius: '5px', 
                        color: '#ffffff', 
                        backgroundColor: assignment.status === 'completed' ? '#28a745' : '#dc3545', // Green for Completed, Red for Assigned
                    }}>
                    {assignment.status}
                    </span>
                </li>
                ))}
            </ul>
        </div>


        <div style={{ marginTop: '20px' }}>
          <h3>Rarest Badge:</h3>
          {rarestBadge.count > 0 ? (
            <p>The rarest badge is "{rarestBadge.badge_name}" with {rarestBadge.count} occurrences.</p>
          ) : (
            <p>Badge information is currently unavailable.</p>
          )}
        </div>

        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', color: '#343a40', marginTop: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>Employee Badge Information:</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '15px' }}>
                {employees.map(employee => (
                <div key={employee.user_id} style={{ background: 'white', borderRadius: '5px', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>{employee.first_name} {employee.last_name}</h4>
                    <p style={{ margin: '0' }}>Email: {employee.email}</p>
                    <p style={{ margin: '0' }}>User ID: {employee.user_id}</p>
                    <div style={{ marginTop: '10px' }}>
                    {employee.badges && employee.badges.map(badge => (
                        <div key={badge.badge_id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                            <span style={{ display: 'inline-block', background: '#e9ecef', borderRadius: '5px', padding: '5px 10px', marginRight: '5px', marginBottom: '5px', fontSize: '14px' }}>
                            {badge.badge_name}
                            </span>
                            {/* Display the earned date below each badge */}
                            <span style={{ fontSize: '12px', color: '#6c757d' }}>
                                Earned on: {new Date(badge.earned_date).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                    </div>
                </div>
                ))}
            </div>
        </div>
        

        {/* Leaderboard */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', color: '#343a40', marginTop: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h3>Employee Leaderboard:</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: '0', marginTop: '20px' }}>
          {employees
            .sort((a, b) => (Array.isArray(b.badges) ? b.badges.length : 0) - (Array.isArray(a.badges) ? a.badges.length : 0))
            .map((employee, index) => (
              <li key={employee.user_id} style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#ffffff',
                borderRadius: '5px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontWeight: 'bold' }}>{index + 1}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '10px' }}>
                  <p style={{ fontWeight: 'bold', margin: '0' }}>{employee.first_name} {employee.last_name}</p>
                  <p style={{ margin: '0', fontSize: '12px' }}>User ID: {employee.user_id}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ margin: '0' }}>Score: {Array.isArray(employee.badges) ? employee.badges.length : 0}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        

        
        <div style={{ marginTop: '20px', backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px'}}>
            <h2>Enroll Employees in Training</h2>
            <select value={selectedEnrollEmployee} onChange={handleEnrollEmployeeChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="">Select Employee</option>
              {employees.map(employee => (
                <option key={employee.user_id} value={employee.user_id}>{employee.first_name} {employee.last_name}</option>
              ))}
            </select>
            <select value={selectedEnrollModule} onChange={handleEnrollModuleChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="">Select Training Module</option>
              {dropdownEnrollModule.map((option) => (
                <option key={option.module_id} value={option.module_id}>{option.module_name}</option>
              ))}
            </select>
            <button onClick={enrollEmployeeInTraining} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', cursor: 'pointer', border: 'none' }}>
              Enroll Employee
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <h2>Unenroll Employees from Training</h2>
            <select value={selectedUnenrollEmployee} onChange={handleUnenrollEmployeeChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.user_id} value={employee.user_id}>{employee.first_name} {employee.last_name}</option>
              ))}
            </select>
            <select value={selectedUnenrollModule} onChange={handleUnenrollModuleChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
            <option value="">Select Training Module</option>
              {dropdownUnenrollModule.map((option) => (
                  <option key={option.module_id} value={option.module_id}>{option.module_name}</option>
              ))}
            </select>
            <button onClick={unenrollEmployeeFromTraining} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', borderRadius: '5px', cursor: 'pointer', border: 'none' }}>
              Unenroll Employee
            </button>
          </div>
        </div>

        </>
    </div>

    
  );
}

export default TrainingModulesPage;