import React, { useState, useEffect } from 'react';

function DevHub() {
  const [assignedModules, setAssignedModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);

  const [allTrainings, setAllTrainings] = useState([]);

  const [trainingAssignments, setTrainingAssignments] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));


  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedModule, setSelectedModule] = useState('');

  const [employees, setEmployees] = useState([]);

  

  const [badges, setBadges] = useState([]);
  
  const [loading, setLoading] = useState(true);
  

  const enrollEmployeeInTraining = async () => {
      const response = await fetch('http://localhost:4000/enroll-employee-training', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employeeUserId: selectedEmployee, moduleId: selectedModule })
      });
      const data = await response.json();
      if (data.success) {
          alert('Employee enrolled successfully!');
          // Optionally: Refresh the list of enrolled trainings
          fetchTrainingAssignments(); // Call this function to refresh assignments

      } else {
          alert('Failed to enroll employee.');
      }
  };










  useEffect(() => {

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
    
      
      
        fetchEmployeeBadges();





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





  return (
    <div style={{ padding: '20px' }}>

        <h2 style={{ borderBottom: '25px solid #17a2b8', paddingBottom: '10px' }}>Developer Hub</h2>
  



            

  
      

    </div>

    
  );
}

export default DevHub;