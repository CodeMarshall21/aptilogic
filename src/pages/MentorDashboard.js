import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const MentorDashboard = () => {
    const [studentScores, setStudentScores] = useState([]);

    useEffect(() => {
        const fetchStudentScores = async () => {
            const usersQuerySnapshot = await getDocs(collection(db, 'users'));
            const scores = [];
            usersQuerySnapshot.forEach((userDoc) => {
                const userData = userDoc.data();
                const userId = userDoc.id;
                if (userData.scores && userData.scores.length > 0) {
                    userData.scores.forEach((scoreData) => {
                        scores.push({
                            userId: userId,
                            assessmentId: scoreData.assessmentId,
                            score: scoreData.score,
                            username: userData.username,
                            role: userData.role
                        });
                    });
                }
            });
            setStudentScores(scores);
        };

        fetchStudentScores();
    }, []);

    return (
        <div>
            <h1>Mentor Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Assessment ID</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {studentScores.map((score, index) => (
                        <tr key={index}>
                            <td>{score.username}</td>
                            <td>{score.assessmentId}</td>
                            <td>{score.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MentorDashboard;
