// StudentAnalytics.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from './UserContext';

const Analytics = () => {
    const { assessmentId } = useParams();
    const { user } = useUser();
    console.log(assessmentId, user)
    const [assessmentScores, setAssessmentScores] = useState([]);

    useEffect(() => {
        const fetchAssessmentScores = async () => {
            if (!user) {
                return;
            }

            const q = query(collection(db, 'scores'), where('userId', '==', user.uid), where('assessmentId', '==', assessmentId));
            const querySnapshot = await getDocs(q);
            const fetchedScores = querySnapshot.docs.map(doc => doc.data());
            setAssessmentScores(fetchedScores);
        };

        fetchAssessmentScores();
    }, [user, assessmentId]);

    return (
        <div>
            <h1>Assessment Analytics</h1>
            <h2>{assessmentScores.length > 0 ? `Analytics for Assessment ${assessmentId}` : 'No Scores Available'}</h2>
            {assessmentScores.map((score, index) => (
                <div key={index}>
                    <h3>Attempt {index + 1}</h3>
                    <p>Score: {score.score}</p>
                    <h4>Topic-wise Scores:</h4>
                    {score.topicScores && Object.entries(score.topicScores).map(([topic, scores]) => (
                        <div key={topic}>
                            <p>Topic: {topic}</p>
                            <p>Correct Answers: {scores.correctAnswers}</p>
                            <p>Wrong Answers: {scores.wrongAnswers}</p>
                            <p>Total Questions: {scores.totalQuestions}</p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Analytics;
