import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import  {app,auth,db}  from '../firebase';
import { collection, query, where, getDocs,doc,getDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { useUser } from './UserContext';
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUser();
    const[role,setRole]=useState('')


    useEffect(() => {
        // Use effect to watch for changes in the role state
        if (role) { // Ensure role is not null
            switch (role) {
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
        }
    }, [role]);


    const onLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // setUser(user);
            const q = query(collection(db, 'users'));
            const querySnapshot = await getDocs(q);
       
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log("user",userData)
              setUser(userData); // Set user data in context
              // Redirect to dashboard
            } else {
              console.error('User data not found');
            }

            querySnapshot.forEach((doc) => {
                console.log(doc.data(),doc.id)
                if( doc.id==user.uid){
                    setRole(doc.data().role);
                }
                // console.log(doc.data())
            })
                
                switch (role) {

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

                        <button
                            type="submit"
                            onClick={onLogin}
                        >
                            Login
                        </button>
                    </form>

                    <p>
                        No account yet?{' '}
                        <NavLink to="/signup">
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </section>
        </main>
    )
}

export default Login;
