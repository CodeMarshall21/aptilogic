import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../firebase';

const Assessment = () => {
    const { assessmentId } = useParams();
    const [assessment, setAssessment] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchAssessment = async () => {
            const assessmentRef = doc(db, 'assessments', assessmentId);
            const assessmentSnapshot = await getDoc(assessmentRef);
            if (assessmentSnapshot.exists()) {
                const assessmentData = assessmentSnapshot.data();
                const questionsRef = collection(assessmentRef, 'questions');
                const questionsSnapshot = await getDocs(questionsRef);
                const questionsData = questionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setAssessment({ id: assessmentSnapshot.id, ...assessmentData, questions: questionsData });
                initializeSelectedAnswers(questionsData);
            } else {
                console.error('Assessment not found');
            }
        };

        fetchAssessment();
    }, [assessmentId]);

    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers(prevState => ({
            ...prevState,
            [questionId]: selectedOption
        }));
    };

    const initializeSelectedAnswers = (questions) => {
        const answers = {};
        questions.forEach((question) => {
            answers[question.id] = null;
        });
        setSelectedAnswers(answers);
    };

    const calculateScore = () => {
        let totalScore = 0;
        assessment.questions.forEach((question) => {
            if (question.correctAnswer === selectedAnswers[question.id]) {
                totalScore += 1; // Award 1 point for each correct answer
            }
        });
        setScore(totalScore);
    };

    const handleSubmit = async () => {
        // Save the score to the database
        let totalScore = 0;
        assessment.questions.forEach((question) => {
            if (question.correctAnswer === selectedAnswers[question.id]) {
                totalScore += 1; // Award 1 point for each correct answer
            }
        });
        setScore(totalScore);
        const userRef = doc(db, 'users', auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userRef);
    if (!userDocSnapshot.exists()) {
        console.error('User not found with ID:', auth.currentUser.uid);
        return;
    }
    const userData = userDocSnapshot.data();
    const username = userData.username;
        const scoreData = {
            username: username,
            userId: auth.currentUser.uid,
            assessmentId: assessment.id,
            score: score,

        };
        await addDoc(collection(db, 'scores'), scoreData);

        // Update user's scores array in Firestore
        // const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, { scores: arrayUnion(scoreData) });

        setIsSubmitted(true);
    };

    if (!assessment) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{assessment.title}</h1>
            <p>{assessment.description}</p>
            <h2>Questions</h2>
            {assessment.questions && assessment.questions.length > 0 ? (
                <div>
                    {assessment.questions.map((question, index) => (
                        <div key={index}>
                            <p>{question.questionText}</p>
                            <ul>
                                {question.options.map((option, optionIndex) => (
                                    <li key={optionIndex}>
                                        <label>
                                            <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={option}
                                                onChange={() => handleAnswerSelect(question.id, option)}
                                                checked={selectedAnswers[question.id] === option}
                                            />
                                            {option}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    {/* <button onClick={calculateScore}>Calculate Score</button> */}
                    {score > 0 && <p>Score: {score}</p>}
                    <button onClick={handleSubmit}>Submit</button>
                    {isSubmitted && <p>Score submitted successfully!</p>}
                </div>
            ) : (
                <div>No questions found for this assessment.</div>
            )}
        </div>
    );
};

export default Assessment;
