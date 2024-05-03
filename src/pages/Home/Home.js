import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc,getDoc } from 'firebase/firestore';
import {  auth, db } from '../../firebase';
import { useUser } from '../UserContext';
import "./Home.css"

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

    <div className='container bubbles'>
    
      <div className='left'>
       <h1 className='head jersey-15-regular'>
       <span>Apti</span> <span>Logic</span>
      </h1>
      <div className='typewriter'>
      Unlock Your Potential, Excel with AptiLogic.  Register👉🏻</div>
       </div>
      <div className='right'>
     
     
      {isLogin ?   (
        <div className='card'>
          <h2 className='form-title'>Sign Up</h2>
          <form className='form' onSubmit={handleSignup}>
            <input
              className='form-field'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className='form-field'
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className='form-field'
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <select
              className='form-field'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Student">Student</option>
              <option value="Aptitude Trainer">Aptitude Trainer</option>
              <option value="Class Mentor">Class Mentor</option>
            </select>
            <button className='form-submit' type="submit">Sign Up</button>
          </form>
          <p>Already have an account? <button className='form-submit' onClick={toggleForm}>Sign in</button></p>
        </div>
      ):(
        <div className='card'>
          <h2 className='form-title'>Login</h2>
          <form className='form' onSubmit={handleLogin}>
            <input
              className='form-field'
              type="email"
              placeholder="Enter your Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className='form-field'
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* <button class="button-5" role="button">Button 5</button> */}

            <button className='form-submit' type="submit">Login</button>
          </form>
          <p>Don't have an account? <button class='form-submit' onClick={toggleForm}>Sign up</button></p>
        </div>
      )}
    </div>
  </div>
  );
};

export default LoginSignup;
