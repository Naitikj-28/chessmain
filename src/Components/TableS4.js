import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/TableS4.css';

function TableS4() {
    const [playerData, setPlayerData] = useState([]);

    useEffect(() => {
        axios.get('http://192.168.29.4:3001/api/players')
            // axios.get('http://localhost:3001/api/players')
            .then(response => {
                const sortedPlayers = response.data.sort((a, b) => b.matches - a.matches);
                setPlayerData(sortedPlayers);
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
            });
    }, []);

    return (
        <div className="table-s4-container">
            <div className="table-s4-content">
                <div className="player-table-container4">
                    <table className="player-table4">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Total Matches</th>
                                <th>Played as White</th>
                                <th>Wins as White</th>
                                <th>Win as White %</th>
                                <th>Played as Black</th>
                                <th>Wins as Black</th>
                                <th>Win as Black %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerData.map((player, index) => (
                                <tr key={index}>
                                    <td>{player.player}</td>
                                    <td>{player.matches}</td>
                                    <td>{player.asPlayerOne}</td>
                                    <td>{player.winsAsPlayerOne}</td>
                                    <td>{player.winPercentageAsPlayerOne.toFixed(2)}%</td>
                                    <td>{player.asPlayerTwo}</td>
                                    <td>{player.winsAsPlayerTwo}</td>
                                    <td>{player.winPercentageAsPlayerTwo.toFixed(2)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TableS4;
