import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Evaluate = () => {
  const { student_id } = useParams();
  const [ideation, setIdeation] = useState(0);
  const [execution, setExecution] = useState(0);
  const [vivaPitch, setVivaPitch] = useState(0);
  const [projectUrl, setProjectUrl] = useState('');
  const [evaluationLocked, setEvaluationLocked] = useState(false);
  const [evaluationSaved, setEvaluationSaved] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

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
      }

      // Fetch evaluation details
      const evaluationResponse = await axios.get('http://localhost:5000/evaluation');
      const evaluationData = evaluationResponse.data.find(evaluation => evaluation.student_id === parseInt(student_id));
      if (evaluationData) {
        setIdeation(evaluationData.ideation);
        setExecution(evaluationData.execution);
        setVivaPitch(evaluationData.viva_pitch);
        setEvaluationLocked(evaluationData.evaluation_locked);
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
      // Update evaluation
      await axios.put(`http://localhost:5000/evaluation/update/`, {
        student_id,
        ideation,
        execution,
        vivaPitch,
        evaluation_locked: evaluationLocked || evaluationSaved  // Form cannot be locked if not saved
      });
      setEvaluationSaved(true);
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  const handleLockForm = () => {
    // Check if the form has been saved
    if (!evaluationSaved) {
      alert('Please save the form before locking.');
      return;
    }
  
    // Check if any evaluation criteria is set to 0 or unassigned
    if (ideation === '' || execution === '' || vivaPitch === '') {
      alert('Form cannot be locked if any evaluation criteria is unassigned.');
      return;
    }
  
    // If all conditions are met, lock the form
    setEvaluationLocked(true);
  };

  // Calculate total score
  useEffect(() => {
    const total = parseInt(ideation) + parseInt(execution) + parseInt(vivaPitch);
    setTotalScore(total);
  }, [ideation, execution, vivaPitch]);

  // Check if marks are greater than 10
  const handleInputChange = (e, setter) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value <= 10) {
      setter(value);
    }
  };

  return (
    <div>
      <h1>Evaluation Page</h1>
      <p>Student ID: {student_id}</p>
      <button onClick={handleViewProject}>View Project</button>
      <form>
        <label>Ideation:</label>
        <input type="number" value={ideation} onChange={(e) => handleInputChange(e, setIdeation)} disabled={evaluationLocked} /><br />
        <label>Execution:</label>
        <input type="number" value={execution} onChange={(e) => handleInputChange(e, setExecution)} disabled={evaluationLocked} /><br />
        <label>Viva Pitch:</label>
        <input type="number" value={vivaPitch} onChange={(e) => handleInputChange(e, setVivaPitch)} disabled={evaluationLocked} /><br />
        <label>Total Score:</label>
        <input type="text" value={totalScore} readOnly /><br />
        <button type="button" onClick={handleSaveForm}>Save</button>
        <button type="button" onClick={handleLockForm} disabled={evaluationLocked || !evaluationSaved}>Lock</button>
      </form>
    </div>
  );
};

export default Evaluate;
