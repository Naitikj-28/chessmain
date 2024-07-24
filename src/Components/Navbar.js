import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';
import './CSS/Navbar.css';

export default function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        playerOne: '',
        playerTwo: '',
        winner: '',
        description: '',
        matchDate: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [showModal]);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        resetFormData();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (isDraw) => {
        const dataToSubmit = {
            ...formData,
            winner: isDraw ? 'Draw' : formData.winner
        };

        fetch('http://192.168.29.9:3001/api/matches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                handleCloseModal();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const resetFormData = () => {
        setFormData({
            playerOne: '',
            playerTwo: '',
            winner: '',
            description: '',
            matchDate: ''
        });
    };

    const handleIconClick = () => {
        navigate('/profile');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <button className="icon-button" onClick={handleIconClick}>
                        <FontAwesomeIcon icon={faAddressCard} className="navbar-icon" />
                    </button>
                    <span className="navbar-brand mx-auto">ChessMASTER</span>
                    <button className="btn btn-primary ms-5" onClick={handleShowModal}>Add Match</button>
                </div>
            </nav>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Match</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="playerOne" className="form-label">Player One (White)</label>
                                        <input type="text" className="form-control" id="playerOne" name="playerOne" value={formData.playerOne} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="playerTwo" className="form-label">Player Two (Black)</label>
                                        <input type="text" className="form-control" id="playerTwo" name="playerTwo" value={formData.playerTwo} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="winner" className="form-label">Winner</label>
                                        <input type="text" className="form-control" id="winner" name="winner" value={formData.winner} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea className="form-control" id="description" name="description" value={formData.description} onChange={handleChange}></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="matchDate" className="form-label">Match Date</label>
                                        <input type="date" className="form-control" id="matchDate" name="matchDate" value={formData.matchDate} onChange={handleChange} />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => handleSubmit(false)} disabled={!formData.winner}>Submit</button>
                                <button type="button" className="btn btn-secondary" onClick={() => handleSubmit(true)} disabled={!!formData.winner}>Draw</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
