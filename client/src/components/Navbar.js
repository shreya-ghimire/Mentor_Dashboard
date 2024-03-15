
import React from 'react';
import '../style/homepage.css'; 

const Navbar = ({ mentor, onLogout }) => {
  return (
    <div className="navbar-container">
      <h1 className="title">Dashboard</h1>
      {mentor && (
        <>
          <p className="logged-in-info">Logged in as {mentor.name}</p>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
