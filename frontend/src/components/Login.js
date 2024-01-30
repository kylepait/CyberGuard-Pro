import React, { useState } from 'react';
import { Link } from 'react-router-dom';

//Hello, this is Mack testing a git push

function Login() {
    return(
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
            <h2>Login</h2>

                <form action="">
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input type='email' placeholder='Enter Email' className='form-control rounded 0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input type='password' placeholder='Enter Password'className='form-control rounded 0'/>
                    </div>
                    <button className='btn btn-success w-100 rounded 0'><strong>Log In</strong></button>
                    <p></p>
                    <Link to='/Signup' className='btn btn-default border w-100 bg-light rounded 0 text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
    )
}


/** 
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
*/
export default Login;