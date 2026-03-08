import { useGameLoop } from '@/game/useGameLoop';
import MenuScreen from '@/game/MenuScreen';
import GameScreen from '@/game/GameScreen';
import GameOverScreen from '@/game/GameOverScreen';
import CountdownScreen from '@/game/CountdownScreen';
import Leaderboard from '@/game/Leaderboard';

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
    particles,
    screenShake,
    showLeaderboard,
    showInitials,
    music,
    startGame,
    goToMenu,
    togglePause,
    handleTap,
    removeParticle,
    submitInitials,
    setShowLeaderboard,
  } = useGameLoop();

  if (showLeaderboard) {
    return (
      <div className="w-full h-screen overflow-hidden bg-background">
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      {gameState === 'menu' && (
        <MenuScreen
          onStart={startGame}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          highScore={highScore}
        />
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
          particles={particles}
          isPaused={gameState === 'paused'}
          screenShake={screenShake}
          isMuted={music.isMuted}
          onTap={handleTap}
          onPause={togglePause}
          onResume={togglePause}
          onMenu={goToMenu}
          onRemoveParticle={removeParticle}
          onToggleMute={music.toggleMute}
        />
      )}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          maxCombo={maxCombo}
          showInitials={showInitials}
          onRestart={startGame}
          onMenu={goToMenu}
          onSubmitInitials={submitInitials}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
      )}
    </div>
  );
};

export default Index;
