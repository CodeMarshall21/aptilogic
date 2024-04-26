import React from 'react';
import { Link } from 'react-router-dom';

const TrainerDashboard = () => {
  return (
    <div>
      <h2>Trainer Dashboard</h2>
      <Link to="/create-assessment">
        <button>Create Assessment</button>
      </Link>
    </div>
  );
};

export default TrainerDashboard;
