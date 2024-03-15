import React, { useState } from 'react';

function QuizPopup({ onClose, onSubmit }) {
  const [score, setScore] = useState(0); // Assuming score is a simple number for this example

  // Handle score change (e.g., based on user input or quiz answers)
  const handleScoreChange = (e) => {
    const newScore = parseInt(e.target.value, 10); // Convert input value to number
    setScore(newScore);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    onSubmit(score); // Call the onSubmit prop function with the current score
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Quiz</h2>
        <form onSubmit={handleSubmit}>
          {/* Simple input for score, you can replace this with your actual quiz questions and logic */}
          <input type="number" value={score} onChange={handleScoreChange} style={{ marginBottom: '10px' }} />
          <button type="submit" style={{ marginRight: '10px' }}>Submit</button>
          <button type="button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
}

export default QuizPopup;
