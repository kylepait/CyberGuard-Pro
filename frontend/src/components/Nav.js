import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark top">
            <Link to="/" className="navbar-brand" style={{fontWeight: 'bold', textDecoration: 'none', fontSize: '30px' }}>
            WELCOME TO CYBERGUARD-PRO
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMainMenu" aria-controls="navMainMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div id="navMainMenu" className="navbar-collapse collapse">
                <div className="navbar-nav ml-auto">
                    <Link to='/' className="nav-item nav-link active">Login</Link>
                    <Link to='/signup' className="nav-item nav-link">Signup</Link>
                    <Link to='/trainingModule' className="nav-item nav-link">Training</Link>
                    <Link to='/user-home' className="nav-item nav-link">Home</Link>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
