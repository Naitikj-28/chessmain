import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import axios from 'axios';
import './CSS/Piechess.css';

const PieRechartComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // const response = await axios.get('http://localhost:3001/api/players');
            const response = await axios.get('http://192.168.29.4:3001/api/players');
            const playerWins = response.data;

            if (playerWins.length > 0) {
                const transformedData = playerWins.map((playermatch, index) => ({
                    name: playermatch.player,
                    value: playermatch.wins
                }));
                setData(transformedData);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const colors = ['#FFC107', '#FF5722', '#E91E63', '#673AB7', '#2196F3', '#009688', '#4CAF50', '#FF9800', '#9C27B0', '#FF5252', '#3F51B5', '#FFEB3B', '#00BCD4', '#8BC34A', '#FF5722', '#607D8B'];

    const totalMatches = data.reduce((total, playerData) => total + playerData.value, 0);
    const isEmpty = totalMatches === 0;

    return (
        <div className={`chart-container ${isEmpty ? 'empty' : ''}`}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <PieChart width={350} height={350} className="responsive-chart">
                    <Pie
                        data={isEmpty ? [{ name: 'No Matches', value: 0 }] : data}
                        cx="50%"
                        cy="54%"
                        innerRadius={isEmpty ? 0 : 100}
                        outerRadius={isEmpty ? 80 : 160}
                        fill={isEmpty ? '#ffeecc' : '#8884d8'}
                        dataKey="value"
                        paddingAngle={2}
                        labelLine={false}
                    >
                        {!isEmpty && data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            )}
        </div>
    );
};

export default PieRechartComponent;
