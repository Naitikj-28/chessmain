import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faCircleUser, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import './CSS/Profile.css';

function Profile() {
    const [username, setUsername] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.signUpEmail) {
            setUsername(user.username);
            setSignUpEmail(user.signUpEmail);
            setSignUpPassword(user.signUpPassword);

            fetch('http://192.168.29.9:3001/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.signUpEmail }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.username && data.signUpEmail && data.signUpPassword) {
                        setUsername(data.username);
                        setSignUpEmail(data.signUpEmail);
                        setSignUpPassword(data.signUpPassword);
                    } else {
                        console.error('User not found or invalid response');
                    }
                })
                .catch(error => console.error('Error fetching profile data:', error));
        }
    }, [user]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleUpdate = () => {
        fetch('http://192.168.29.9:3001/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: user.signUpEmail, newUsername, newPassword }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
                setUsername(newUsername);
                setSignUpPassword(newPassword);
                handleCloseModal();
            })
            .catch(error => console.error('Error updating profile:', error));
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete your account?')) {
            fetch('http://192.168.29.9:3001/api/profile', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.signUpEmail }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data.message);
                    // Handle logout or redirection after deletion
                })
                .catch(error => console.error('Error deleting profile:', error));
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
        setNewUsername(username);
        setNewPassword(signUpPassword);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!user || !user.signUpEmail) {
        return <div className="profile-container">Please sign in to view your profile.</div>;
    }

    return (
        <div className="profile-container">
            <div className="container mt-5">
                <h2>Profile Information</h2>
                <FontAwesomeIcon icon={faCircleUser} size="8x" className="circle-user-icon" />
                <table className="table table-striped mt-3">
                    <tbody>
                        <tr>
                            <th scope="row">Name</th>
                            <td>{username}</td>
                        </tr>
                        <tr>
                            <th scope="row">Email-ID</th>
                            <td>{signUpEmail}</td>
                        </tr>
                        <tr>
                            <th scope="row">Password</th>
                            <td>
                                {showPassword ? (
                                    <span>{signUpPassword}</span>
                                ) : (
                                    <span>********</span>
                                )}
                                <button className="toggle-password-btn" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="icon-container">
                    <FontAwesomeIcon icon={faPenToSquare} className="action-icon1" onClick={handleOpenModal} />
                    <FontAwesomeIcon icon={faTrash} className="action-icon2" onClick={handleDelete} />
                </div>
            </div>

            {/* Update Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update Profile</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdate}>
                                    <div className="mb-3">
                                        <label htmlFor="newUsername" className="form-label">New Username</label>
                                        <input type="text" className="form-control" id="newUsername" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="newPassword" className="form-label">New Password</label>
                                        <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
