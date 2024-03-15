import React, { useState } from 'react';
import axios from 'axios';
import '../style/login.css'; // Import the CSS file

function DownloadEvaluation() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Call the /evaluate endpoint
      const response = await axios.post('http://localhost:5000/evaluate', { email }, { responseType: 'arraybuffer' });
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.download = 'evaluation.pdf'; // Set the filename for download
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
