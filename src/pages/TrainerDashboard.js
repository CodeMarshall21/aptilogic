import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';



const TrainerDashboard = () => {

  return (
    <div >
      <Typography variant="h2" gutterBottom>
        Trainer Dashboard
      </Typography>
      <Link to="/create-assessment" style={{ textDecoration: 'none' }}>
        <Button variant="contained" color="primary" >
          Create Assessment
        </Button>
      </Link>
    </div>
  );
};

export default TrainerDashboard;
