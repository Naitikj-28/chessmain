import './CSS/Chess1.css';
import React, { useState, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import io from 'socket.io-client';
import Confetti from 'react-confetti';

const socket = io('http://192.168.29.9:4000');

function App() {
  const [game, setGame] = useState(new Chess());
  const [pin, setPin] = useState('');
  const [inputPin, setInputPin] = useState('');
  const [isRoomCreator, setIsRoomCreator] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [playerRole, setPlayerRole] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const gameRef = useRef(game);

  useEffect(() => {
    const storedPin = localStorage.getItem('pin');
    const storedGame = localStorage.getItem('game');
    const storedRole = localStorage.getItem('role');

    if (storedPin && storedGame && storedRole) {
      setPin(storedPin);
      const loadedGame = new Chess();
      loadedGame.load(storedGame);
      setGame(loadedGame);
      setPlayerRole(storedRole);
      setIsConnected(true);
      socket.emit('joinRoom', storedPin);
    }

    socket.on('move', (move) => {
      safeGameMutate((game) => {
        if (move === 'undo') {
          game.undo();
        } else if (move === 'restart') {
          game.reset();
        } else {
          game.move(move);
        }
        gameRef.current = game;
      });
      checkGameOver();
    });

    socket.on('roomCreated', (pin) => {
      setPin(pin);
      setIsRoomCreator(true);
      setIsConnected(true);
      localStorage.setItem('pin', pin);
    });

    socket.on('roomJoined', (pin) => {
      setPin(pin);
      setIsConnected(true);
      localStorage.setItem('pin', pin);
    });

    socket.on('invalidPin', () => {
      alert('Invalid PIN. Please try again.');
      clearGameState();
    });

    socket.on('playerRole', (role) => {
      setPlayerRole(role);
      localStorage.setItem('role', role);
    });

    socket.on('opponentJoined', () => {
      setIsConnected(true);
    });

    socket.on('gameOver', (winner) => {
      setWinner(winner);
      setShowConfetti(true);
      setGameOver(true);
    });

    socket.on('disconnect', () => {
      clearGameState();
    });

    return () => {
      socket.off('move');
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('invalidPin');
      socket.off('playerRole');
      socket.off('opponentJoined');
      socket.off('gameOver');
      socket.off('disconnect');
    };
    // eslint-disable-next-line
  }, []);

  const handleCreateRoom = () => {
    clearGameState();
    socket.emit('createRoom');
  };

  const handleJoinRoom = () => {
    clearGameState();
    socket.emit('joinRoom', inputPin);
  };

  const handleMove = (source, target) => {
    if ((game.turn() === 'w' && playerRole !== 'white') || (game.turn() === 'b' && playerRole !== 'black')) {
      return false;
    }
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q',
    });
    if (move === null) return false;
    socket.emit('move', { pin, move });
    safeGameMutate((game) => {
      game.move(move);
    });
    checkGameOver();
    return true;
  };

  const handleUndo = () => {
    socket.emit('undo', { pin });
  };

  const handleRestart = () => {
    socket.emit('restart', { pin });
    safeGameMutate((game) => {
      game.reset();
    });
    setGameOver(false);
    setWinner(null);
    setShowConfetti(false);
  };

  const handleSurrender = () => {
    socket.emit('surrender', { pin, role: playerRole });
  };

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      localStorage.setItem('game', update.fen());
      return update;
    });
  }

  function checkGameOver() {
    if (game.game_over() || game.in_draw()) {
      setGameOver(true);
      if (game.in_checkmate()) {
        const winner = game.turn() === 'w' ? 'Black' : 'White';
        setWinner(winner);
        setShowConfetti(true);
      } else {
        setWinner('Draw');
      }
      socket.emit('gameOver', { pin, winner });
    }
  }

  function clearGameState() {
    setGame(new Chess());
    gameRef.current = new Chess();
    setPin('');
    setIsRoomCreator(false);
    setIsConnected(false);
    setPlayerRole(null);
    setGameOver(false);
    setWinner(null);
    setShowConfetti(false);
    localStorage.removeItem('pin');
    localStorage.removeItem('game');
    localStorage.removeItem('role');
  }

  return (
    <div className="app">
      {!isConnected ? (
        <div className="pin-section">
          <button onClick={handleCreateRoom}>Create Room</button>
          <input
            type="text"
            placeholder="Enter PIN"
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value)}
          />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      ) : (
        <div className="chessboard-container">
          <p>{isRoomCreator ? `Room PIN: ${pin}` : `Joined Room: ${pin}`}</p>
          <p>{playerRole ? `You are playing as ${playerRole}` : 'Waiting for opponent...'}</p>
          <Chessboard position={game.fen()} onPieceDrop={handleMove} />
          <div className="game-buttons">
            <button onClick={handleUndo} disabled={gameOver}>Undo</button>
            <button onClick={handleRestart}>Restart</button>
            <button onClick={handleSurrender} disabled={gameOver}>Surrender</button>
          </div>
          {gameOver && (
            <div className="game-over">
              <p>Game Over</p>
              <p>Winner: {winner}</p>
            </div>
          )}
          <div className='fullscreen-confetti'>
            {showConfetti && <Confetti />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;