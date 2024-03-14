import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudentList = ({ mentor }) => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsResponse = await axios.get('http://localhost:5000/student');
      const evaluationsResponse = await axios.get('http://localhost:5000/evaluation');

      const studentsData = studentsResponse.data;
      const evaluationsData = evaluationsResponse.data;

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
    let filteredStudents = students;

    if (filter === 'assigned') {
      filteredStudents = students.filter(student => student.evaluation && student.evaluation.teacher_id === mentor.mentor_id);
    } else if (filter === 'locked') {
      filteredStudents = students.filter(student => student.evaluation && student.evaluation.evaluation_locked);
    }

    return filteredStudents.map(student => (
      <div key={student.student_id}>
        {/* Render student name or link based on mentor assignment */}
        {renderStudentLink(student)}
        {/* Render buttons based on evaluation status */}
        {renderButtons(student)}
      </div>
    ));
  };

  const renderStudentLink = (student) => {
    if (mentorAssignedToStudent(student)) {
      return (
        <Link to={`/evaluation/${student.student_id}`}>
          <p>{student.name}</p>
        </Link>
      );
    } else {
      return (
        <div>
          <p>{student.name}</p>
        </div>
      );
    }
  };

  const mentorAssignedToStudent = (student) => {
    return student.evaluation && student.evaluation.teacher_id === mentor.mentor_id;
  };

  const handleAssignStudent = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:5000/evaluation?teacher_id=${mentor.mentor_id}`);
      const assignedStudents = response.data.filter(evaluation => evaluation.teacher_id === mentor.mentor_id);

      if (assignedStudents.length < 3) {
        alert(`You need to add minimum 3 students`);
      }
      if (assignedStudents.length >= 4) {
        alert('Maximum student assigned');
        return;
      }

      const requestBody = {
        student_id: studentId,
        teacher_id: mentor.mentor_id
      };

      await axios.put('http://localhost:5000/evaluation/assign', requestBody);

      fetchStudents();
    } catch (error) {
      console.error('Error assigning student:', error);
    }
  };

  const renderButtons = (student) => {
    const { evaluation } = student;
    if (!evaluation) {
      return (
        <>
          <button onClick={() => handleAssignStudent(student.student_id)}>Assign</button>
        </>
      );
    } else if (evaluation.teacher_id === 0) {
      return (
        <>
          <button onClick={() => handleAssignStudent(student.student_id)}>Assign</button>
        </>
      );
    } else if (evaluation.teacher_id === mentor.mentor_id && !evaluation.evaluation_locked) {
      return (
        <>
          <button onClick={() => handleRemoveStudent(student.student_id)}>Remove</button>
          <Link to={`/evaluation/${student.student_id}`}>
            <button>Evaluate</button>
          </Link>
        </>
      );
    } else if (evaluation.teacher_id !== mentor.mentor_id && evaluation.teacher_id !== 0) {
      return <p>Unavailable</p>;
    } else if (evaluation.evaluation_locked) {
      return <p>Total marks: {evaluation.total_score}</p>;
    } else {
      return null;
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      const requestBody = {
        student_id: studentId,
        teacher_id: 0
      };

      await axios.put('http://localhost:5000/evaluation/assign', requestBody);

      fetchStudents();
    } catch (error) {
      console.error('Error assigning student:', error);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => handleFilterChange('all')}>All Students</button>
        <button onClick={() => handleFilterChange('assigned')}>Your Students</button>
        <button onClick={() => handleFilterChange('locked')}>Locked Students</button>
      </div>
      {renderStudentList()}
    </div>
  );
};

export default StudentList;
