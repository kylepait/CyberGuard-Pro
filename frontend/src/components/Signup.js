import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Signup() {
    return(
        
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Signup</h2>
                <form action="">
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input type='email' placeholder='Enter Email' className='form-control rounded 0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='username'><strong>Username</strong></label>
                        <input type='username' placeholder='Enter Username' className='form-control rounded 0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input type='password' placeholder='Enter Password'className='form-control rounded 0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='org_id'><strong>Organization ID</strong></label>
                        <input type='org_id' placeholder='Enter Organization ID' className='form-control rounded 0'/>
                    </div>
                    <button className='btn btn-success w-100 rounded 0'><strong>Sign Up</strong></button>
                    <p></p>
                    <Link to='/' className='btn btn-default border w-100 bg-light rounded 0 text-decoration-none'>Log In</Link>
                </form>
            </div>
        </div>
    )  
}


/** 
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
*/
export default Signup;