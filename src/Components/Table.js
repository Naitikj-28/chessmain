import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import TableS2 from './TableS2';
import ChessApp from './Chess1';
import Chess2App from './Chess2';
import './CSS/Table.css';
import TableS3 from './TableS3';
import TableS4 from './TableS4';

function Table() {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [playerData, setPlayerData] = useState([]);
    const [showChessApp, setShowChessApp] = useState(false);
    const [showChess2App, setShowChess2App] = useState(false);
    const { user } = useContext(AuthContext);

    const username = user?.username || '';

    useEffect(() => {
        axios.get('http://192.168.29.3:3001/api/matches')
            // axios.get('http://localhost:3001/api/matches')
            .then(response => {
                setMatches(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the matches!', error);
            });

        axios.get('http://192.168.29.3:3001/api/players')
            // axios.get('http://localhost:3001/api/players')
            .then(response => {
                setPlayerData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the player data!', error);
            });
    }, []);

    const openModal = (match) => {
        setSelectedMatch(match);
    };

    const closeModal = () => {
        setSelectedMatch(null);
    };

    const handleStartGame = () => {
        setShowChessApp(true);
        setShowChess2App(false);
    };

    const handleStartGame2 = () => {
        setShowChess2App(true);
        setShowChessApp(false);
    };

    return (
        <>
            <div className="table-container">
                <div className="table-content">
                    <div className="header">
                        <h5>Welcome <span className='usern'>{username}</span></h5>
                        <div className='buttons'>
                            <button onClick={handleStartGame}>Online Game</button>
                            <button onClick={handleStartGame2}>Over the Board</button></div>
                    </div>
                    {showChessApp ? (
                        <ChessApp />
                    ) : showChess2App ? (
                        <Chess2App />
                    ) : (
                        <>
                            <table className="matches-table1">
                                <thead>
                                    <tr>
                                        <th>Player White</th>
                                        <th>Player Black</th>
                                        <th>Winner</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                            </table>
                            <div className="table-body1">
                                <table>
                                    <tbody>
                                        {matches.length === 0 ? (
                                            [...Array(5)].map((_, index) => (
                                                <tr key={index}>
                                                    <td>&nbsp;</td>
                                                    <td>&nbsp;</td>
                                                    <td>&nbsp;</td>
                                                    <td>&nbsp;</td>
                                                </tr>
                                            ))
                                        ) : (
                                            matches.map((match, index) => (
                                                <tr key={index}>
                                                    <td>{match.playerOne}</td>
                                                    <td>{match.playerTwo}</td>
                                                    <td>{match.winner}</td>
                                                    <td>
                                                        <i
                                                            className="fa-solid fa-folder-open"
                                                            onClick={() => openModal(match)}
                                                        ></i>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <TableS2 playerData={playerData} />
                            <TableS3 playerData={playerData} />
                            <TableS4 playerData={playerData} />
                        </>
                    )}
                </div>
                {selectedMatch && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Match Details</h2>
                            <p><strong>Player 1:</strong> {selectedMatch.playerOne}</p>
                            <p><strong>Player 2:</strong> {selectedMatch.playerTwo}</p>
                            <p><strong>Winner:</strong> {selectedMatch.winner}</p>
                            <p><strong>Description:</strong> {selectedMatch.description}</p>
                            <p><strong>Date:</strong> {new Date(selectedMatch.matchDate).toLocaleDateString()}</p>
                            <button onClick={closeModal}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Table;
