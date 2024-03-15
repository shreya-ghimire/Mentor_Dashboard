import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../style/evaluate.css'; 

const Evaluate = () => {
  const { student_id } = useParams();
  const [ideation, setIdeation] = useState(0);
  const [execution, setExecution] = useState(0);
  const [viva_pitch, setVivaPitch] = useState(0);
  const [projectUrl, setProjectUrl] = useState('');
  const [email, setEmail] = useState('');
  const [evaluationLocked, setEvaluationLocked] = useState(false);
  const [evaluationSaved, setEvaluationSaved] = useState(false);
  const [total_score, setTotalScore] = useState(0);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  useEffect(() => {
    fetchData();
  }, [student_id]);

  const fetchData = async () => {
    try {
      // Fetch student details
      const studentResponse = await axios.get('http://localhost:5000/student');
      const studentData = studentResponse.data.find(student => student.student_id === parseInt(student_id));
      if (studentData) {
        setProjectUrl(studentData.project);
        setEmail(studentData.email);
      }

      // Fetch evaluation details
      const evaluationResponse = await axios.get('http://localhost:5000/evaluation');
      const evaluationData = evaluationResponse.data.find(evaluation => evaluation.student_id === parseInt(student_id));
      if (evaluationData) {
        setIdeation(evaluationData.ideation);
        setExecution(evaluationData.execution);
        setVivaPitch(evaluationData.viva_pitch);
        setEvaluationLocked(evaluationData.evaluation_locked);
        setTotalScore(evaluationData.total_score);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleViewProject = () => {
    window.open(projectUrl, '_blank');
  };

  const handleSaveForm = async () => {
    try {
      await axios.put(`http://localhost:5000/evaluation/update/`, {
        student_id,
        ideation,
        execution,
        viva_pitch,
        total_score,
        evaluation_locked: evaluationLocked && evaluationSaved,
      });

      setEvaluationSaved(true);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };
  
  const handleLockForm = async (studentEmail) => {
    // Check if the form has been saved
    if (!evaluationSaved) {
      alert('Please save the form before locking.');
      return;
    }
  
    // Check if any evaluation criteria is set to 0 or unassigned
    if (ideation === '' || execution === '' || viva_pitch === '') {
      alert('Form cannot be locked if any evaluation criteria is set to 0 or unassigned.');
      return;
    }
  
    // If all conditions are met, lock the form
    
    setEvaluationLocked(true);
    setConfirmationEmail(studentEmail);
  
    try {
      // Update evaluation with the new locked status
      await axios.put(`http://localhost:5000/evaluation/update/`, {
        student_id,
        ideation,
        execution,
        viva_pitch,
        total_score,
        evaluation_locked: true, // Set to true when locking
      });
      
      // Call the backend endpoint to send email
      await axios.post(`http://localhost:5000/send-email`, {
        studentEmail: studentEmail,
        totalScore: total_score
      });

      // Set confirmation email
      
  
      console.log('Evaluation form locked.');
    } catch (error) {
      console.error('Error locking form:', error);
    }
  };
  

  // Calculate total score
  useEffect(() => {
    const total = parseInt(ideation) + parseInt(execution) + parseInt(viva_pitch);
    setTotalScore(total);
  }, [ideation, execution, viva_pitch]);

  // Check if marks are greater than 10
  const handleInputChange = (e, setter) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value <= 10) {
      setter(value);
    }
  };

  return (
    <div className="container">
      <h1>Evaluation Page</h1>
      <p className='student_id_text'>Student ID: {student_id}</p>
      <button onClick={handleViewProject} className='view_btn'>View Project</button>
      <form className='form_evaluate'>
        <label>Ideation:</label>
        <input type="number" value={ideation} onChange={(e) => handleInputChange(e, setIdeation)} disabled={evaluationLocked} /><br />
        <label>Execution:</label>
        <input type="number" value={execution} onChange={(e) => handleInputChange(e, setExecution)} disabled={evaluationLocked} /><br />
        <label>Viva Pitch:</label>
        <input type="number" value={viva_pitch} onChange={(e) => handleInputChange(e, setVivaPitch)} disabled={evaluationLocked} /><br />
        <label>Total Score:</label>
        <input type="text" value={total_score} readOnly /><br />
        <div className="buttons-container">
          <button type="button" className='button_evaluate'onClick={handleSaveForm}>Save</button>
          <button type="button" className='button_evaluate' onClick={() => handleLockForm(email)} disabled={evaluationLocked || !evaluationSaved}>Lock</button>
        </div>
      </form>
      {confirmationEmail && (
        <div className="confirmation-message">
          Email confirmation sent to: {confirmationEmail}<br />
          <Link to="/home">Download Result</Link>
        </div>
      )}
    </div>
  );
};

export default Evaluate;
