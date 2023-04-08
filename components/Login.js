import { useState } from 'react';
import { Button, TextField, Typography, Container, Box, Paper } from '@mui/material';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (username === 'user' && password === '5') {
      setError(null);
      onLoginSuccess();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3}>
        <Box p={4}>
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" component="h2" align="center" mb={3}>
              Sign In
            </Typography>
            <TextField
              label="Username"
              variant="outlined"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              fullWidth
              required
              margin="normal"
            />
            {error && (
              <Typography color="error" variant="subtitle2" align="center" mb={2}>
                {error}
              </Typography>
            )}
            <Box display="flex" justifyContent="center">
              <Button type="submit" variant="contained" color="primary">
                Sign In
              </Button>
            </Box>
          </form>
        </Box>
      </Paper>
    </Container>
  );
}
