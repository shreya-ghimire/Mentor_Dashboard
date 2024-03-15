import React, { useState } from 'react';
import axios from 'axios';
import '../style/login.css'; 

function DownloadEvaluation() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('https://mentor-dashboard-1.onrender.com/evaluate', { email }, { responseType: 'arraybuffer' });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      

      const url = window.URL.createObjectURL(blob);
      

      const link = document.createElement('a');
      link.href = url;
      link.download = 'evaluation.pdf'; 
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrorMessage('Error downloading evaluation. Please try again later.');
      console.error('Error downloading evaluation:', error);
    }
  };
  
  return (
    <div className="'container_login_div'">
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            className="input-field"
            type="email" 
            value={email} 
            onChange={(event) => setEmail(event.target.value)} 
            required 
          />
        </div>
        <button className="button_submit" type="submit">Download Evaluation</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default DownloadEvaluation;
