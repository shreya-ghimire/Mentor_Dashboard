import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Submit Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label>Batch:</label>
          <input type="text" name="batch" value={formData.batch} onChange={handleChange} />
        </div>
        <div>
          <label>Section:</label>
          <input type="text" name="section" value={formData.section} onChange={handleChange} />
        </div>
        <div>
          <label>Project URL:</label>
          <input type="text" name="project" value={formData.project} onChange={handleChange} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SubmitProject;
