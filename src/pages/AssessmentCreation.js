import React, { useState } from 'react';

const AssessmentCreation = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    const newQuestion = { question: '', options: ['', '', '', ''], correctAnswer: '' };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionChange = (index, e) => {
    const newQuestions = [...questions];
    newQuestions[index].question = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, e) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = e.target.value;
    setQuestions(newQuestions);
  };

  const saveAssessment = () => {
    // Implement saving assessment logic here
    console.log('Assessment Title:', title);
    console.log('Assessment Description:', description);
    console.log('Assessment Questions:', questions);
  };

  return (
    <div>
      <h2>Create Assessment</h2>
      <label>Title:</label>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <label>Description:</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      <button onClick={addQuestion}>Add Question</button>
      {questions.map((question, index) => (
        <div key={index}>
          <label>Question {index + 1}:</label>
          <input type="text" value={question.question} onChange={(e) => handleQuestionChange(index, e)} required />
          <br />
          {question.options.map((option, optionIndex) => (
            <div key={optionIndex}>
              <label>Option {optionIndex + 1}:</label>
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, optionIndex, e)}
                required
              />
            </div>
          ))}
          <label>Correct Answer:</label>
          <input
            type="text"
            value={question.correctAnswer}
            onChange={(e) => handleCorrectAnswerChange(index, e)}
            required
          />
          <br />
        </div>
      ))}
      <button onClick={saveAssessment}>Save Assessment</button>
    </div>
  );
};

export default AssessmentCreation;
