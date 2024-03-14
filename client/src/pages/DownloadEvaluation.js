import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>
          Enter your email:
          <input 
            type="email" 
            value={email} 
            onChange={(event) => setEmail(event.target.value)} 
            required 
          />
        </label>
        <button type="submit">Download Evaluation</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}

export default DownloadEvaluation;
