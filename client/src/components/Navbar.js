import React from 'react';

const Navbar = ({ mentor, onLogout }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h1 style={{ marginRight: 'auto' }}>Dashboard</h1>
      {mentor && (
        <>
          <p style={{ marginRight: '10px' }}>Logged in as {mentor.name}</p>
          <button onClick={onLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
