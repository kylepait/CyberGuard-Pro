import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import validation from './SignupValidation';


function Signup() {

        const [values, setValues] = useState({
            email: '',
            password: '',
            username: '',
            org_id: '',
            first_name: '',
            last_name: '',
            registration_date: '',
            user_role: ''
        })

        const [errors, setErrors] = useState({})
        const [registrationSuccess, setRegistrationSuccess] = useState(false);


        const handleInput = (event) => {
            setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
        }

        const handleSubmit = async (event) => {
            event.preventDefault();

            setErrors(validation(values));
            if (errors.username === '' && errors.email === '' && errors.password === '') {
                setRegistrationSuccess(true);
                // Configure and make the fetch request
                fetch('http://localhost:4000/Signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: values.username,
                        password: values.password,
                        org_id: values.org_id,
                        email: values.email,
                        first_name: values.first_name,
                        last_name: values.last_name,
                        //registration_date: values.registration_date,
                        user_role: values.user_role


                    }),
                    mode: 'cors', // Set the mode to 'cors'
                })
                    .then((response) => response.json())
                    .then((data) => console.log(data))
                    .catch((error) => console.error('Error:', error));
            }
        };

    return(
        
        <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
            <div className='bg-white p-3 rounded w-25'>
                <h2>Signup</h2>
                {registrationSuccess && (
                    <p className='text-success'>Registration successful! You can now log in.</p>
                )}
                <form action="" onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor='email'><strong>Email</strong></label>
                        <input type='email' placeholder='Enter Email' name='email'
                        onChange={handleInput} className='form-control rounded 0'/>
                        {errors.email && <span className='text-danger'> {errors.email}</span>}

                    </div>
                    <div className='mb-3'>
                        <label htmlFor='username'><strong>Username</strong></label>
                        <input type='username' placeholder='Enter Username' name='username'
                        onChange={handleInput} className='form-control rounded 0'/>
                        {errors.username && <span className='text-danger'> {errors.username}</span>}

                    </div>
                    <div className='mb-3'>
                        <label htmlFor='password'><strong>Password</strong></label>
                        <input type='password' placeholder='Enter Password' name='password'
                        onChange={handleInput} className='form-control rounded 0'/>
                        {errors.password && <span className='text-danger'> {errors.password}</span>}

                    </div>
                    <div className='mb-3'>
                        <label htmlFor='org_id'><strong>Organization ID</strong></label>
                        <input type='org_id' placeholder='Enter Organization ID' name='org_id'
                        onChange={handleInput} className='form-control rounded 0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='first_name'><strong>First Name</strong></label>
                        <input type='first_name' placeholder='First Name' name='first_name'
                        onChange={handleInput} className='form-control rounded 0'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor='last_name'><strong>Last Name</strong></label>
                        <input type='last_name' placeholder='Last Name' name='last_name'
                        onChange={handleInput} className='form-control rounded 0'/>
                    </div>
                    

                    
                    <div className='mb-3'>
                        <label htmlFor='user_role'><strong>Select User Role</strong></label>
                        <select name='user_role' onChange={handleInput} className='form-control rounded-0'>
                            <option value='employee'>Employee</option>
                            <option value='management'>Management</option>
                        </select>
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded 0'><strong>Sign Up</strong></button>
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