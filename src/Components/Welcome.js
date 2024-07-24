import React, { useEffect, useState } from 'react';
import './CSS/Welcome.css';

function Welcome({ username }) {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`welcome-container ${fadeOut ? 'fade-out' : ''}`}>
            <img src={require('./chess2.jpg')} alt="Chess" />
            <div className={`next-page ${fadeOut ? 'slide-in' : ''}`}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '20%', textAlign: 'center' }}>
                    <h1 style={{ backgroundColor: '#FF671F', color: 'blue' }}>Welcome </h1>
                    <h1 style={{ backgroundColor: '#046A38', color: 'white' }}>{username}</h1>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
