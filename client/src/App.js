import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import SubmitProject from './components/SubmitProject';
import Evaluate from './pages/Evaluate';
import DownloadEvaluation from './components/DownloadEvaluation';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/evaluation/:student_id" element={<Evaluate />} /> 
      </Routes>
    </Router>
  );
};

export default App;
