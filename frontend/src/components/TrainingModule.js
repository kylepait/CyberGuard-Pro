import React, { useState, useEffect } from 'react';

function TrainingModulesPage() {
  const [assignedModules, setAssignedModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);

  const [trainingAssignments, setTrainingAssignments] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));



  useEffect(() => {
  
    if (user.user_role === 'management') {
      fetchTrainingAssignments();
    }
    fetchTrainingModules();
  }, [user.user_id, user.user_role, user.organization_id]); // Fetch training modules when the component mounts or user_id changes

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

  const completeTraining = async (moduleId) => {
    try {
      const response = await fetch('http://localhost:4000/complete-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user_id, moduleId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Training completed successfully!');
        fetchTrainingModules(); // Refresh the modules to reflect the completion
      } else {
        alert('Failed to complete training.');
      }
    } catch (error) {
      console.error('Error completing training:', error);
      alert('Error completing training');
    }
  };



  return (
    <div style={{ padding: '20px' }}>
      <h2>Assigned Training Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(800px, 1fr))', gap: '20px' }}>
        {assignedModules.map(module => (
          <div key={module.module_id} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px', height: '550px' }}>
            <h3>{module.module_name}</h3>
            <iframe src={module.module_link} width="100%" height="400" title={module.module_name} style={{ border: 'none', marginBottom: '10px' }}></iframe>
            <button
              onClick={() => completeTraining(module.module_id)}
              style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', border: 'none', width: '100%' }}>
              I attest to completing this training
            </button>
          </div>
        ))}
      </div>
  
      <h2 style={{ marginTop: '40px' }}>Completed Training Modules</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {completedModules.map(module => (
          <div key={module.module_id} style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px' }}>
            <h3>{module.module_name}</h3>
            <iframe src={module.module_link} width="100%" height="315" title={module.module_name} style={{ border: 'none' }}></iframe>
          </div>
        ))}
      </div>
  
      {user.user_role === 'management' && (
        <div style={{ marginTop: '40px', backgroundColor: '#f2f2f2', padding: '20px', borderRadius: '10px' }}>
          <h2>Training Assignments for My Employees</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
            {trainingAssignments.map((assignment) => (
              <li key={`${assignment.user_id}-${assignment.module_name}`} style={{ padding: '10px 0' }}>
                {`${assignment.first_name} ${assignment.last_name}`} - {assignment.module_name} ({assignment.status})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TrainingModulesPage;