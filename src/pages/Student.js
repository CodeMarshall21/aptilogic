import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useUser } from './UserContext';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

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
        <div>
                    <Box display="flex" flexDirection="column" alignItems="center">

            <Typography variant="h3" gutterBottom>
                Welcome, {user ? user.username : 'Guest'}!
            </Typography>
            <Typography variant="h4" gutterBottom>
                Available Assessments
            </Typography>
            </Box>
            <div>
                {assessments.map(assessment => (
                    <Card key={assessment.id} variant="outlined" style={{ width: 300, margin: 10 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                {assessment.title}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                {assessment.description}
                            </Typography>
                            <Button
                                component={Link}
                                to={`/student-dashboard/${assessment.id}`}
                                variant="contained"
                                color="primary"
                                style={{ marginRight: 10 }}
                            >
                                Attend Assessment
                            </Button>
                            <Button
                                component={Link}
                                to={`/student-analytics/${assessment.id}`}
                                variant="contained"
                                color="secondary"
                            >
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
        </div>

    );
};

export default StudentDashboard;
