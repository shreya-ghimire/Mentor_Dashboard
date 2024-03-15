import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MentorList() {
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/mentor');
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const handleMentorClick = (mentor) => {
    navigate('/home', {
      state: {
        mentor_id: mentor.mentor_id,
        name: mentor.name,
        email: mentor.email
      }
    });
  };

  return (
    <div className='container_login_div'>
      <h2>Mentor List</h2>
      <div className="mentor_div">
        {mentors.map((mentor, index) => (
          <button key={index} className='button_submit' onClick={() => handleMentorClick(mentor)}>
            {mentor.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MentorList;
