import { useEffect, useState } from 'react';
import { useGameLoop } from '@/game/useGameLoop';
import MenuScreen from '@/game/MenuScreen';
import GameScreen from '@/game/GameScreen';
import GameOverScreen from '@/game/GameOverScreen';
import CountdownScreen from '@/game/CountdownScreen';
import Leaderboard from '@/game/Leaderboard';
import ThemesScreen from '@/game/ThemesScreen';
import TutorialOverlay, { hasSeenTutorial } from '@/game/TutorialOverlay';
import { applyTheme, getActiveThemeId } from '@/game/themes';

const Index = () => {
  const {
    gameState, fingers, score, lives, level, combo, maxCombo, comboPopups,
    countdown, highScore, isNewHighScore, particles, screenShake,
    showLeaderboard, showInitials, difficulty, gameMode, powerUps, floatingPowerUps,
    music, startGame, goToMenu, togglePause, handleTap, removeParticle,
    submitInitials, setShowLeaderboard, collectPowerUp,
  } = useGameLoop();

  const [showThemes, setShowThemes] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    applyTheme(getActiveThemeId());
    if (!hasSeenTutorial()) setShowTutorial(true);
  }, []);

  if (showThemes) {
    return (
      <div className="w-full h-screen overflow-hidden bg-background">
        <ThemesScreen onClose={() => setShowThemes(false)} highScore={highScore} />
      </div>
    );
  }

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
          onShowThemes={() => setShowThemes(true)}
          onShowTutorial={() => setShowTutorial(true)}
          highScore={highScore}
        />
      )}
      {gameState === 'countdown' && <CountdownScreen count={countdown} />}
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
          powerUps={powerUps}
          floatingPowerUps={floatingPowerUps}
          gameMode={gameMode}
          onTap={handleTap}
          onPause={togglePause}
          onResume={togglePause}
          onMenu={goToMenu}
          onRemoveParticle={removeParticle}
          onToggleMute={music.toggleMute}
          onCollectPowerUp={collectPowerUp}
        />
      )}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={score}
          highScore={highScore}
          isNewHighScore={isNewHighScore}
          maxCombo={maxCombo}
          showInitials={showInitials}
          gameMode={gameMode}
          onRestart={() => startGame(gameMode, difficulty)}
          onMenu={goToMenu}
          onSubmitInitials={submitInitials}
          onShowLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

export default Index;
