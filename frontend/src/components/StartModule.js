import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function StartModule() {
    const { userId, moduleId } = useParams();
    const [moduleContent, setModuleContent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchModuleContent(moduleId);
    }, [moduleId]);

 
    const fetchModuleContent = async (moduleId) => {
        try {
            const response = await fetch(`http://localhost:4000/module/${moduleId}`);
            const data = await response.json();
            setModuleContent(data);
        } catch (error) {
            console.error('Error fetching module content:', error);
        }
    };

    const completeTraining = async (moduleId) => {
        try {
          const response = await fetch('http://localhost:4000/complete-training', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, moduleId }),
          });
    
          const data = await response.json();
          if (data.success) {
            alert('Training completed successfully!');
            navigate('/TrainingModule');
            //fetchTrainingModules(); // Refresh the modules to reflect the completion
          } else {
            alert('Failed to complete training.');
          }
        } catch (error) {
          console.error('Error completing training:', error);
          alert('Error completing training');
        }
      };
    
      const gradePassword = async (moduleId) => {
        var pass = document.getElementById("password");
        if (pass.value.length > 3)
        {
          completeTraining(moduleId);
        }
        else
        {
          alert('password is too weak');
        }
      };

    const endTraining = async (moduleId) => {
        try {
          const response = await fetch(`http://localhost:4000/end-training`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ moduleId }),
          });
    
          const data = await response.json();
          if(data.success) {
            alert('Training module ended successfully!');
            navigate('/TrainingModule');
          } else {
            alert('Failed to end training module.');
          }
        } catch (error) {
          console.error('Error ending training:', error);
          alert('Error ending training');
        }
      };



      return (
        <div style={{ padding: '20px' }}>
          {moduleContent ? (
            <>
              <h2 style={{ fontSize: '20px' }}>{moduleContent.module_name}</h2>
              <iframe src={moduleContent.module_link} width="100%" height="400" title={moduleContent.module_type} style={{ border: 'none', marginBottom: '10px' }}></iframe>
              {moduleContent.module_format === 'slides' && (
                <>
                  <button
                    onClick={() => completeTraining(moduleContent.module_id)}
                    style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', border: 'none', width: '100%' }}>
                    I attest to completing this training
                  </button>
                </>
              )}
              {moduleContent.module_format === 'password' && (
                <>
                  <input
                    type="password" id="password" placeholder="Password" />
                  <button
                    onClick={() => gradePassword(moduleContent.module_id)}
                    style={{ backgroundColor: 'green', color: 'white', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', border: 'none', width: '100%' }}>
                    This will be my password for the shown website
                  </button>
                </>
              )}
            </>
          ) : (
            <p>Loading module details...</p>
          )}
        </div>
      );
}

export default StartModule;