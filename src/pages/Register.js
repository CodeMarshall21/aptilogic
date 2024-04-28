import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { app, auth, db } from '../firebase';

// Material-UI components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const SignupBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 400,
  margin: 'auto',
  marginTop: theme.spacing(8),
}));

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Student'); // Default role is Student

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user role in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        role: role,
        username: username
      });

      console.log(user);
      // navigate('/login');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  }

  return (
    <SignupBox>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          label="Username"
          type="text"
          fullWidth
          margin="normal"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          select
          label="Role"
          fullWidth
          margin="normal"
          variant="outlined"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="Student">Student</MenuItem>
          <MenuItem value="Aptitude Trainer">Aptitude Trainer</MenuItem>
          <MenuItem value="Class Mentor">Class Mentor</MenuItem>
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Sign up
        </Button>
      </form>
      <Typography variant="body2" align="center" style={{ marginTop: 20 }}>
        Already have an account? <NavLink to="/login">Sign in</NavLink>
      </Typography>
    </SignupBox>
  );
}

export default Signup;
