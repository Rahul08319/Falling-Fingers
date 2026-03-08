import { useGameLoop } from '@/game/useGameLoop';
import MenuScreen from '@/game/MenuScreen';
import GameScreen from '@/game/GameScreen';
import GameOverScreen from '@/game/GameOverScreen';
import CountdownScreen from '@/game/CountdownScreen';

const Index = () => {
  const {
    gameState,
    fingers,
    score,
    lives,
    level,
    combo,
    maxCombo,
    comboPopups,
    countdown,
    highScore,
    isNewHighScore,
    startGame,
    goToMenu,
    togglePause,
    handleTap,
  } = useGameLoop();

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      {gameState === 'menu' && (
        <MenuScreen onStart={startGame} highScore={highScore} />
      )}
      {gameState === 'countdown' && (
        <CountdownScreen count={countdown} />
      )}
      {(gameState === 'playing' || gameState === 'paused') && (
        <GameScreen
          fingers={fingers}
          score={score}
          lives={lives}
          level={level}
          combo={combo}
          comboPopups={comboPopups}
          isPaused={gameState === 'paused'}
          onTap={handleTap}
          onPause={togglePause}
          onResume={togglePause}
          onMenu={goToMenu}
        />
      )}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          maxCombo={maxCombo}
          onRestart={startGame}
          onMenu={goToMenu}
        />
      )}
    </div>
  );
};

export default Index;
