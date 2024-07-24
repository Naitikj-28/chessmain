import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CSS/TableS3.css';

function TableS3() {
    const [playerData, setPlayerData] = useState([]);

    useEffect(() => {
        axios.get('http://192.168.29.9:3001/api/players')
            .then(response => {
                const sortedPlayers = response.data.sort((a, b) => b.matches - a.matches);
                setPlayerData(sortedPlayers);
            })
            .catch(error => {
                console.error('Error fetching player data:', error);
            });
    }, []);

    return (
        <div className="table-s3-container">
            <div className="table-s3-content">
                <div className="player-table-container3">
                    <table className="player-table3">
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Wins</th>
                                <th>Draws </th>
                                <th>Loses</th>
                                <th>Total Matches</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerData.map((player, index) => (
                                <tr key={index}>
                                    <td>{player.player}</td>
                                    <td>{player.wins}</td>
                                    <td>{player.draws}</td>
                                    <td>{player.loses}</td>
                                    <td>{player.matches}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TableS3;
