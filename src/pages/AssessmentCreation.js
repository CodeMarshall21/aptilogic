import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming db is the initialized Firestore instance

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

            console.log('Assessment created successfully');
        } catch (error) {
            console.error('Error creating assessment: ', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Title"
                value={assessmentDetails.title}
                onChange={(e) => setAssessmentDetails({ ...assessmentDetails, title: e.target.value })}
            />
            <textarea
                placeholder="Description"
                value={assessmentDetails.description}
                onChange={(e) => setAssessmentDetails({ ...assessmentDetails, description: e.target.value })}
            />
            {questions.map((question, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Question"
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
            <button onClick={addQuestion}>Add Question</button>
            <button onClick={saveAssessment}>Save Assessment</button>
        </div>
    );
};

export default TrainerAssessment;
