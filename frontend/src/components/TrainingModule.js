import React, { useState, useEffect } from 'react';

function TrainingModulesPage() {
  const [assignedModules, setAssignedModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchTrainingModules();
  }, [user.user_id]); // Fetch training modules when the component mounts or user_id changes

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
    <div>
      <h2>Assigned Training Modules</h2>
      <div>
        {assignedModules.map(module => (
          <div key={module.module_id}>
            <h3>{module.module_name}</h3>
            <iframe src={module.module_link} width="560" height="315" title={module.module_name}></iframe>
            <button
              onClick={() => completeTraining(module.module_id)}
              className="btn"
              style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', border: 'none', marginTop: '10px' }}>
              I attest to completing this training
            </button>
          </div>
        ))}
      </div>

      <h2>Completed Training Modules</h2>
      <div>
        {completedModules.map(module => (
          <div key={module.module_id}>
            <h3>{module.module_name}</h3>
            <iframe src={module.module_link} width="560" height="315" title={module.module_name}></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrainingModulesPage;