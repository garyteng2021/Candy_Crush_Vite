import React, { useRef, useState, useEffect } from 'react';
import GameBoard from './GameBoard';
import GameOverModal from './GameOverModal';
import GameHeader from './GameHeader';
import useTelegram from '../hooks/useTelegram';
import '../styles/game.css';

const GameContainer: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [movesLeft, setMovesLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(true);
  const userId = useTelegram();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!paused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameOver(true);
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current!);
  }, [paused]);

  useEffect(() => {
    if (movesLeft <= 0) {
      setGameOver(true);
    }
  }, [movesLeft]);

  const handleRestart = () => {
    setScore(0);
    setTimeLeft(60);
    setMovesLeft(30);
    setGameOver(false);
    setPaused(false);
  };

  return (
    <div className="game-container">
      <GameHeader
        score={score}
        timeLeft={timeLeft}
        movesLeft={movesLeft}
        paused={paused}
        onTogglePause={() => setPaused(!paused)}
      />

      <GameBoard
        score={score}
        setScore={setScore}
        movesLeft={movesLeft}
        setMovesLeft={setMovesLeft}
        paused={paused}
        setGameOver={setGameOver}
      />

      {gameOver && <GameOverModal score={score} onRestart={handleRestart} />}
    </div>
  );
};

export default GameContainer;
