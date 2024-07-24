const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const path = require('path');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, "api.json");
const signFilePath = path.join(__dirname, "sign.json");

app.get('/', (req, res) => {
    res.send('Hello Admin');
});

app.post('/api/matches', (req, res) => {
    const newMatch = { ...req.body, id: uuidv4() };

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let matches = [];
        if (data) {
            matches = JSON.parse(data);
        }

        matches.push(newMatch);

        fs.writeFile(dataFilePath, JSON.stringify(matches, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(201).json(newMatch);
        });
    });
});

app.get('/api/matches', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let matches = [];
        if (data) {
            matches = JSON.parse(data);
        }

        res.status(200).json(matches);
    });
});



app.post('/api/signup', (req, res) => {
    const newUser = req.body;

    fs.readFile(signFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        users.push(newUser);

        fs.writeFile(signFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(201).json(newUser);
        });
    });
});

app.post('/api/signin', (req, res) => {
    const { signInEmail, signInPassword } = req.body;

    fs.readFile(signFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const user = users.find(user => user.signUpEmail === signInEmail && user.signUpPassword === signInPassword);

        if (user) {
            res.status(200).json({ message: 'Sign-in successful', username: user.username, signUpEmail: user.signUpEmail, signUpPassword: user.signUpPassword });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});

app.delete('/api/matches/:id', (req, res) => {
    const matchId = req.params.id;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let matches = [];
        if (data) {
            matches = JSON.parse(data);
        }

        const updatedMatches = matches.filter(match => match.id !== matchId);

        fs.writeFile(dataFilePath, JSON.stringify(updatedMatches, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({ message: 'Match deleted successfully' });
        });
    });
});

app.get('/api/matches/:id', (req, res) => {
    const matchId = req.params.id;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let matches = [];
        if (data) {
            matches = JSON.parse(data);
        }

        const match = matches.find(m => m.id === matchId);

        if (match) {
            res.status(200).json(match);
        } else {
            res.status(404).json({ error: 'Match not found' });
        }
    });
});

app.get('/api/players', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let matches = [];
        if (data) {
            matches = JSON.parse(data);
        }

        const players = {};

        matches.forEach(match => {
            players[match.playerOne] = players[match.playerOne] || { wins: 0, loses: 0, matches: 0, draws: 0, asPlayerOne: 0, asPlayerTwo: 0, winsAsPlayerOne: 0, winsAsPlayerTwo: 0 };
            players[match.playerTwo] = players[match.playerTwo] || { wins: 0, loses: 0, matches: 0, draws: 0, asPlayerOne: 0, asPlayerTwo: 0, winsAsPlayerOne: 0, winsAsPlayerTwo: 0 };

            players[match.playerOne].matches++;
            players[match.playerTwo].matches++;

            players[match.playerOne].asPlayerOne++;
            players[match.playerTwo].asPlayerTwo++;

            if (match.winner !== 'Draw') {
                if (match.winner === match.playerOne) {
                    players[match.playerOne].wins++;
                    players[match.playerOne].winsAsPlayerOne++;
                    players[match.playerTwo].loses++;
                } else {
                    players[match.playerTwo].wins++;
                    players[match.playerTwo].winsAsPlayerTwo++;
                    players[match.playerOne].loses++;
                }
            } else {
                players[match.playerOne].draws++;
                players[match.playerTwo].draws++;
            }
        });

        const playerData = Object.keys(players).map(player => {
            const { wins, loses, draws, matches, asPlayerOne, asPlayerTwo, winsAsPlayerOne, winsAsPlayerTwo } = players[player];
            const winPercentage = matches > 0 ? (wins / matches) * 100 : 0;
            const LossPercentage = matches > 0 ? (loses / matches) * 100 : 0;
            const drawPercentage = matches > 0 ? (draws / matches) * 100 : 0;
            const winPercentageAsPlayerOne = asPlayerOne > 0 ? (winsAsPlayerOne / asPlayerOne) * 100 : 0;
            const winPercentageAsPlayerTwo = asPlayerTwo > 0 ? (winsAsPlayerTwo / asPlayerTwo) * 100 : 0;

            return {
                player,
                wins,
                loses,
                draws,
                matches,
                winPercentage,
                LossPercentage,
                drawPercentage,
                asPlayerOne,
                winsAsPlayerOne,
                winPercentageAsPlayerOne,
                asPlayerTwo,
                winsAsPlayerTwo,
                winPercentageAsPlayerTwo,
            };
        });

        res.status(200).json(playerData);
    });
});



// PUT endpoint to update an existing match
app.put('/api/matches/:id', (req, res) => {
    const matchId = req.params.id;
    const updatedMatch = req.body;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let matches = [];
        if (data) {
            matches = JSON.parse(data);
        }

        const index = matches.findIndex(match => match.id === matchId);

        if (index !== -1) {
            matches[index] = { ...matches[index], ...updatedMatch };

            fs.writeFile(dataFilePath, JSON.stringify(matches, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.status(200).json({ message: 'Match updated successfully', updatedMatch });
            });
        } else {
            res.status(404).json({ error: 'Match not found' });
        }
    });
});

app.post('/api/profile', (req, res) => {
    const { email } = req.body;

    fs.readFile(signFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const user = users.find(user => user.signUpEmail === email);

        if (user) {
            res.status(200).json({ username: user.username, signUpEmail: user.signUpEmail, signUpPassword: user.signUpPassword });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

app.put('/api/profile', (req, res) => {
    const { email, newUsername, newPassword } = req.body;

    fs.readFile(signFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const userIndex = users.findIndex(user => user.signUpEmail === email);

        if (userIndex !== -1) {
            users[userIndex].username = newUsername;
            users[userIndex].signUpPassword = newPassword;

            fs.writeFile(signFilePath, JSON.stringify(users, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.status(200).json({ message: 'Profile updated successfully' });
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

app.delete('/api/profile', (req, res) => {
    const { email } = req.body;

    fs.readFile(signFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);
        }

        const updatedUsers = users.filter(user => user.signUpEmail !== email);

        if (users.length === updatedUsers.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        fs.writeFile(signFilePath, JSON.stringify(updatedUsers, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.status(200).json({ message: 'Profile deleted successfully' });
        });
    });
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
