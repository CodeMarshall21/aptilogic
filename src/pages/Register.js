import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import  {app,auth,db}  from '../firebase';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student'); // Default role is Student

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user role in Firestore
            await setDoc(doc(db, 'users', user.uid), {
                role: role
            });

            console.log(user);
            navigate('/login');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
        }
    }

    return (
        <main>
            <section>
                <div>
                    <form>
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email address"
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                            />
                        </div>

                        <div>
                            <label htmlFor="role">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Student">Student</option>
                                <option value="Aptitude Trainer">Aptitude Trainer</option>
                                <option value="Class Mentor">Class Mentor</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            onClick={onSubmit}
                        >
                            Sign up
                        </button>
                    </form>

                    <p>
                        Already have an account?{' '}
                        <NavLink to="/login" >
                            Sign in
                        </NavLink>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default Signup;
