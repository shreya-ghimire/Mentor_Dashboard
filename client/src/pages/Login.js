import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import SubmitProject from '../components/SubmitProject';
import DownloadEvaluation from '../components/DownloadEvaluation';
import MentorList from '../components/MentorList'; // Import MentorList component

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [showSubmitProject, setShowSubmitProject] = useState(false);
  const [showDownloadEvaluation, setShowDownloadEvaluation] = useState(false);
  const [showMentorList, setShowMentorList] = useState(false); // State to manage visibility of MentorList component

  const handleMentorClick = () => {
    fetch('https://mentor-dashboard-1.onrender.com/evaluation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      })
    })
      .then(response => {
        if (response.ok) {
          console.log("done");
        } else {
          throw new Error('Failed to send mentor request');
        }
      })
      .catch(error => console.error('Error sending mentor request:', error));


    setShowMentorList(true);
    setShowDownloadEvaluation(false);
    setShowSubmitProject(false);
  };


  const handleShowSubmitProject = () => {
    setShowSubmitProject(true);
    setShowDownloadEvaluation(false);
    setShowMentorList(false); 
  };

  const handleShowDownloadEvaluation = () => {
    setShowDownloadEvaluation(true);
    setShowSubmitProject(false);
    setShowMentorList(false); 
  };

  return (
    <div>
      <div className="container_login">
        <button className="button_login" onClick={handleMentorClick}>Mentor</button>
        <button className="button_login" onClick={handleShowSubmitProject}>Submit Project</button>
        <button className="button_login" onClick={handleShowDownloadEvaluation}>Download Evaluation</button>
      </div>
      {showSubmitProject && <SubmitProject />}
      {showDownloadEvaluation && <DownloadEvaluation />}
      {showMentorList && <MentorList />} 
    </div>
  );
};

export default Login;
