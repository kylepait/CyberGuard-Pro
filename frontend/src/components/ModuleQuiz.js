import React, { useState, useEffect } from 'react';
import questions from './questions.json';
import { Link, useNavigate  } from 'react-router-dom';

const ModuleQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const awardPerfectScoreBadge = async () => {
    const badgeId = '10'; 
    try {
      const response = await fetch('http://localhost:4000/add-badge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user_id, badgeId }),
      });

      const data = await response.json();
      if (!data.success) {
        console.error('Failed to award perfect score badge.');
      }
    } catch (error) {
      console.error('Error awarding perfect score badge:', error);
    }
  };


  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
      if (score + 1 === questions.length) { //Plus one because we haven't updated the state yet
        //awardPerfectScoreBadge();
      }
    }
  };

  return (
    <div className='app'>
      {showScore ? (
        <div className='score-section'>
          You scored {score} out of {questions.length}
          <button onClick={() => window.location.reload()}>Play Again</button>
          <Link to='/TrainingModule' style={{ margin: '10px 10px 10px 0', display: 'inline-block', textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
          Training Page
          </Link>
        </div>
      ) : (
        <>
          <div className='question-section'>
            <div className='question-count'>
              <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
            </div>
            <div className='question-text'>{questions[currentQuestionIndex].question}</div>
          </div>
          <div className='answer-section'>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswerOptionClick(option === questions[currentQuestionIndex].answer)}>
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModuleQuiz;
