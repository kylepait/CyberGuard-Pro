import React, { useState, useEffect } from 'react';

function TrainingModule() {
    const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user object from local storage

    const [trainingProgress, setTrainingProgress] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainingProgress = async () => {
          try {
            const response = await fetch(`http://localhost:4000/TrainingModule?user_id=${user.user_id}`);
            const data = await response.json();
            setTrainingProgress(data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching badges:', error);
            setLoading(false);
          }
        };
    
        fetchTrainingProgress();
      }, [user.id]);
    
      if (loading) {
        return <p>Loading Training Modules...</p>;
      }

    return (
        <div>
            <h2>Training Module</h2>
            <ul>
            {trainingProgress.length > 0 ? (
                <ul>
                    {trainingProgress.map((progress) => (
                        <li key={progress.training_id}>
                            {progress.lesson_id}
                            {progress.progress_percent}
                            {progress.status}
                            {progress.completed_at}
                        </li>
                    ))}
                </ul>
                ) : (
                    <p>No Progress Found.</p>
                )}
            </ul>

        </div>
    );
}

export default TrainingModule;