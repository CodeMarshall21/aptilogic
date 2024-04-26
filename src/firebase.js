// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmjv8l2XVP2eaqiMO6-3On1urYPUZEMNQ",
  authDomain: "aptilogic1.firebaseapp.com",
  projectId: "aptilogic1",
  storageBucket: "aptilogic1.appspot.com",
  messagingSenderId: "65882504152",
  appId: "1:65882504152:web:4f0182b907fb63703090ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export  {app,auth,db};