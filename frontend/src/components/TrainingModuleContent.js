import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const TrainingModuleContent = () => {
  const { moduleId, userId } = useParams();
  console.log("UserID:", userId);

  const [moduleContent, setModuleContent] = useState(null);


  useEffect(() => {
    fetchModuleContent();    
  }, [moduleId, userId]);

  const fetchModuleContent = async () => {
    try {
      const response = await fetch(`http://localhost:4000/module-content/${moduleId}`);
      const data = await response.json();
      if (response.ok) {
        console.log("Module ID: ", moduleId);
        setModuleContent(data);
        console.log(data);
      } else {
        console.error('Failed to fetch module content:', data.error);
      }
    } catch (error) {
      console.error('Error fetching module content:', error);
    }
  };

  const completeTraining = async () => {
    console.log('userId:', userId); // Log userId here
    try {
      const response = await fetch(`http://localhost:4000/complete-training`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, moduleId }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Training completed successfully!');
      } else {
        alert('Failed to complete training.');
      }
    } catch (error) {
      console.error('Error completing training:', error);
      alert('Error completing training');
    }
  };

  const beginQuiz = async (moduleId) => {
    var pass = document.getElementById("password");
    if (pass.value.length > 3) {
      completeTraining(moduleId);
    }
    else{
      alert('password is too weak');
    }
  };
  
  const gradePassword = async (moduleId) => {
    var pass = document.getElementById("password");
    if (pass.value.length > 3) {
      completeTraining(moduleId);
    }
    else {
      alert('password is too weak');
    }
  };

  // Render null if moduleContent is still null
  if (!moduleContent) {
    return null;
  }

  return (
    <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#f0f8ff' }}>
        <h3>{moduleContent.module_name}</h3>
        <iframe src={moduleContent.module_link} width="100%" height="400" title={moduleContent.module_type} style={{ border: 'none', marginBottom: '10px' }}></iframe>
        {moduleContent.module_format === 'slides' && (
        <>
          <Link key={moduleContent.module_id} to={`/TrainingModule`}>
            <button
                onClick={() => completeTraining(moduleContent.module_id)}
                style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', border: 'none', width: '100%' }}>
                I attest to completing this training
            </button>
          </Link>
        </>
        )}
        {moduleContent.module_format === 'slidesQ' && (
        <>
          <Link to='/ModuleQuiz'
            onClick={() => localStorage.setItem('openQuiz', moduleContent.module_id)}
            style={{ margin: '10px 10px 10px 0', display: 'inline-block', textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
            Begin Quiz
          </Link>
        </>
        )}
        {moduleContent.module_format === 'password' && (
        <>
          <input
            type="password" id="password" placeholder="Password">
          </input>
          <Link key={moduleContent.module_id} to={`/TrainingModule`}>
            <button
                onClick={() => gradePassword(moduleContent.module_id)}
                style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', border: 'none', width: '100%' }}>
                This will be my password for the shown website
            </button>
          </Link>
        </>
        )}
    </div>
);
};

export default TrainingModuleContent;
