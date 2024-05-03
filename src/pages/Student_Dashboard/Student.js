import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '../UserContext';
import './Student.css'
const StudentDashboard = () => {
    const [assessments, setAssessments] = useState([]);
    const { user } = useUser();

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
        <div className="student-dashboard">
            <div className="student-dashboard-title">
                <h3>Welcome, {user ? user.username : 'Guest'}!</h3>
                <h4>Available Assessments</h4>
            </div>
            <div className="student-dashboard-assessments">
                {assessments.map(assessment => (
                    <div key={assessment.id} className="assessment-card">
                  <div className='assessment-details'> 
                  <h5 className='text-title'>{assessment.title}</h5>
                        <p className='assessment-card-details'>{assessment.description}</p>
                  </div>
                 
                     <div className='assessment-card-buttons'>
                     <Link to={`/student-dashboard/${assessment.id}`} className="student-dashboard-button primary assessment-card-button1 ">
                            Attend Assessment
                        </Link>
                        <Link to={`/student-analytics/${assessment.id}`} className="student-dashboard-button secondary assessment-card-button2 ">
                            View Analytics
                        </Link>
                     </div>
                       
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard
