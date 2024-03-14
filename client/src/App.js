import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SubmitProject from './pages/SubmitProject';
import Evaluate from './pages/Evaluate';
import DownloadEvaluation from './pages/DownloadEvaluation';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/submit-project" element={<SubmitProject />} />
        <Route path="/evaluation/:student_id" element={<Evaluate />} /> 
        <Route path="/download-evaluation" element={<DownloadEvaluation />} />
      </Routes>
    </Router>
  );
};

export default App;
