import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';
import Runner from './components/Runner';
import Obstacle from './components/Obstacle';
import Boss from './components/Boss';
import GameBackground from './components/GameBackground';
import UFO from './components/UFO';
import { 
  GAME_CONFIG, 
  generateObstacle, 
  checkCollision, 
  createParticles, 
  updateParticles,
  updateBoss,
  calculateSpeed,
  getObstacleSpawnRate,
  getGroundLevel,
  JUMP_OBSTACLES,
  DIFFICULTY_CONFIGS,
  getJumpForce,
  getGravity
} from './utils/gameUtils';
import StartModal from './components/StartModal';
import GameOverModal from './components/GameOverModal';
import PauseModal from './components/PauseModal';

function App() {
  // Initialize with responsive ground level
  const getInitialGroundLevel = () => getGroundLevel();
  
  // Always get high score from localStorage on mount
  const getHighScore = () => parseInt(localStorage.getItem('corporateRunnerHighScore') || '0');

  const [gameState, setGameState] = useState({
    isRunning: false,
    isGameOver: false,
    score: 0,
    highScore: getHighScore(),
    speed: 1,
    difficulty: 'normal', // easy, normal, expert
    theme: 'day', // day, night
    runner: {
      x: 100,
      y: getInitialGroundLevel() - GAME_CONFIG.runnerHeight,
      isJumping: false,
      isDucking: false,
      velocityY: 0
    },
    obstacles: [],
    particles: [],
    backgroundOffset: 0,
    gameTime: 0,
    bossActive: false,
    lastBossScore: 0
  });

  // UFO state with improved logic
  const [ufo, setUfo] = useState({
    active: false,
    x: -100,
    y: 60,
    isDropping: false,
    dropY: 0,
    dropObstacle: null,
    hasDropped: false,
    cooldown: 0 // Prevent immediate reactivation
  });

  const gameLoopRef = useRef();
  const keysRef = useRef(new Set());
  const lastSpeedIncreaseRef = useRef(0);

  // Touch swipe support for mobile
  const touchStartRef = useRef(null);

  // Prevent mobile scrolling and zooming while keeping touch interactions
  useEffect(() => {
    const preventScroll = (e) => {
      // Only prevent default on the game area, not on modal content
      if (!e.target.closest('.modal-content')) {
        e.preventDefault();
      }
    };

    const preventZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent scrolling and zooming on mobile for game area only
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('gesturestart', preventScroll, { passive: false });
    
    // Set viewport meta for mobile
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

    return () => {
      document.removeEventListener('touchstart', preventZoom);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('gesturestart', preventScroll);
    };
  }, []);

  // Handle window resize to update ground level
  useEffect(() => {
    const handleResize = () => {
      const newGroundLevel = getGroundLevel();
      setGameState(prev => ({
        ...prev,
        runner: {
          ...prev.runner,
          y: prev.runner.isJumping ? prev.runner.y : newGroundLevel - (prev.runner.isDucking ? GAME_CONFIG.duckHeight : GAME_CONFIG.runnerHeight)
        }
      }));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = useCallback((difficulty = 'normal', theme = 'day') => {
    const groundLevel = getGroundLevel();
    setGameState(prev => ({
      ...prev,
      isRunning: true,
      isGameOver: false,
      score: 0,
      speed: DIFFICULTY_CONFIGS[difficulty].baseSpeed,
      difficulty,
      theme,
      runner: {
        x: 100,
        y: groundLevel - GAME_CONFIG.runnerHeight,
        isJumping: false,
        isDucking: false,
        velocityY: 0
      },
      obstacles: [],
      particles: [],
      backgroundOffset: 0,
      gameTime: 0,
      bossActive: false,
      lastBossScore: 0,
      highScore: getHighScore() // Always refresh high score from localStorage
    }));
    
    // Reset UFO state
    setUfo({
      active: false,
      x: -200,
      y: 60,
      isDropping: false,
      dropY: 0,
      dropObstacle: null,
      hasDropped: false,
      cooldown: 0
    });
    
    lastSpeedIncreaseRef.current = 0;
  }, []);

  // Immediate key handling
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase();
    // Pause/resume with spacebar
    if (key === ' ') {
      event.preventDefault();
      setGameState(prev => ({
        ...prev,
        isRunning: !prev.isRunning && !prev.isGameOver ? true : !prev.isRunning ? prev.isRunning : !prev.isRunning ? prev.isRunning : !prev.isRunning
      }));
      return;
    }
    keysRef.current.add(key);
    if ([ 'arrowup', 'arrowdown' ].includes(key)) {
      event.preventDefault();
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    const key = event.key.toLowerCase();
    keysRef.current.delete(key);
  }, []);

  const updateGame = useCallback(() => {
    setGameState(prev => {
      if (!prev.isRunning) return prev;

      const keys = keysRef.current;
      let newRunner = { ...prev.runner };
      
      const groundLevel = getGroundLevel();
      const groundY = groundLevel - GAME_CONFIG.runnerHeight;
      const duckY = groundLevel - GAME_CONFIG.duckHeight;
      
      // Get difficulty-adjusted physics
      const jumpForce = getJumpForce(prev.difficulty);
      const gravity = getGravity(prev.difficulty);
      
      // IMMEDIATE jump response
      const jumpPressed = keys.has('arrowup');
      const duckPressed = keys.has('arrowdown');
      
      // Handle jumping - immediate response with difficulty-adjusted force
      if (jumpPressed && !newRunner.isJumping && !newRunner.isDucking) {
        newRunner.isJumping = true;
        newRunner.velocityY = jumpForce; // Use difficulty-adjusted jump force
      }
      
      // Handle ducking - immediate response (hold to duck)
      if (duckPressed && !newRunner.isJumping) {
        newRunner.isDucking = true;
        newRunner.y = duckY;
      } else if (!duckPressed && !newRunner.isJumping) {
        newRunner.isDucking = false;
        newRunner.y = groundY;
      }
      
      // Apply jump physics with difficulty-adjusted gravity
      if (newRunner.isJumping) {
        newRunner.velocityY += gravity; // Use difficulty-adjusted gravity
        newRunner.y += newRunner.velocityY;
        
        // Land when hitting ground
        if (newRunner.y >= groundY) {
          newRunner.y = groundY;
          newRunner.isJumping = false;
          newRunner.velocityY = 0;
        }
      }
      
      // Calculate new speed based on score and difficulty
      const difficultyConfig = DIFFICULTY_CONFIGS[prev.difficulty];
      const newSpeed = calculateSpeed(prev.score, difficultyConfig);
      
      // Check for speed increase notification
      const speedIncreased = newSpeed > prev.speed;
      if (speedIncreased && newSpeed > lastSpeedIncreaseRef.current) {
        lastSpeedIncreaseRef.current = newSpeed;
      }
      
      // Move obstacles smoothly with balanced speed
      const currentSpeed = GAME_CONFIG.runnerSpeed * newSpeed;
      let newObstacles = prev.obstacles
        .map(obstacle => {
          // Update boss if it exists
          if (obstacle.obstacleType === 'boss') {
            obstacle = updateBoss(obstacle, newRunner.x);
          }
          return { ...obstacle, x: obstacle.x - currentSpeed };
        })
        .filter(obstacle => obstacle.x > -200 && !obstacle.destroyed);

      // Check if boss is active
      const bossActive = newObstacles.some(obs => obs.obstacleType === 'boss');

      // Track last boss score for milestone spawning
      let newLastBossScore = prev.lastBossScore;

      // Spawn obstacles with more conservative rate to ensure playability
      // Don't spawn regular obstacles when boss is active
      if (!bossActive) {
        const lastObstacle = newObstacles[newObstacles.length - 1];
        const minDistance = GAME_CONFIG.minObstacleDistance + (newSpeed - 1) * 20;
        const shouldSpawn = !lastObstacle || (800 - lastObstacle.x > minDistance);
        
        const spawnRate = getObstacleSpawnRate(newSpeed, difficultyConfig);
        if (shouldSpawn && Math.random() < spawnRate) {
          const newObstacle = generateObstacle(800 + Math.random() * 100, prev.score, prev.lastBossScore);
          
          // If a boss was spawned, update the last boss score
          if (newObstacle.obstacleType === 'boss') {
            newLastBossScore = newObstacle.spawnScore;
          }
          
          newObstacles.push(newObstacle);
        }
      }

      // Check collisions
      let collision = false;
      for (const obstacle of newObstacles) {
        if (checkCollision(newRunner, obstacle)) {
          collision = true;
          break;
        }
      }

      if (collision) {
        const newHighScore = Math.max(prev.score, getHighScore());
        localStorage.setItem('corporateRunnerHighScore', newHighScore.toString());
        
        return {
          ...prev,
          isRunning: false,
          isGameOver: true,
          highScore: newHighScore,
          particles: [
            ...prev.particles,
            ...createParticles(newRunner.x + 20, newRunner.y + 30, 15)
          ]
        };
      }

      // Update score (1 point per frame = ~60 points per second)
      let newScore = prev.score + difficultyConfig.scoreMultiplier;
      
      // Bonus points for passing obstacles and destroying bosses
      newObstacles.forEach(obstacle => {
        if (!obstacle.passed && obstacle.x + obstacle.width < newRunner.x) {
          obstacle.passed = true;
          if (obstacle.obstacleType === 'boss') {
            newScore += 100 * difficultyConfig.scoreMultiplier; // Big bonus for defeating boss
          } else if (obstacle.obstacleType === 'duck') {
            newScore += 15 * difficultyConfig.scoreMultiplier; // More points for ducking obstacles
          } else {
            newScore += 10 * difficultyConfig.scoreMultiplier;
          }
        }
      });

      // Update particles
      const newParticles = updateParticles(prev.particles);

      // Update background
      const newBackgroundOffset = (prev.backgroundOffset + currentSpeed) % 2000;

      // Update game time
      const newGameTime = prev.gameTime + 1;

      // Improved UFO logic
      setUfo(ufoPrev => {
        let next = { ...ufoPrev };
        
        // Decrease cooldown
        if (next.cooldown > 0) {
          next.cooldown--;
        }
        
        // Only activate UFO if conditions are met
        if (!ufoPrev.active && next.x <= -100 && next.cooldown <= 0 && !bossActive) {
          // Check if there's enough clear space for a safe drop
          const hasEnoughSpace = newObstacles.length === 0 || 
            newObstacles.every(obs => obs.x > 600 || obs.x < -100);
          
          if (hasEnoughSpace && Math.random() < 0.001) { // Reduced spawn rate
            next.active = true;
            next.x = -100;
            next.y = 60 + Math.random() * 40;
            next.isDropping = false;
            next.dropObstacle = null;
            next.hasDropped = false;
          }
        }
        
        // Move UFO if active
        if (next.active) {
          next.x += 1.5;
          
          // Only drop once per flyby and ensure safe spacing
          if (!next.isDropping && !next.hasDropped && next.x > 300 && next.x < window.innerWidth - 300) {
            const dropX = next.x + 24;
            const dropWidth = 60;
            const safeGap = 200; // Increased safe gap
            
            // Check for clear area around drop zone
            const clear = !newObstacles.some(o => {
              const oLeft = o.x;
              const oRight = o.x + o.width;
              const dropLeft = dropX - safeGap;
              const dropRight = dropX + dropWidth + safeGap;
              
              // Ensure no obstacles within the safe gap
              return (oRight > dropLeft && oLeft < dropRight);
            });
            
            // Also check that the last obstacle is far enough
            const lastObstacle = newObstacles[newObstacles.length - 1];
            const lastObstacleClear = !lastObstacle || 
              (lastObstacle.x + lastObstacle.width < dropX - safeGap) ||
              (lastObstacle.x > dropX + dropWidth + safeGap);
            
            if (clear && lastObstacleClear && Math.random() < 0.015) { // Reduced drop chance
              next.isDropping = true;
              next.hasDropped = true;
              next.dropY = getGroundLevel() - 80;
              
              // Pick a random obstacle to drop (from jump obstacles)
              const keys = Object.keys(JUMP_OBSTACLES);
              const type = keys[Math.floor(Math.random() * keys.length)];
              const config = { ...JUMP_OBSTACLES[type], title: 'UFO DROP' };
              
              next.dropObstacle = {
                id: 'ufo-' + Math.random().toString(36).substr(2, 9),
                x: next.x + 24,
                y: next.y + 48,
                width: config.width,
                height: config.height,
                type,
                config,
                obstacleType: config.type,
                falling: true
              };
            }
          }
          
          // Animate dropped obstacle
          if (next.isDropping && next.dropObstacle) {
            let drop = { ...next.dropObstacle };
            drop.y += 6;
            if (drop.y >= next.dropY) {
              drop.y = next.dropY;
              drop.falling = false;
              
              // Add to obstacles
              setGameState(prev2 => ({
                ...prev2,
                obstacles: [
                  ...prev2.obstacles,
                  { ...drop, x: drop.x, y: drop.y, falling: false }
                ]
              }));
              
              next.isDropping = false;
              next.dropObstacle = null;
            } else {
              next.dropObstacle = drop;
            }
          }
          
          // Remove UFO if off screen
          if (next.x > window.innerWidth + 120) {
            next.active = false;
            next.x = -200;
            next.isDropping = false;
            next.dropObstacle = null;
            next.hasDropped = false;
            next.cooldown = 1800; // 30 second cooldown at 60fps
          }
        }
        
        return next;
      });

      return {
        ...prev,
        runner: newRunner,
        obstacles: newObstacles,
        score: Math.floor(newScore),
        speed: newSpeed,
        particles: newParticles,
        backgroundOffset: newBackgroundOffset,
        gameTime: newGameTime,
        bossActive,
        lastBossScore: newLastBossScore
      };
    });
  }, []);

  // Smooth 60fps game loop
  useEffect(() => {
    if (gameState.isRunning) {
      const gameLoop = () => {
        updateGame();
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      };
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isRunning, updateGame]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Touch swipe support for mobile - only for game area
  useEffect(() => {
    const handleTouchStart = (e) => {
      // Only handle touch on game area, not on modals
      if (e.target.closest('.modal-content')) return;
      
      if (e.touches.length === 1) {
        touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    
    const handleTouchEnd = (e) => {
      // Only handle touch on game area, not on modals
      if (e.target.closest('.modal-content')) return;
      if (!touchStartRef.current) return;
      
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      
      // Only consider vertical swipes
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
        if (dy < 0) {
          // Swipe up: jump
          keysRef.current.add('arrowup');
          setTimeout(() => keysRef.current.delete('arrowup'), 120);
        } else {
          // Swipe down: duck (hold for 400ms)
          keysRef.current.add('arrowdown');
          setTimeout(() => keysRef.current.delete('arrowdown'), 400);
        }
      }
      touchStartRef.current = null;
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Calculate game time in seconds
  const gameTimeSeconds = Math.floor(gameState.gameTime / 60);

  // Show PauseModal if paused (not running, not game over, not start)
  const showPauseModal = !gameState.isRunning && !gameState.isGameOver && gameState.score > 0;

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden game-area" style={{ height: '100vh', height: '100dvh' }}>
      {/* Background */}
      <GameBackground backgroundOffset={gameState.backgroundOffset} theme={gameState.theme} />

      {/* UFO */}
      {ufo.active && (
        <>
          <div
            className="absolute z-40 left-0"
            style={{ left: `${ufo.x + 20}px`, top: `${ufo.y - 28}px`, width: '120px', textAlign: 'center', pointerEvents: 'none' }}
          >
            <span className="bg-black bg-opacity-70 text-cyan-200 px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-cyan-400 animate-pulse">
              BOSS UFO
            </span>
          </div>
          <UFO ufo={ufo} />
        </>
      )}

      {/* UFO Dropped Obstacle (falling) */}
      {ufo.active && ufo.dropObstacle && ufo.dropObstacle.falling && (
        <Obstacle obstacle={ufo.dropObstacle} />
      )}

      {/* Runner */}
      <Runner runner={gameState.runner} />

      {/* Obstacles and Bosses */}
      {gameState.obstacles.map(obstacle => (
        obstacle.obstacleType === 'boss' ? (
          <Boss key={obstacle.id} boss={obstacle} />
        ) : (
          <Obstacle key={obstacle.id} obstacle={obstacle} />
        )
      ))}

      {/* Particles */}
      {gameState.particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none z-30"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.life,
            transform: `scale(${particle.life})`
          }}
        />
      ))}

      {/* UI */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {/* Score Display */}
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg pointer-events-auto text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-600">Score</div>
              <div className="text-lg sm:text-2xl font-bold text-gray-800">{gameState.score}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Trophy size={12} className="text-yellow-500" />
                Best
              </div>
              <div className="text-sm sm:text-xl font-bold text-yellow-600">{gameState.highScore}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 flex items-center gap-1">
                <Zap size={12} className="text-blue-500" />
                Speed
              </div>
              <div className="text-sm sm:text-xl font-bold text-blue-600">{gameState.speed.toFixed(1)}x</div>
            </div>
            {gameState.isRunning && (
              <div className="text-center">
                <div className="text-xs text-gray-600">Time</div>
                <div className="text-sm sm:text-xl font-bold text-green-600">{gameTimeSeconds}s</div>
              </div>
            )}
          </div>
        </div>

        {/* Difficulty indicator */}
        {gameState.isRunning && (
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg pointer-events-auto">
            <div className="text-xs text-gray-600">Difficulty</div>
            <div className="text-sm font-bold capitalize text-purple-600">{gameState.difficulty}</div>
          </div>
        )}

        {/* Boss Warning */}
        {gameState.bossActive && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm sm:text-xl animate-pulse border-4 border-red-400">
              🔥 BOSS BATTLE! DUCK THE BULLETS! 🔥
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!gameState.isRunning && !gameState.isGameOver && gameState.score === 0 && (
          <StartModal highScore={gameState.highScore} onStart={startGame} />
        )}

        {/* Pause Modal */}
        {showPauseModal && (
          <PauseModal onResume={() => startGame(gameState.difficulty, gameState.theme)} />
        )}

        {/* Game Over Screen */}
        {gameState.isGameOver && (
          <GameOverModal
            score={gameState.score}
            highScore={gameState.highScore}
            gameTimeSeconds={gameTimeSeconds}
            speed={gameState.speed}
            difficulty={gameState.difficulty}
            onRestart={() => startGame(gameState.difficulty, gameState.theme)}
          />
        )}
      </div>
    </div>
  );
}

export default App;