const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const rooms = {};

io.on('connection', (socket) => {
    socket.on('createRoom', () => {
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        rooms[pin] = { game: new Chess(), players: [socket.id], turn: 'white', gameOver: false };
        socket.join(pin);
        io.to(socket.id).emit('roomCreated', pin);
    });

    socket.on('joinRoom', (pin) => {
        if (rooms[pin] && rooms[pin].players.length === 1) {
            rooms[pin].players.push(socket.id);
            socket.join(pin);
            io.to(socket.id).emit('roomJoined', pin);
            io.to(rooms[pin].players[0]).emit('opponentJoined');
            rooms[pin].players.forEach((playerId, index) => {
                io.to(playerId).emit('playerRole', index === 0 ? 'white' : 'black');
            });
        } else {
            io.to(socket.id).emit('invalidPin');
        }
    });

    socket.on('move', ({ pin, move }) => {
        if (rooms[pin]) {
            const game = rooms[pin].game;
            game.move(move);
            io.to(pin).emit('move', move);
        }
    });

    socket.on('undo', ({ pin }) => {
        if (rooms[pin]) {
            const game = rooms[pin].game;
            game.undo();
            io.to(pin).emit('move', 'undo');
        }
    });

    socket.on('restart', ({ pin }) => {
        if (rooms[pin]) {
            const game = rooms[pin].game;
            game.reset();
            rooms[pin].gameOver = false;
            io.to(pin).emit('move', 'restart');
        }
    });

    socket.on('surrender', ({ pin, role }) => {
        if (rooms[pin]) {
            const winner = role === 'white' ? 'black' : 'white';
            io.to(pin).emit('gameOver', winner);
            rooms[pin].gameOver = true;
        }
    });

    socket.on('disconnect', () => {
        for (const pin in rooms) {
            const room = rooms[pin];
            const playerIndex = room.players.indexOf(socket.id);
            if (playerIndex !== -1) {
                room.players.splice(playerIndex, 1);
                if (room.players.length === 0) {
                    delete rooms[pin];
                }
            }
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
