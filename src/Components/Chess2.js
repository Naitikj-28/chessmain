import './CSS/Chess2.css';
import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import Confetti from 'react-confetti';

function Chess2App() {
    const [game, setGame] = useState(new Chess());
    const [winner, setWinner] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    function safeGameMutate(modify) {
        setGame((g) => {
            const update = { ...g };
            modify(update);
            return update;
        });
    }

    function onDrop(source, target) {
        if (gameOver) return false;

        let move = null;
        safeGameMutate((game) => {
            move = game.move({
                from: source,
                to: target,
                promotion: 'q',
            });
        });

        if (move === null) return false;

        if (game.game_over() || game.in_draw()) {
            setGameOver(true);
            if (game.in_checkmate()) {
                const winner = game.turn() === 'w' ? 'Black' : 'White';
                setWinner(winner);
                setShowConfetti(true);
            } else {
                setWinner('Draw');
            }
        }

        return true;
    }

    function undoLastMove() {
        safeGameMutate((game) => {
            game.undo();
        });
        setGameOver(false);
        setWinner(null);
        setShowConfetti(false);
    }

    function restartGame() {
        setGame(new Chess());
        setGameOver(false);
        setWinner(null);
        setShowConfetti(false);
    }

    function surrender(player) {
        const winningPlayer = player === 'white' ? 'Black' : 'White';
        setWinner(winningPlayer);
        setGameOver(true);
        setShowConfetti(true);
    }

    useEffect(() => {
        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                restartGame();
            }
        }
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    return (
        <div className="app">
            {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <div className="header">
                <div className="game-info">
                    {gameOver && (
                        <div className="game-over">
                            <p>Game Over</p>
                            <p>Winner: {winner}</p>
                            <p>Press Enter to restart</p>
                        </div>
                    )}
                </div>
                <div className="buttons">
                    <button onClick={undoLastMove} disabled={game.history().length === 0 || gameOver}>Undo Last Move</button>
                    <button onClick={restartGame}>Restart Game</button>
                </div>
            </div>
            <div className="chessboard-container">
                <Chessboard position={game.fen()} onPieceDrop={onDrop} />
                <button className="surrender-button white" onClick={() => surrender('white')} disabled={gameOver}>White Surrender</button>
                <button className="surrender-button black" onClick={() => surrender('black')} disabled={gameOver}>Black Surrender</button>
            </div>
        </div>
    );
}

export default Chess2App;

