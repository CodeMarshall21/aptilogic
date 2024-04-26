import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Login from './pages/Login';
import TrainerDashboard from './pages/TrainerDashboard'; // Import your TrainerDashboard component
import AssessmentCreation from './pages/AssessmentCreation';

function App() {
  return (
    <BrowserRouter>
    <Routes>
          <Route index element={<Home />} />
          <Route path="trainer-dashboard" element={<TrainerDashboard />} />
         <Route path="create-assessment" element={<AssessmentCreation/>} />
  
    </Routes>
    </BrowserRouter>
  );
}

export default App;
