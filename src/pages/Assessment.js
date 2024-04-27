// Assessment.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Assessment = () => {
    const { assessmentId } = useParams();
    const [assessment, setAssessment] = useState(null);

    useEffect(() => {
        const fetchAssessment = async () => {
            const docRef = doc(db, 'assessments', assessmentId);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                setAssessment({ id: docSnapshot.id, ...docSnapshot.data() });
            } else {
                console.error('Assessment not found');
            }
        };

        fetchAssessment();
    }, [assessmentId]);

    if (!assessment) {
        return <div>Loading...</div>;
    }
console.log(assessment)
    return (
        <div>
            <h1>{assessment.title}</h1>
            <p>{assessment.description}</p>
            <h2>Questions</h2>
            {assessment.questions && assessment.questions.length > 0 ? (
                <div>
                    {assessment.questions.map((question, index) => (
                        <div key={index}>
                            <p>{question.text}</p>
                            <ul>
                                {question.options.map((option, optionIndex) => (
                                    <li key={optionIndex}>{option}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div>No questions found for this assessment.</div>
            )}
        </div>
    );
};

export default Assessment;
