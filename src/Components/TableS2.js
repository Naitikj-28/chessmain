import React, { useState } from 'react';
import PieRechartComponent from './Piechess';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './CSS/TableS2.css';

function TableS2({ playerData }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const sortedPlayerMatches = playerData.sort((a, b) => b.matches - a.matches);

    const openModal = (player) => {
        setSelectedPlayer(player);
    };

    const closeModal = () => {
        setSelectedPlayer(null);
    };

    const data = selectedPlayer ? {
        labels: ['Wins', 'Losses', 'Draws'],
        datasets: [
            {
                label: 'Matches',
                data: [
                    selectedPlayer.winPercentage || 0,
                    selectedPlayer.LossPercentage || 0,
                    selectedPlayer.drawPercentage || 0
                ],
                backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
                borderWidth: 0.7,
            },
        ],
    } : {};

    const options = {
        scales: {
            x: { max: 100, },
            y: { max: 100, }
        }
    };

    return (
        <>
            <div>
                <h2 style={{ marginTop: '2%' }}>Player Information :</h2>
                <div className="table-s2-container">
                    <div className="table-s2-content">
                        <div className="player-table-container2">
                            <table className="player-table2">
                                <thead>
                                    <tr>
                                        <th>Player</th>
                                        <th>Win Percentage</th>
                                        <th>Loses Percentage</th>
                                        <th>Draw Percentage</th>
                                        <th>Total Matches</th>
                                        <th>Information</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedPlayerMatches.map((playerMatch, index) => (
                                        <tr key={index}>
                                            <td>{playerMatch.player}</td>
                                            <td>{playerMatch.winPercentage ? playerMatch.winPercentage.toFixed(2) + '%' : 'N/A'}</td>
                                            <td>{playerMatch.LossPercentage ? playerMatch.LossPercentage.toFixed(2) + '%' : 'N/A'}</td>
                                            <td>{playerMatch.drawPercentage ? playerMatch.drawPercentage.toFixed(2) + '%' : 'N/A'}</td>
                                            <td>{playerMatch.matches}</td>
                                            <td>
                                                <button onClick={() => openModal(playerMatch)}>Info</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <PieRechartComponent playerData={playerData} />
                </div>
            </div>
            {selectedPlayer && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <button className="close-popup" onClick={closeModal}>&times;</button>
                        <h1 className="player-name">Player : {selectedPlayer.player}</h1>
                        <div className="player-details">
                            <div className="player-stats">
                                <h2>Statistics</h2>
                                <p><strong>Wins:</strong> {selectedPlayer.wins || 0}</p>
                                <p><strong>Losses:</strong> {selectedPlayer.loses || 0}</p>
                                <p><strong>Draws:</strong> {selectedPlayer.draws || 0}</p>
                                <p><strong>Total Matches:</strong> {selectedPlayer.matches || 0}</p>
                                <p><strong>Win Percentage:</strong> {selectedPlayer.winPercentage ? selectedPlayer.winPercentage.toFixed(2) + '%' : 'N/A'}</p>
                                <p><strong>Loss Percentage:</strong> {selectedPlayer.LossPercentage ? selectedPlayer.LossPercentage.toFixed(2) + '%' : 'N/A'}</p>
                                <p><strong>Draw Percentage:</strong> {selectedPlayer.drawPercentage ? selectedPlayer.drawPercentage.toFixed(2) + '%' : 'N/A'}</p>
                            </div>
                            <div className="player-graph">
                                <h2>Progress Report</h2>
                                <Bar data={data} options={options} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TableS2;
