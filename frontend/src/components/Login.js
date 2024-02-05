import React, { useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import validation from './LoginValidation';

//Hello, this is Mack testing a git push

function Login() {

    const navigate = useNavigate(); // Initialize useNavigate

        const [values, setValues] = useState({
            email: '',
            password: ''
        })

        const [errors, setErrors] = useState({})
        const [loginSuccess, setLoginSuccess] = useState(false);
        const [loginError, setLoginError] = useState('');



        const handleInput = (event) => {
            setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
        }

        const handleSubmit =  (event) => {
            event.preventDefault();

            setErrors(validation(values));
    
            const loginUser = async () => {
                if (errors.email === '' && errors.password === '') {
                    try {
                        const response = await fetch('http://localhost:4000/Login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(values),
                        });
    
                        const data = await response.json();
    
                        if (response.ok) {
                            // Login successful
                            setLoginSuccess(true);
                            console.log(data.user); // Log the user object to the console
                            localStorage.setItem('user', JSON.stringify(data.user)); // Store the user object in local storage
                            navigate('/user-home');

                        } else {
                            // Login failed
                            console.error(data.error);
                        }
                    } catch (error) {
                        console.error('Error during login:', error);
                    }
                }
            };
    
            loginUser();
        }
        return (
            <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
                <div className='bg-white p-3 rounded w-25'>
                    {loginSuccess ? (
                        <div>
                            <h2>Login Successful!</h2>
                        </div>
                    ) : (
                        <form action="" onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label htmlFor='email'><strong>Email</strong></label>
                                <input type='email' placeholder='Enter Email' name='email' onChange={handleInput} className='form-control rounded 0' />
                                {errors.email && <span className='text-danger'> {errors.email}</span>}
                            </div>
                            <div className='mb-3'>
                                <label htmlFor='password'><strong>Password</strong></label>
                                <input type='password' placeholder='Enter Password' name='password' onChange={handleInput} className='form-control rounded 0' />
                                {errors.password && <span className='text-danger'> {errors.password}</span>}
                            </div>
                            <button type='submit' className='btn btn-success w-100 rounded 0'><strong>Log In</strong></button>
                            {loginError && <p className='text-danger'>{loginError}</p>}
                            <p></p>
                            <Link to='/Signup' className='btn btn-default border w-100 bg-light rounded 0 text-decoration-none'>Create Account</Link>
                        </form>
                    )}
                </div>
            </div>
        );
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