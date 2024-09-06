import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CSS/Sign.css';
import Welcome from './Welcome';
import { AuthContext } from './AuthContext';

function Sign({ onSignIn }) {
    const [showSignIn, setShowSignIn] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [signInFormData, setSignInFormData] = useState({ signInEmail: '', signInPassword: '' });
    const [signUpFormData, setSignUpFormData] = useState({ signUpEmail: '', signUpPassword: '', username: '' });
    const [showWelcome, setShowWelcome] = useState(false);
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);

    useEffect(() => {
        const userSignedIn = sessionStorage.getItem('userSignedIn');
        if (userSignedIn) {
            onSignIn();
            navigate('/table');
        }
    }, [navigate, onSignIn]);

    const handleSignInClick = () => {
        setShowSignIn(true);
        setShowSignUp(false);
    };

    const handleSignUpClick = () => {
        setShowSignIn(false);
        setShowSignUp(true);
    };

    const handleSignInChange = (e) => {
        const { name, value } = e.target;
        setSignInFormData({ ...signInFormData, [name]: value.toLowerCase() });
    };

    const handleSignUpChange = (e) => {
        const { name, value } = e.target;
        setSignUpFormData({ ...signUpFormData, [name]: value.toLowerCase() });
    };

    const handleSignInSubmit = (e) => {
        e.preventDefault();
        axios.post('http://192.168.29.3:3001/api/signin', signInFormData)
            // axios.post('http://localhost:3001/api/signin', signInFormData)
            .then(response => {
                console.log(response.data.message);
                sessionStorage.setItem('userSignedIn', 'true');
                setShowWelcome(true);
                login({
                    username: response.data.username,
                    signUpEmail: response.data.signUpEmail,
                    signUpPassword: response.data.signUpPassword,
                });

                setTimeout(() => {
                    onSignIn();
                    navigate('/table');
                }, 3000);
            })
            .catch(error => {
                console.error('Sign-in failed:', error.response.data.error);
                alert('Wrong credentials. Please try again.');
            });
    };

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        axios.post('http://192.168.29.3:3001/api/signup', signUpFormData)
            // axios.post('http://localhost:3001/api/signup', signUpFormData)
            .then(response => {
                console.log('Sign Up Successful:', response.data);
                setShowSignIn(true);
                setShowSignUp(false);
            })
            .catch(error => {
                console.error('There was an error signing up!', error);
            });
    };

    return (
        <>
            {showWelcome ? (
                <Welcome username={user?.username} useremail={user?.useremail} />
            ) : (
                <div className="sign-container">
                    <div className="form-container">
                        <div className="form-content">
                            <h1>Chess Mania</h1>
                            <div className="button-group">
                                <button onClick={handleSignInClick}>Sign In</button>
                                <button onClick={handleSignUpClick}>Sign Up</button>
                            </div>
                            {showSignIn && (
                                <div className="form-section">
                                    <h2 style={{ color: '#ffffff' }}>Sign In</h2>
                                    <form onSubmit={handleSignInSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="signInEmail">Email:</label>
                                            <input type="email" id="signInEmail" name="signInEmail" value={signInFormData.signInEmail} onChange={handleSignInChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="signInPassword">Password:</label>
                                            <input type="password" id="signInPassword" name="signInPassword" value={signInFormData.signInPassword} onChange={handleSignInChange} />
                                        </div>
                                        <button type="submit" className="submit-button">Sign In</button>
                                    </form>
                                </div>
                            )}
                            {showSignUp && (
                                <div className="form-section">
                                    <h2>Sign Up</h2>
                                    <form onSubmit={handleSignUpSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="username">Username:</label>
                                            <input type="text" id="username" name="username" value={signUpFormData.username} onChange={handleSignUpChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="signUpEmail">Email:</label>
                                            <input type="email" id="signUpEmail" name="signUpEmail" value={signUpFormData.signUpEmail} onChange={handleSignUpChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="signUpPassword">Password:</label>
                                            <input type="password" id="signUpPassword" name="signUpPassword" value={signUpFormData.signUpPassword} onChange={handleSignUpChange} />
                                        </div>
                                        <button type="submit" className="submit-button">Sign Up</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Sign;
