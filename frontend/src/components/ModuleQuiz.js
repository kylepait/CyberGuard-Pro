import React, { useState, useEffect } from 'react';
import questions from './questions.json';
import { Link, useNavigate  } from 'react-router-dom';

const ModuleQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const openQuiz = JSON.parse(localStorage.getItem('openQuiz'));

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

  const completeTraining = async (moduleId) => {
    try {
      const response = await fetch('http://localhost:4000/complete-scored-training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.user_id, moduleId, score}),
      });

      const data = await response.json();
      if (data.success) {
        alert('Training completed successfully!');
        //fetchTrainingModules(); // Refresh the modules to reflect the completion
      } else {
        alert('Failed to complete training.');
      }
    } catch (error) {
      console.error('Error completing training:', error);
      alert('Error completing training');
    }
  };
  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score+1);
    }
    setQuestionsAnswered(questionsAnswered+1);

    var nextQuestion = currentQuestionIndex + 1;
    while (nextQuestion < questions.length && questions[nextQuestion].batch != openQuiz)
    {
      nextQuestion++;
    }
    if (nextQuestion < questions.length) {
       
        setCurrentQuestionIndex(nextQuestion);
      
    } else {
      setShowScore(true);
      if (score >3) { 
        completeTraining(openQuiz);
      }
    }
  };
  
  return (
    <div className='app'>
      {showScore ? (
        <div className='score-section'>
          You scored {score-1} out of {questionsAnswered-1}
          <button onClick={() => window.location.reload()}>Play Again</button>
          <Link to='/TrainingModule' style={{ margin: '10px 10px 10px 0', display: 'inline-block', textDecoration: 'none', padding: '10px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px' }}>
          Training Page
          </Link>
        </div>
      ) : (
        <>
          <div className='question-section'>
            <div className='question-count'>

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
