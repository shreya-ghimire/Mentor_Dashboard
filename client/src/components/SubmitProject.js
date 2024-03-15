// SubmitProject.js

import React, { useState } from 'react';
import axios from 'axios';
import '../style/login.css'; // Import the CSS file

const SubmitProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    batch: '',
    section: '',
    project: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/student', formData);
      alert('Project submitted successfully!');
      setFormData({
        name: '',
        email: '',
        batch: '',
        section: '',
        project: ''
      });
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Failed to submit project. Please try again later.');
    }
  };

  return (
    <div className='container_login_div'>
      <h2>Submit Project</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input className="input-field-project" type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input className="input-field-project" type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Batch:</label>
          <input className="input-field-project" type="text" name="batch" value={formData.batch} onChange={handleChange} />
        </div>
        <div>
          <label>Section:</label>
          <input className="input-field-project" type="text" name="section" value={formData.section} onChange={handleChange} />
        </div>
        <div>
          <label>Project URL:</label>
          <input className="input-field-project" type="text" name="project" value={formData.project} onChange={handleChange} />
        </div>
        <button className="button_submit" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SubmitProject;
