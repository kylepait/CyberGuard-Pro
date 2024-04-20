import React, { useState, useEffect } from 'react';
import MyChartComponent from './trainingModulesBarChart';
import TrainingOverviewPieChart from './TrainingOverviewPieChart'; // Adjust the path as necessary



function ManagerMetricsDashboard() {




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

  const [securitySuggestion, setSecuritySuggestion] = useState('');

  const [goalDueDate, setGoalDueDate] = useState('');
  const [goalIncentive, setGoalIncentive] = useState('');
  const [topBadgeEarners, setTopBadgeEarners] = useState([]);

  const [averageTime, setAverageTime] = useState(null);
  const [securityScore, setSecurityScore] = useState(null);


  const refreshAllData = async () => {
    await fetchTrainingAssignments();
    await fetchEmployeeBadges();
    await fetchAllTrainings();
    await fetchTrainingAssignments();
    await fetchBadges();
    await fetchTrainingModules();
  

    await fetchEnrollEmployees();
    await fetchUnenrollEmployees(); // Ensuring this calls the correct function to refresh employee badges
    // Include any other fetch calls needed to refresh your UI accordingly
    await fetchAverageTime();
    await fetchSecurityScore();
  };

  const [chartData, setChartData] = useState({
    labels: [], // Employee names
    assignedCount: [], // Number of assigned trainings per employee
    completedCount: [], // Number of completed trainings per employee
  });




  
  

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
  
        // Initialize a map to count occurrences of each badge and keep track of an image path
        let badgeCounts = new Map();
  
        // Iterate over each employee and their badges
        data.forEach(employee => {
          employee.badges.forEach(badge => {
            // If the badge is already in the map, increment its count, otherwise, set its count to 1 and save its image path
            let badgeInfo = badgeCounts.get(badge.badge_id) || { count: 0, name: badge.badge_name, imagePath: badge.image_path };
            badgeCounts.set(badge.badge_id, { ...badgeInfo, count: badgeInfo.count + 1 });
          });
        });
  
        // Find the rarest badge by looking for the minimum count
        let rarestBadge = Array.from(badgeCounts.values()).reduce((acc, val) => val.count < acc.count ? val : acc, { count: Infinity, name: '', imagePath: '' });
  
        setRarestBadge({ badge_name: rarestBadge.name, count: rarestBadge.count, image_path: rarestBadge.imagePath });
      } else {
        console.error('Failed to fetch employee badges');
      }
    } catch (error) {
      console.error('Error fetching employee badges:', error);
    }
  };
  
  const fetchAverageTime = async () => {
    try {
        const response = await fetch(`http://localhost:4000/average-time/${user.organization_id}`);
        const data = await response.json();
        setAverageTime(data.average_duration);
    } catch (error) {
        console.error('Error fetching average time:', error);
    }
  }; 

  const fetchSecurityScore = async () => {
    try {
      const response = await fetch(`http://localhost:4000/security-score/${user.organization_id}`);
      const data = await response.json();
      setSecurityScore(data.security_score);
    } catch (error) {
      console.error('Error fetching security score:', error);
    }
  };

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      
      await refreshAllData();
    };
  
    fetchDataIfNeeded();
    fetchAverageTime();
    fetchSecurityScore();
    // This effect should only run when the page loads or when certain user properties change that necessitate a re-fetch.
  }, [user.user_id, user.user_role, user.organization_id]);



  useEffect(() => {
    const tempChartData = {
      labels: [],
      assignedCount: [],
      completedCount: [],
    };
  
    const assignmentsByEmployee = {}; // Structure to hold the count
    trainingAssignments.forEach(assignment => {
      if (!assignmentsByEmployee[assignment.user_id]) {
        assignmentsByEmployee[assignment.user_id] = { assigned: 0, completed: 0 };
        tempChartData.labels.push(`${assignment.first_name} ${assignment.last_name}`);
      }
      if (assignment.status === 'completed') {
        assignmentsByEmployee[assignment.user_id].completed++;
      } else {
        assignmentsByEmployee[assignment.user_id].assigned++;
      }
    });
  
    // Convert aggregated data into arrays for the chart
    Object.values(assignmentsByEmployee).forEach(value => {
      tempChartData.assignedCount.push(value.assigned);
      tempChartData.completedCount.push(value.completed);
    });
  
    setChartData(tempChartData);
    // This effect should only run when trainingAssignments change.

    const moduleCompletionCounts = {}; // {moduleId: count}

    trainingAssignments.forEach(assignment => {
      if (assignment.status === 'completed') {
        moduleCompletionCounts[assignment.module_id] = (moduleCompletionCounts[assignment.module_id] || 0) + 1;
      }
    });
  
    const leastCompletedModuleId = Object.keys(moduleCompletionCounts).reduce((acc, moduleId) => {
      return (!acc || moduleCompletionCounts[moduleId] < moduleCompletionCounts[acc]) ? moduleId : acc;
    }, null);
  
    // Assuming you have a way to fetch or determine the security suggestion for a module
    const securitySuggestion = getSecuritySuggestionForModule(leastCompletedModuleId);
  
    setSecuritySuggestion(securitySuggestion);


  }, [trainingAssignments]);

  useEffect(() => {
      // Assume `employees` is already populated with badge counts
      const maxBadgeCount = Math.max(...employees.map(emp => emp.badges.length));
      const earners = employees.filter(emp => emp.badges.length === maxBadgeCount);
      setTopBadgeEarners(earners);
  }, [employees]);


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
    // Assuming `user.organization_id` holds the organization ID of the logged-in manager
    const organizationId = user.organization_id;
  
    // Adjust the API endpoint or add parameters as necessary to fetch data filtered by organization ID
    const response = await fetch(`http://localhost:4000/training-modules?organizationId=${organizationId}`);
    const data = await response.json();
  
    console.log("Fetched training modules data for organization:", organizationId, data); // Debug fetched data
  
    // Assuming the API returns data in a structure where you can segregate assigned and completed modules
    const assignedModules = data.filter(module => module.status === 'assigned');
    const completedModules = data.filter(module => module.status === 'completed');
  
    setAssignedModules(assignedModules);
    setCompletedModules(completedModules);
  };
  

  const fetchEnrollEmployees = async () => {
    const response = await fetch(`http://localhost:4000/employees/organization/${user.organization_id}`);
    const data = await response.json();

    setDropdownEnrollEmployee(data);
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

  const handleEnrollModuleChange = async (event) => {
    const selectedValue = event.target.value;
    
    setSelectedEnrollModule(selectedValue);
  };
  
  const fetchUnenrollEmployees = async () => {
    const response = await fetch(`http://localhost:4000/employees/organization/${user.organization_id}`);
    const data = await response.json();

    setDropdownUnenrollEmployee(data);
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

  const handleUnenrollModuleChange = async (event) => {
    const selectedValue = event.target.value;
    
    setSelectedUnenrollModule(selectedValue);
  };

  const handleSetGoal = async (event) => {
      event.preventDefault();

      // Assuming you have the organization ID stored in the state or derived from the user's session
      const organizationId = user.organization_id;

      const goalData = {
          organizationId,
          dueDate: goalDueDate,
          incentive: goalIncentive
      };

      try {
          // Replace the URL with your actual endpoint
          const response = await fetch('http://localhost:4000/api/goals', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(goalData),
          });

          const responseData = await response.json();

          if (response.ok) {
              alert('Goal set successfully');
              // Optionally, clear the form fields or update the UI
          } else {
              alert('Failed to set goal');
          }
      } catch (error) {
          console.error('Error setting goal:', error);
          alert('Error setting goal');
      }
  };

  const [isAssignmentsVisible, setIsAssignmentsVisible] = useState(false);
  const [employeeVisibility, setEmployeeVisibility] = useState({});





  function getSecuritySuggestionForModule(moduleId) {
    // Example: Predefined suggestions
    const suggestions = {
      '1': 'Ensure all employees complete the phishing awareness training to significantly reduce the risk of successful email attacks.',
      '2': 'Password security training is crucial for protecting against unauthorized access. Consider scheduling a session soon.',
      '3': 'Intro Training to CyberGuardPro is greatly help with security understanding',
      '4': 'General Cybersecurity could be lacking',
      '5': 'Phishing attempts need to be educated against',
      '6': 'It is beneficial for employees to be able to detect suspicious behavior',
      '7': 'Strong passwords for important website is crucial'





      // Add more module IDs and suggestions as needed
    };
  
    return suggestions[moduleId] || 'No specific suggestion available. Ensure all security trainings are completed.';
  }




    const [trainingData, setTrainingData] = useState({
      labels: [], // Employee names
      assignedCount: [], // Total Assigned Trainings across all employees
      completedCount: [], // Total Completed Trainings across all employees
    });
  
    useEffect(() => {
      // Your existing logic to fetch or define trainingAssignments
      // Assume trainingAssignments is an array of assignments with user_id, status, etc.
      const tempChartData = {
        labels: [],
        assignedCount: 0,
        completedCount: 0,
      };
  
      // Example logic to accumulate total completed and assigned trainings
      trainingAssignments.forEach(assignment => {
        if (assignment.status === 'completed') {
          tempChartData.completedCount++;
        } else {
          tempChartData.assignedCount++;
        }
      });
  
      setTrainingData(tempChartData);
      // Add any dependencies to this useEffect if necessary
    }, [trainingAssignments]); // Include dependencies if your trainingAssignments data might change

  
    const formatDuration = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };
    
    const getBackgroundColor = (score) => {
      if (score > 75) {
        return '#7fd47f'; // Green
      } else if (score >= 50) {
        return '#ffe066'; // Yellow
      } else {
        return '#ff9999'; // Red
      }
    };
    
  return (
    <div style={{ padding: '20px' }}>

        <h2 style={{ borderBottom: '25px solid #17a2b8', paddingBottom: '10px' }}>Metrics Dashboard</h2>

        <div style={{ display: 'flex', marginTop: '20px' }}>
          <div style={{ flex: '1', padding: '15px', backgroundColor: getBackgroundColor(securityScore), marginRight: '10px', borderRadius: '5px' }}>
            <h3>Security Score:</h3>
            <span style={{ fontSize: '24px' }}>{securityScore}%</span> 
         </div>

          <div style={{ flex: '3', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
            <h3>Security Suggestion Based on Training Completion:</h3>
            <p>{securitySuggestion}</p>
          </div>
        </div>

  
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h3>Average Time Spent on Training Modules:</h3>
          <span style={{ fontSize: '20px' }}>{formatDuration(averageTime)}</span>
        </div>


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

            
        <MyChartComponent chartData={chartData} />

        <div style={{justifyContent: 'center', alignItems: 'center'}}>
          <h3>Organization Training Overview (Completed v Assigned)</h3>
          <TrainingOverviewPieChart
            trainingData={[
              {
                completedCount: trainingData.completedCount,
                assignedCount: trainingData.assignedCount,
              },
            ]}
          />
        </div>

  
      
        <>
        <div style={{ marginTop: '40px', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ cursor: 'pointer' }}>
              Training Assignments for My Employees
          </h2>
          {trainingAssignments.reduce((acc, assignment) => {
            // Create an array of unique employee IDs
            if (!acc.includes(assignment.user_id)) acc.push(assignment.user_id);
            return acc;
          }, []).map((userId) => {
            // Filter assignments for this employee
            const employeeAssignments = trainingAssignments.filter(assignment => assignment.user_id === userId);
            return (
              <div key={userId}>
                <h3 onClick={() => setEmployeeVisibility(prev => ({ ...prev, [userId]: !prev[userId] }))} style={{ cursor: 'pointer', textAlign: 'left' }}>
                  {employeeAssignments[0].first_name} {employeeAssignments[0].last_name} {/* Assuming first_name and last_name are available */}
                </h3>
                {employeeVisibility[userId] && (
                <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                  {employeeAssignments.map((assignment) => (
                    <li key={`${assignment.module_name}`} style={{ 
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: '#ffffff',
                        borderRadius: '5px', 
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <span style={{ fontWeight: 'bold' }}>{assignment.module_name}</span>
                      {assignment.module_format === 'slidesQ' && (
                        <>
                        <span style={{ fontWeight: 'bold', marginLeft: 'auto' }}>{assignment.score}/5</span>
                        </>
                      )}
                      <span style={{ 
                            padding: '5px 10px', 
                            borderRadius: '5px', 
                            color: '#ffffff', 
                            backgroundColor: assignment.status === 'completed' ? '#28a745' : '#dc3545',
                            marginLeft: 'auto',
                            alignSelf: 'center',
                      }}>
                        {assignment.status}
                      </span>
                      </div>
                        {assignment.status === 'completed' && (
                          <span style={{ marginTop: '5px', marginLeft: 'auto' }}>
                          {formatDuration(assignment.duration)}
                          </span>
                        )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
         })}
        </div>






      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h3 style={{ marginBottom: '10px', color: '#007bff' }}>Rarest Badge</h3>
          {rarestBadge.count > 0 ? (
            <p style={{ margin: 0 }}>
              The rarest badge is "<strong>{rarestBadge.badge_name}</strong>" with <strong>{rarestBadge.count}</strong> occurrences.
            </p>
          ) : (
            <p style={{ margin: 0 }}>Badge information is currently unavailable.</p>
          )}
        </div>
        {rarestBadge.count > 0 && rarestBadge.image_path ? (
          <img src={rarestBadge.image_path.startsWith('/') ? process.env.PUBLIC_URL + rarestBadge.image_path : rarestBadge.image_path} alt={rarestBadge.badge_name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        ) : (
          <div style={{ width: '50px', height: '50px', background: '#ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Placeholder if no image path is available */}
            <span style={{ textAlign: 'center', color: '#666' }}>?</span>
          </div>
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



          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '20px' }}>
            {/* Set a Goal for Your Employees */}
            <div style={{
              flex: 1,
              padding: '20px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Set a Goal for Your Employees</h3>
              <form onSubmit={handleSetGoal}>
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="goalDueDate" style={{ marginRight: '10px' }}>Goal Due Date:</label>
                  <input 
                    type="date" 
                    id="goalDueDate" 
                    value={goalDueDate} 
                    onChange={e => setGoalDueDate(e.target.value)} 
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label htmlFor="goalIncentive" style={{ marginRight: '10px' }}>Incentive:</label>
                  <textarea
                    id="goalIncentive"
                    value={goalIncentive}
                    onChange={e => setGoalIncentive(e.target.value)}
                    placeholder="Enter incentive"
                    style={{ width: '100%', height: '100px', resize: 'vertical', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                  />
                  <div style={{ fontSize: '12px', marginTop: '5px' }}>Maximum of 255 characters.</div>
                </div>
                <button type="submit" style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s'
                }}>
                  Set Goal
                </button>
              </form>
            </div>

            {/* Current Incentive Winner(s) */}
            <div style={{
              flex: 1,
              padding: '20px',
              backgroundColor: '#f0f0f0',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px' }}>Current Incentive Winner(s)</h3>
              <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                {topBadgeEarners.map(earner => (
                  <li key={earner.user_id} style={{ marginBottom: '10px' }}>
                    <strong>{earner.first_name} {earner.last_name}</strong> - {earner.badges.length} Badges
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        </>
    </div>

    
  );
}

export default ManagerMetricsDashboard;