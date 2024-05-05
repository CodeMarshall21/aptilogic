import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebase";
import "./TrainerDashboard.css";

const TrainerDashboard = () => {
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchAssessments = async () => {
      const q = query(collection(db, "assessments"));
      const querySnapshot = await getDocs(q);
      const fetchedAssessments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssessments(fetchedAssessments);
    };

    fetchAssessments();
  }, []);
  console.log(assessments);

  return (
    <>
    <div className="trainer-overall">
      <h2 className="trainer-head-here"> Trainer Dashboard </h2>
      <div className="trainer-dashboard">
        <div className="trainer-dashboard-title">
          <h4 className="trainer-head-2-here">Created Assessments</h4>
        </div>
        <div className="trainer-dashboard-assessments">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="trainer-assessment-card">
              <div className="assessment-details">
                <h5 className="text-title">{assessment.title}</h5>
                <p className="assessment-card-details">
                  {assessment.description}
                </p>
              </div>
            </div>
          ))}
          
       

        </div>
       
      </div>
      <Link to="/create-assessment" style={{ textDecoration: "none" }}>
        <button className="create-assessment-btn-here">
          <span class="text">Create Assessment</span>
        </button>   
      </Link>
    </div>
   
    </>
  );
};

export default TrainerDashboard;
