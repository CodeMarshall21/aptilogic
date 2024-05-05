import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import "./Assessment.css"

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

    const handleSubmit = async () => {
        let totalScore = 0;
        const topicScores = {};
    
        assessment.questions.forEach((question) => {
            const { id, topic, correctAnswer } = question;
            const studentAnswer = selectedAnswers[id];
            const isCorrect = studentAnswer === correctAnswer;
    
            if (!topicScores[topic]) {
                topicScores[topic] = {
                    totalQuestions: 1,
                    correctAnswers: isCorrect ? 1 : 0,
                    wrongAnswers: isCorrect ? 0 : 1,
                };
            } else {
                topicScores[topic].totalQuestions++;
                if (isCorrect) {
                    topicScores[topic].correctAnswers++;
                } else {
                    topicScores[topic].wrongAnswers++;
                }
            }
    
            if (isCorrect) {
                totalScore++;
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
            score: totalScore, // Use totalScore here
            topicScores: topicScores,
        };
    
        await addDoc(collection(db, 'scores'), scoreData);
        await updateDoc(userRef, { scores: arrayUnion(scoreData) });
    
        setIsSubmitted(true);
    };
    

    if (!assessment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="assessment-container">
            <h1 className="assessment-title">{assessment.title}</h1>
            {/* <p>{assessment.description}</p> */}
            <h2>Questions</h2>
            {assessment.questions && assessment.questions.length > 0 ? (
                <div>
                    {assessment.questions.map((question, index) => (
                        <div key={index} className="question-container">
                            <p className="question-text">{question.questionText}</p>
                            <ul className="options-list">
                                {question.options.map((option, optionIndex) => (
                                    <li key={optionIndex} className="option">
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
                    {score > 0 && <p>Score: {score}</p>}
                    <button className="submit-button" onClick={handleSubmit}>Submit</button>
                    {isSubmitted && <p>Score submitted successfully!</p>}
                </div>
            ) : (
                <div>No questions found for this assessment.</div>
            )}
        </div>
    );
}    

export default Assessment;
