import { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Grid,
  Tooltip,
} from '@mui/material';
import Papa from 'papaparse';
import PropTypes from 'prop-types';
import FileUpload from 'react-material-file-upload';

const FileUploadForm = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasHeaders, setHasHeaders] = useState(true);

  useEffect(() => {
    console.log(file);
  }, [file]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    setLoading(false);
    const reader = new FileReader();
    reader.onload = () => {
      Papa.parse(reader.result, {
        complete: (results) => {
          let uploadedData = results.data;
          let headers = null;
          if (hasHeaders) {
            headers = uploadedData.shift();
          }
          onFileUpload(uploadedData, headers);
        },
      });
    };
    console.log(file[0]);
    reader.readAsText(file[0]);
  };

  FileUploadForm.propTypes = {
    onFileUpload: PropTypes.func.isRequired,
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FileUpload value={file} onChange={setFile} multiple={false} accept=".csv" />
        </Grid>
        <Grid item xs={12}>
          <Tooltip title="Check this if your CSV file has a header row with column names.">
            <FormControlLabel
              control={
                <Checkbox
                  checked={hasHeaders}
                  onChange={(event) => setHasHeaders(event.target.checked)}
                  name="hasHeaders"
                  color="primary"
                />
              }
              label="File has headers"
            />
          </Tooltip>
          <Button
            sx={{ float: 'right' }}
            type="submit"
            variant="contained"
            color="secondary"
            disabled={!file || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload Data'}
          </Button>
        </Grid>
      </Grid>
      {forecast && <pre>{JSON.stringify(forecast, null, 2)}</pre>}
    </form >
  );
};

export default FileUploadForm;
