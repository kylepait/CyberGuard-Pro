import React, { useState } from 'react';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const signup = () => {
        // Add your signup logic here
        console.log('Signup clicked');
        console.log('Email:', email);
        console.log('Password:', password);
    };

    const navigateToLogin = () => {
        window.location.href = 'login.html';
    };

    return (
        <section>
            <div className="container-fluid">
                <h1 className="mt-5">Sign Up for CyberGuard Pro</h1>
                <div id="signup-container">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                    />

                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handlePasswordChange}
                    />

                    <button onClick={signup}>Sign Up</button>
                    <button onClick={navigateToLogin}>Login</button>
                </div>
            </div>
        </section>
    );
}

export default Signup;