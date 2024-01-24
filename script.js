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
function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Handle successful signup
            console.log('Signup Successful', userCredential.user);
        })
        .catch((error) => {
            // Handle signup error
            console.error('Signup Error', error.message);
        });
}
