import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/registerService';
import { TextField, Button, Box, Container, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

// Create a custom style for the Button component
const useStyles = makeStyles((theme) =>
  createStyles({
    customButton: {
      marginTop: theme.spacing(2),
    },
  })
);

const Register: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await registerUser(email, username, password);
      console.log('Registration successful:', response);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Repeat Password"
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegister}
          fullWidth
          className={classes.customButton}
        >
          Create Account
        </Button>
      </Box>
    </Container>
  );
};

export default Register;