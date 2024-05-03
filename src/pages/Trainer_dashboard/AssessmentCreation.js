import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Assuming db is the initialized Firestore instance
import { Button, TextField, Typography, Box } from '@mui/material';

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
        <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" gutterBottom>
                Trainer Assessment
            </Typography>
            <TextField
                label="Title"
                variant="outlined"
                margin="normal"
                fullWidth
                value={assessmentDetails.title}
                onChange={(e) => setAssessmentDetails({ ...assessmentDetails, title: e.target.value })}
            />
            <TextField
                label="Description"
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                fullWidth
              
                value={assessmentDetails.description}
                onChange={(e) => setAssessmentDetails({ ...assessmentDetails, description: e.target.value })}
            />
            {questions.map((question, index) => (
                <Box key={index} border={1} borderRadius={5} padding={2} marginY={2}>
                    <Typography variant="h6" gutterBottom>
                        Question {index + 1}
                    </Typography>
                    <TextField
                        label="Question Text"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={question.questionText}
                        onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].questionText = e.target.value;
                            setQuestions(newQuestions);
                        }}
                    />
                    {question.options.map((option, optionIndex) => (
                        <TextField
                            key={optionIndex}
                            label={`Option ${optionIndex + 1}`}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            value={option}
                            onChange={(e) => {
                                const newQuestions = [...questions];
                                newQuestions[index].options[optionIndex] = e.target.value;
                                setQuestions(newQuestions);
                            }}
                        />
                    ))}
                    <TextField
                        label="Correct Answer"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={question.correctAnswer}
                        onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].correctAnswer = e.target.value;
                            setQuestions(newQuestions);
                        }}
                    />
                    <TextField
                        label="Topic"
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        value={question.topic}
                        onChange={(e) => {
                            const newQuestions = [...questions];
                            newQuestions[index].topic = e.target.value;
                            setQuestions(newQuestions);
                        }}
                    />
                </Box>
            ))}
            <Button variant="contained" onClick={addQuestion} style={{ marginBottom: 20 }}>
                Add Question
            </Button>
            <Button variant="contained" color="primary" onClick={saveAssessment}>
                Save Assessment
            </Button>
        </Box>
    );
};

export default TrainerAssessment;
