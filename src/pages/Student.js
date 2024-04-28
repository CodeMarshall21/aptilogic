// StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from './UserContext';
const StudentDashboard = () => {
    const [assessments, setAssessments] = useState([]);
    const { user } = useUser();
    console.log("suser8998:",user)
    useEffect(() => {
        const fetchAssessments = async () => {
            const q = query(collection(db, 'assessments'));
            const querySnapshot = await getDocs(q);
            const fetchedAssessments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAssessments(fetchedAssessments);
        };

        fetchAssessments();
    }, []);

    return (
        <div>
                  <h1>Welcome, {user ? user.username : 'Guest'}!</h1>

            <h1>Available Assessments</h1>
            <div>
                {assessments.map(assessment => (
                    <div key={assessment.id}>
                        <h3>{assessment.title}</h3>
                        <p>{assessment.description}</p>
                        <Link to={`/student-dashboard/${assessment.id}`}>Attend Assessment</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
