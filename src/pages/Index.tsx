import { useEffect, useState } from 'react';
import { useGameLoop } from '@/game/useGameLoop';
import MenuScreen from '@/game/MenuScreen';
import GameScreen from '@/game/GameScreen';
import GameOverScreen from '@/game/GameOverScreen';
import CountdownScreen from '@/game/CountdownScreen';
import Leaderboard from '@/game/Leaderboard';
import ThemesScreen from '@/game/ThemesScreen';
import TutorialOverlay, { hasSeenTutorial } from '@/game/TutorialOverlay';
import { applySeasonalAccent, applyTheme, getActiveThemeId } from '@/game/themes';
import AccessibilityScreen from '@/game/AccessibilityScreen';
import AchievementsScreen from '@/game/AchievementsScreen';
import { applyAccessibility, getAccessibility } from '@/game/progression';
import RewardedReviveModal from '@/game/RewardedReviveModal';

const Index = () => {
  const {
    gameState, fingers, score, lives, level, combo, maxCombo, comboPopups,
    countdown, highScore, isNewHighScore, particles, screenShake,
    showLeaderboard, showInitials, difficulty, gameMode, powerUps, floatingPowerUps, missionProgress, bossWave,
    music, isPlayablesReady, isSystemPaused, startGame, goToMenu, togglePause, toggleMute, handleTap, removeParticle,
    submitInitials, setShowLeaderboard, collectPowerUp,
    showReviveModal, handleReviveConfirm, handleReviveDecline,
  } = useGameLoop();

  const [showThemes, setShowThemes] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    if (!isPlayablesReady) return;
    applyTheme(getActiveThemeId());
    applySeasonalAccent();
    applyAccessibility(getAccessibility());
    if (!hasSeenTutorial()) setShowTutorial(true);
  }, [isPlayablesReady]);

  if (!isPlayablesReady) {
    return <div className="playables-viewport bg-background flex items-center justify-center"><span className="font-display text-sm tracking-[0.3em] text-primary animate-pulse">LOADING…</span></div>;
  }

  if (showThemes) {
    return (
      <div className="playables-viewport bg-background">
        <ThemesScreen onClose={() => setShowThemes(false)} highScore={highScore} />
      </div>
    );
  }

  if (showAccessibility) return <div className="playables-viewport bg-background"><AccessibilityScreen onClose={() => setShowAccessibility(false)} /></div>;
  if (showAchievements) return <div className="playables-viewport bg-background"><AchievementsScreen onClose={() => setShowAchievements(false)} /></div>;

  if (showLeaderboard) {
    return (
      <div className="playables-viewport bg-background">
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      </div>
    );
  }

  return (
    <div className="playables-viewport bg-background">
      {gameState === 'menu' && (
        <MenuScreen
          onStart={startGame}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowThemes={() => setShowThemes(true)}
          onShowTutorial={() => setShowTutorial(true)}
          onShowAccessibility={() => setShowAccessibility(true)}
          onShowAchievements={() => setShowAchievements(true)}
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
          isSystemPaused={isSystemPaused}
          screenShake={screenShake}
          isMuted={music.isMuted}
          powerUps={powerUps}
          floatingPowerUps={floatingPowerUps}
          missionProgress={missionProgress}
          bossWave={bossWave}
          gameMode={gameMode}
          onTap={handleTap}
          onPause={togglePause}
          onResume={togglePause}
          onRemoveParticle={removeParticle}
          onToggleMute={toggleMute}
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

      {showReviveModal && (
        <RewardedReviveModal
          score={score}
          onRevive={handleReviveConfirm}
          onDecline={handleReviveDecline}
        />
      )}

      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}
    </div>
  );
};

export default Index;
