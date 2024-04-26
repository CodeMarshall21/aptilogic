import React, { useState } from 'react';

const Question = ({ question, options, correctAnswer, onAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    onAnswer(option === correctAnswer);
  };

  return (
    <div>
      <h3>{question}</h3>
      <ul>
        {options.map((option, index) => (
          <li key={index} onClick={() => handleAnswer(option)} style={{ cursor: 'pointer' }}>
            {option}
          </li>
        ))}
      </ul>
      <p>Selected Answer: {selectedAnswer}</p>
    </div>
  );
};

export default Question;
