import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../style/homepage.css'; // Import the CSS file

const StudentList = ({ mentor }) => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsResponse = await axios.get('https://mentor-dashboard-1.onrender.com/student');
      const evaluationsResponse = await axios.get('https://mentor-dashboard-1.onrender.com/evaluation');

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
    } else if (filter === 'notEvaluated') {
      filteredStudents = students.filter(student => student.evaluation && student.evaluation.teacher_id !== 0 && !student.evaluation.evaluation_locked);
    } else if (filter === 'notAssigned') {
      filteredStudents = students.filter(student => !student.evaluation || student.evaluation.teacher_id === 0);
    }

    return filteredStudents.map(student => (
      <div className="student" key={student.student_id}>
        <div className="student-info">
          {renderStudentLink(student)}
        </div>
        <div className="student-buttons">{renderButtons(student)}</div>
      </div>
    ));
  };

  const renderStudentLink = (student) => {
    if (mentorAssignedToStudent(student)) {
      return (
        <Link className="student-link" to={`/evaluation/${student.student_id}`}>
          <p>{student.name}</p>
          <p className='email_font'>{student.email}</p>
        </Link>
      );
    } else {
      return <div><p>{student.name}</p>
      <p className='email_font'>{student.email}</p>
      </div>
    }
  };

  const mentorAssignedToStudent = (student) => {
    return student.evaluation && student.evaluation.teacher_id === mentor.mentor_id;
  };

  const handleAssignStudent = async (studentId) => {
    try {
      const response = await axios.get(`https://mentor-dashboard-1.onrender.com/evaluation?teacher_id=${mentor.mentor_id}`);
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

      await axios.put('https://mentor-dashboard-1.onrender.com/evaluation/assign', requestBody);

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
          <Link className="student-link" to={`/evaluation/${student.student_id}`}>
            <button>Evaluate</button>
          </Link>
        </>
      );
    } else if (evaluation.evaluation_locked) {
      return <p className="locked-message">Total score: {evaluation.total_score}</p>;
    } else if (evaluation.teacher_id !== mentor.mentor_id && evaluation.teacher_id !== 0) {
      return <p className="locked-message">Unavailable</p>;
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

      await axios.put('https://mentor-dashboard-1.onrender.com/evaluation/assign', requestBody);

      fetchStudents();
    } catch (error) {
      console.error('Error assigning student:', error);
    }
  };

  return (
    <div className="container-studentList">
      <div className="filter-container">
        <button onClick={() => handleFilterChange('all')}>All Students</button>
        <button onClick={() => handleFilterChange('assigned')}>Your Students</button>
        <button onClick={() => handleFilterChange('locked')}>Already Evaluated Students</button>
        <button onClick={() => handleFilterChange('notEvaluated')}>Assigned but not evaluated</button>
        <button onClick={() => handleFilterChange('notAssigned')}>Yet to Assigned Students</button>
      </div>
      <div className="student-list-container">
        {renderStudentList()}
      </div>
    </div>
  );
};

export default StudentList;
