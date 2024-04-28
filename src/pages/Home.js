import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc,getDoc } from 'firebase/firestore';
import { app, auth, db } from '../firebase';
import { useUser } from './UserContext';
import "./Home.css"
// Material-UI components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { MenuItem } from '@mui/material';
const LoginSignup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Student'); // Default role is Student
  const [isLogin, setIsLogin] = useState(true); // Initially show login form
  const { setUser } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData); // Set user data in context
            switch (userData.role) {
                case 'Student':
                    navigate('/student-dashboard');
                    break;
                case 'Aptitude Trainer':
                    navigate('/trainer-dashboard');
                    break;
                case 'Class Mentor':
                    navigate('/mentor-dashboard');
                    break;
                default:
                    break;
            }
        } else {
            console.error('User data not found');
        }
    } catch (error) {
        console.error(error.message);
    }
};

  const handleSignup = async (e) => {
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
      toggleForm();

    } catch (error) {
      console.error(error.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className='container'>
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" className="contanier">
      <Box width="50%" padding={4}>
      <h1>
      <span>          AptiLogic
</span>
    </h1>
        <Typography variant="h2" gutterBottom>
        </Typography>
        <h3 className='content'>
        We help  students, trainers, and mentors <br></br>
        to enhance their skills and performance.
        </h3>
      </Box>
      <Box width="50%" padding={4}>
        {isLogin ? (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Login
              </Typography>
              <form onSubmit={handleLogin}>
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: 20 }}
                >
                  Login
                </Button>
              </form>
              <Typography variant="body2" align="center" style={{ marginTop: 20 }}>
                Don't have an account?{' '}
                <Button color="primary" onClick={toggleForm}>
                  Sign up
                </Button>
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Sign Up
              </Typography>
              <form onSubmit={handleSignup}>
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
                  style={{ marginTop: 20 }}
                >
                  Sign Up
                </Button>
              </form>
              <Typography variant="body2" align="center" style={{ marginTop: 20 }}>
                Already have an account?{' '}
                <Button color="primary" onClick={toggleForm}>
                  Sign in
                </Button>
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
    </div>
  );
};

export default LoginSignup;
