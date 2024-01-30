import React, { useState } from 'react';

//Hello, this is Mack testing a git push

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const login = () => {
        // Add your login logic here
        console.log('Login clicked');
        console.log('Email:', email);
        console.log('Password:', password);
    };

    const navigateToSignup = () => {
        window.location.href = 'signup.html';
    };

    return (
        <section>
            <div className="container-fluid">
                <h1 className="mt-5">Welcome to CyberGuard Pro</h1>
                <div id="login-container">
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

                    <button onClick={login}>Login</button>
                    <button onClick={navigateToSignup}>Sign Up</button>
                </div>
            </div>
        </section>
    );
}

export default Login;