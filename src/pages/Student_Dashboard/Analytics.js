import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where,doc,getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '../UserContext';
import "./Analytics.css"; // Import your CSS file

const StudentAnalytics = () => {
    const { assessmentId } = useParams();
    const { user } = useUser();
    const [assessmentScores, setAssessmentScores] = useState([]);
    const [improvementTips, setImprovementTips] = useState({});
console.log("user:",user.uid)

    
    const fetchAssessmentScores = async () => {
        if (!user || !user.uid) {
            return;
        }
        console.log("inside useeffect")

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            console.error('User document not found');
            return;
        }

        const userData = userDoc.data();
        if (!userData.scores || !Array.isArray(userData.scores)) {
            console.error('User scores not found or not an array');
            return;
        }

        const assessmentScores = userData.scores.filter(score => score.assessmentId === assessmentId);
        setAssessmentScores(assessmentScores);

        // Analyze scores and provide improvement tips
        const tips = analyzeScores(assessmentScores);
        setImprovementTips(tips);

 
       

}

useEffect(()=>{
    console.log("Arjub")
    console.log(user.uid)
    if(user){
    fetchAssessmentScores();
    }
},[])


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
        <div className="analytics-container">
            <h1 className='analytics-title'>Assessment Analytics</h1>
            {/* <h2>{assessmentScores.length > 0 ? `Analytics for Assessment ${assessmentId}` : 'No Scores Available'}</h2> */}
            {assessmentScores.map((score, index) => (
                <div key={index} className="attempt-container">
                    <h3>Attempt {index + 1}</h3>
                    <p>Score: {score.score}</p>
                    <h4>Topic-wise Scores:</h4>
                    {score.topicScores && Object.entries(score.topicScores).map(([topic, scores]) => (
                        <div key={topic} className="topic-container">
                            <p>Topic: {topic}</p>
                            <p>Correct Answers: {scores.correctAnswers}</p>
                            <p>Wrong Answers: {scores.wrongAnswers}</p>
                            <p>Total Questions: {scores.totalQuestions}</p>
                            <p className="tip">
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

export default StudentAnalytics;
