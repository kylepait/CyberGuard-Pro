

// Import the functions you need from the SDKs you need


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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

