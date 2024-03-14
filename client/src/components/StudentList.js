import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'assigned'

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsResponse = await axios.get('http://localhost:5000/student');
      const evaluationsResponse = await axios.get('http://localhost:5000/evaluation');
      
      const studentsData = studentsResponse.data;
      const evaluationsData = evaluationsResponse.data;

      // Merge student data with evaluation data
      const mergedData = studentsData.map(student => {
        const evaluation = evaluationsData.find(evaluation => evaluation.student_id === student.student_id);
        return { ...student, evaluation };
      });

      setStudents(mergedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const renderStudentList = () => {
    return students.map(student => {
      if (filter === 'all' || (filter === 'assigned' && student.evaluation && student.evaluation.teacher_id !== 0)) {
        return (
          <div key={student.student_id}>
            <p>{student.name}</p>
            {/* Render buttons based on evaluation status */}
            {renderButtons(student)}
          </div>
        );
      }
      return null;
    });
  };

  const renderButtons = (student) => {
    const { evaluation } = student;
    if (!evaluation) {
      return <button onClick={() => handleAssignStudent(student.student_id)}>Assign</button>;
    } else if (evaluation.teacher_id === 0) {
      return <button onClick={() => handleAssignStudent(student.student_id)}>Assign</button>;
    } else if (evaluation.teacher_id !== 0 && !evaluation.evaluation_locked) {
      return <button onClick={() => handleRemoveStudent(student.student_id)}>Remove</button>;
    } else if (evaluation.evaluation_locked) {
      return <p>Locked</p>;
    }
  };

  const handleAssignStudent = async (studentId) => {
    try {
      await axios.put(`http://localhost:5000/student/${studentId}`, { teacher_id: 0 });
      fetchStudents(); // Refresh student list after update
    } catch (error) {
      console.error('Error assigning student:', error);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      await axios.put(`http://localhost:5000/student/${studentId}`, { teacher_id: null });
      fetchStudents(); // Refresh student list after update
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div>
        <button onClick={() => handleFilterChange('all')}>All Students</button>
        <button onClick={() => handleFilterChange('assigned')}>Assigned Students</button>
      </div>
      {/* Student List */}
      {renderStudentList()}
    </div>
  );
};

export default StudentList;
