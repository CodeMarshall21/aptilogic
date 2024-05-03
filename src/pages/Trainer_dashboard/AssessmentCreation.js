import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Assuming db is the initialized Firestore instance
import './AssessmentCreation.css';

const TrainerAssessment = () => {
    const [questions, setQuestions] = useState([]);
    const [assessmentDetails, setAssessmentDetails] = useState({
        title: '',
        description: ''
    });

    const addQuestion = () => {
        const newQuestion = {
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            topic: ''
        };
        setQuestions([...questions, newQuestion]);
    };

    const saveAssessment = async () => {
        try {
            const assessmentRef = await addDoc(collection(db, 'assessments'), {
                title: assessmentDetails.title,
                description: assessmentDetails.description
            });

            questions.forEach(async (question) => {
                await addDoc(collection(assessmentRef, 'questions'), {
                    questionText: question.questionText,
                    options: question.options,
                    correctAnswer: question.correctAnswer,
                    topic: question.topic
                });
            });

            alert('Assessment created successfully');
        } catch (error) {
            console.error('Error creating assessment: ', error);
        }
    };

    return (
        <div className="trainer-assessment">
            <h2 className="trainer-assessment-title assessment-head">Trainer Assessment</h2>
            <input
                className="trainer-assessment-textfield"
                type="text"
                placeholder="Title"
                value={assessmentDetails.title}
                onChange={(e) => setAssessmentDetails({ ...assessmentDetails, title: e.target.value })}
            />
            <textarea
                className="trainer-assessment-textfield"
                placeholder="Description"
            rows={9}
                value={assessmentDetails.description}
                onChange={(e) => setAssessmentDetails({ ...assessmentDetails, description: e.target.value })}
            />
            {questions.map((question, index) => (
                <div key={index} className="trainer-question-box">
                    <h3 className="trainer-question-title">Question {index + 1}</h3>
                    <input
                        className="trainer-option-textfield"
                        type="text"
                        placeholder="Question Text"
                        value={question.questionText}
                        onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].questionText = e.target.value;
                            setQuestions(newQuestions);
                        }}
                    />
                    {question.options.map((option, optionIndex) => (
                        <input
                            key={optionIndex}
                            className="trainer-option-textfield"
                            type="text"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[index].options[optionIndex] = e.target.value;
                                setQuestions(newQuestions);
                            }}
                        />
                    ))}
                    <input
                        className="trainer-option-textfield"
                        type="text"
                        placeholder="Correct Answer"
                        value={question.correctAnswer}
                        onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].correctAnswer = e.target.value;
                            setQuestions(newQuestions);
                        }}
                    />
                    <input
                        className="trainer-option-textfield"
                        type="text"
                        placeholder="Topic"
                        value={question.topic}
                        onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].topic = e.target.value;
                            setQuestions(newQuestions);
                        }}
                    />
                </div>
            ))}
            <button className="trainer-add-question-btn" onClick={addQuestion}>
                Add Question
            </button>
            <button className="trainer-save-assessment-btn" onClick={saveAssessment}>
                Save Assessment
            </button>
        </div>
    );
};

export default TrainerAssessment;
