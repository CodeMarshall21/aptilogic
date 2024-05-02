// StudentAnalytics.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '../UserContext';

const Analytics = () => {
    const { assessmentId } = useParams();
    const { user } = useUser();
    const [assessmentScores, setAssessmentScores] = useState([]);
    const [improvementTips, setImprovementTips] = useState({});

    useEffect(() => {
        const fetchAssessmentScores = async () => {
            if (!user) {
                return;
            }

            let q = query(collection(db, 'scores'), where('userId', '==', user.uid)); // Only fetch scores for the current user
            if (assessmentId) {
                q = query(q, where('assessmentId', '==', assessmentId));
            }
            const querySnapshot = await getDocs(q);
            const fetchedScores = querySnapshot.docs.map(doc => doc.data());
            setAssessmentScores(fetchedScores);

            // Analyze scores and provide improvement tips
            const tips = analyzeScores(fetchedScores);
            setImprovementTips(tips);
        };

        fetchAssessmentScores();
    }, [user, assessmentId]);

    const analyzeScores = (scores) => {
        const tips = {};
        scores.forEach(score => {
            if (score.topicScores) {
                Object.entries(score.topicScores).forEach(([topic, scores]) => {
                    if (!tips[topic]) {
                        tips[topic] = {
                            strong: [],
                            weak: []
                        };
                    }
                    if (scores.correctAnswers / scores.totalQuestions >= 0.8) {
                        tips[topic].strong.push(score.username);
                    } else {
                        tips[topic].weak.push(score.username);
                    }
                });
            }
        });
        return tips;
    };

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
                            <p>
                                {improvementTips[topic]?.strong.length > 0 &&
                                    `You are strong in this topic. Focus on other areas.`}
                                {improvementTips[topic]?.weak.length > 0 &&
                                    `You need improvement in this topic. Practice more.`}
                            </p>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Analytics;
