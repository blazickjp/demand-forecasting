import { useState } from 'react';
import axios from 'axios';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, CircularProgress, Box, Typography } from '@mui/material';

export default function FileUploadForm() {
  const [file, setFile] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForecast(response.data.forecast);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box my={2}>
        <Typography variant="h6" gutterBottom>
          Try Now for Free!
        </Typography>
        <input
          style={{ display: 'none' }}
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={(event) => setFile(event.target.files[0])}
        />
        <label htmlFor="file-upload">
          <Button variant="contained" color="primary" component="span">
            Choose File
          </Button>
        </label>
        <Typography variant="body1" component="span" ml={2}>
          {file ? file.name : 'No file selected'}
        </Typography>
      </Box>
      <Box my={2}>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={!file || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload and Generate Forecast'}
        </Button>
      </Box>
      {forecast && (
        <pre>{JSON.stringify(forecast, null, 2)}</pre>
      )}
    </form>
  );
}
