import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StudentList from '../components/StudentList';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { mentor_id, name, email } = location.state;
      setMentor({ mentor_id, name, email });
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div>
      {mentor && (
        <div>
          <Navbar mentor={mentor} onLogout={handleLogout} />
          <StudentList mentor={mentor} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
