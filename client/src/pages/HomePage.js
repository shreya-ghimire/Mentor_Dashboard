import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Make sure the filename matches
import StudentList from '../components/StudentList';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout actions if needed
    navigate('/');
  };

  // Dummy mentor data (to be replaced with actual mentor data after implementing authentication)
  const mentor = {
        mentor_id:1,
        name:"Ravi Kumar",
        email:"ravi.kumar@example.com",
        password:"hashedPassword1"

  }

  return (
    <div>
      <Navbar mentor={mentor} onLogout={handleLogout} />
      <StudentList mentor={mentor} />
    </div>
  );
};

export default HomePage;
