import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  const handleMentorClick = () => {
    navigate('/home');
  };

  const handleStudentClick = () => {
    setRole('student');
  };

  const handleSubmitProject = () => {
    navigate('/submit-project');
  };

  const handleDownloadEvaluation = () => {
    navigate('/download-evaluation');
  };

  return (
    <div>
      <button onClick={handleMentorClick}>Mentor</button>
      <button onClick={handleStudentClick}>Student</button>

      {role === 'student' && (
        <div>
          <button onClick={handleSubmitProject}>Submit Project</button>
          <button onClick={handleDownloadEvaluation}>Download Evaluation</button>
        </div>
      )}
    </div>
  );
};

export default Login;
