import { useGameLoop } from '@/game/useGameLoop';
import MenuScreen from '@/game/MenuScreen';
import GameScreen from '@/game/GameScreen';
import GameOverScreen from '@/game/GameOverScreen';

const Index = () => {
  const {
    gameState,
    fingers,
    score,
    lives,
    level,
    highScore,
    isNewHighScore,
    startGame,
    goToMenu,
    handleTap,
  } = useGameLoop();

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      {gameState === 'menu' && (
        <MenuScreen onStart={startGame} highScore={highScore} />
      )}
      {gameState === 'playing' && (
        <GameScreen
          fingers={fingers}
          score={score}
          lives={lives}
          level={level}
          onTap={handleTap}
        />
      )}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          onRestart={startGame}
          onMenu={goToMenu}
        />
      )}
    </div>
  );
};

export default Index;
