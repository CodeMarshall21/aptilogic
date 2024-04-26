
import React, { useState } from 'react';

const AddQuestionForm = () => {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const handleAddQuestion = () => {
    setShowForm(true);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleOptionChange = (index, e) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (e) => {
    setCorrectAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    // For simplicity, we'll just log the values
    console.log('Question:', question);
    console.log('Options:', options);
    console.log('Correct Answer:', correctAnswer);
    // Reset form values
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    // Hide form
    setShowForm(false);
  };

  return (
    <div>
      <button onClick={handleAddQuestion}>Add Question</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <label>
            Question:
            <input type="text" value={question} onChange={handleQuestionChange} required />
          </label>
          <br />
          {options.map((option, index) => (
            <div key={index}>
              <label>
                Option {index + 1}:
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e)}
                  required
                />
              </label>
              <br />
            </div>
          ))}
          <label>
            Correct Answer:
            <input type="text" value={correctAnswer} onChange={handleCorrectAnswerChange} required />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default AddQuestionForm;
