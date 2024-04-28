import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const MentorDashboard = () => {
    const [assessments, setAssessments] = useState([]);
    const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
    const [selectedAssessmentScores, setSelectedAssessmentScores] = useState([]);
    const [studentScores, setStudentScores] = useState([]);

    useEffect(() => {
        const fetchAssessments = async () => {
            const assessmentsQuerySnapshot = await getDocs(collection(db, 'assessments'));
            const assessmentsData = assessmentsQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAssessments(assessmentsData);
        };

        fetchAssessments();
    }, []);

    const fetchStudentScores = async () => {
        const usersQuerySnapshot = await getDocs(collection(db, 'users'));
        const scores = [];

        const assessmentsSnapshot = await getDocs(collection(db, 'assessments')); // Fetch assessments

        const assessmentMap = new Map(); // Create a map to store assessment details for quick access
        assessmentsSnapshot.forEach((doc) => {
            assessmentMap.set(doc.id, doc.data()); // Store assessment details in the map using assessmentId as key
        });

        const usersMap = new Map(); // Create a map to store user details for quick access
        usersQuerySnapshot.forEach((doc) => {
            usersMap.set(doc.id, doc.data()); // Store user details in the map using userId as key
        });

        usersQuerySnapshot.forEach((userDoc) => {
            const userData = userDoc.data();
            const userId = userDoc.id;
            if (userData.scores && userData.scores.length > 0) {
                userData.scores.forEach((scoreData) => {
                    const assessmentTitle = assessmentMap.get(scoreData.assessmentId).title; // Get assessment title from map using assessmentId
                    const studentName = usersMap.get(userId).username; // Get student name from map using userId
                    scores.push({
                        userId: userId,
                        assessmentId: scoreData.assessmentId,
                        assessmentTitle: assessmentTitle,
                        score: scoreData.score,
                        username: studentName,
                        role: userData.role,
                        topicScores: scoreData.topicScores
                    });
                });
            }
        });
        setStudentScores(scores);
    };

    const handleViewAnalytics = async (assessmentId) => {
        const q = query(collection(db, 'scores'), where('assessmentId', '==', assessmentId));
        const querySnapshot = await getDocs(q);
        const fetchedScores = querySnapshot.docs.map(doc => doc.data());
        setSelectedAssessmentId(assessmentId);
        setSelectedAssessmentScores(fetchedScores);
    };

    const calculateOverallAnalytics = (userId) => {
        const studentAttempts = selectedAssessmentScores.filter(score => score.userId === userId);
        const totalAttempts = studentAttempts.length;
        const totalScore = studentAttempts.reduce((acc, curr) => acc + curr.score, 0);
        const averageScore = totalScore / totalAttempts;
        return { totalAttempts, averageScore };
    };

    const closeAnalytics = () => {
        setSelectedAssessmentId(null);
        setSelectedAssessmentScores([]);
    };

    return (
        <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Mentor Dashboard</h1>
            <table style={{ width: '100%', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th>Assessment Title</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {assessments.map((assessment, index) => (
                        <tr key={index} style={{ backgroundColor: selectedAssessmentId === assessment.id ? '#f0f0f0' : 'inherit' }}>
                            <td>{assessment.title}</td>
                            <td>
                                <button onClick={() => { fetchStudentScores(); handleViewAnalytics(assessment.id); }}>View Analytics</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedAssessmentId && (
                <div>
                    <h2>Total Analytics for Assessment {selectedAssessmentId}</h2>
                    <button onClick={closeAnalytics}>Close</button>
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Score</th>
                                <th>Topics</th>
                                <th>Overall Analytics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedAssessmentScores.map((score, index) => (
                                <tr key={index}>
                                    <td>{score.username}</td>
                                    <td>{score.score}</td>
                                    <td>
                                        {Object.entries(score.topicScores).map(([topic, topicScores]) => (
                                            <div key={topic}>
                                                <p>Topic: {topic}</p>
                                                <p>Correct Answers: {topicScores.correctAnswers}</p>
                                                <p>Wrong Answers: {topicScores.wrongAnswers}</p>
                                                <p>Total Questions: {topicScores.totalQuestions}</p>
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        {studentScores.map(studentScore => {
                                            if (studentScore.userId === score.userId) {
                                                const { totalAttempts, averageScore } = calculateOverallAnalytics(studentScore.userId);
                                                return (
                                                    <div key={studentScore.userId}>
                                                        <p>Total Attempts: {totalAttempts}</p>
                                                        <p>Average Score: {averageScore.toFixed(2)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MentorDashboard;
