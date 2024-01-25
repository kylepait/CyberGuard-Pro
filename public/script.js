// script.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBU8GUvAhx0k7D9Uvp5SEGl7dmb5p0W8B8",
    authDomain: "cyberguard-pro.firebaseapp.com",
    projectId: "cyberguard-pro",
    storageBucket: "cyberguard-pro.appspot.com",
    messagingSenderId: "84548542407",
    appId: "1:84548542407:web:c4599c3f3707da29c043e2",
    measurementId: "G-9HFXYJZ9TC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Firebase Auth
const auth = getAuth(firebaseApp);

const db = require('./db');


console.log('Script.js loaded successfully.');



// Login Function
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Handle successful login
            console.log('Login Successful', userCredential.user);
        })
        .catch((error) => {
            // Handle login error
            console.error('Login Error', error.message);
        });
}

// Signup Function
function completeSignup() {

    console.log('Complete Signup button clicked.');
    const email = document.getElementById('email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const organizationId = document.getElementById('organization-id').value;


    if (password !== confirmPassword) {
        // Passwords do not match
        document.getElementById('password-mismatch-msg').textContent = "Passwords do not match.";
        return;
    }

    const query = 'INSERT INTO users_table (email, password, organization_id) VALUES (?, ?, ?)';
    const values = [email, password, organizationId];

    db.query(query, values)
        .then(([results]) => {
            console.log('Signup Successful', results);
            document.getElementById('password-mismatch-msg').textContent = "";
        })
        .catch((error) => {
            console.error('Signup Error', error.message);
            document.getElementById('password-mismatch-msg').textContent = "Error during signup.";
        });

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Handle successful signup
            console.log('Signup Successful', userCredential.user);
            // Reset the error message if signup is successful
            document.getElementById('password-mismatch-msg').textContent = "";
        })
        .catch((error) => {
            // Handle signup error
            console.error('Signup Error', error.message);
            // Reset the error message in case of an error
            document.getElementById('password-mismatch-msg').textContent = "";
        });
}


document.getElementById('completeSignupButton').addEventListener('click', completeSignup);

