import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, RotateCcw, Trophy, Zap } from 'lucide-react';
import Runner from './components/Runner';
import Obstacle from './components/Obstacle';
import Boss from './components/Boss';
import GameBackground from './components/GameBackground';
import { 
  GAME_CONFIG, 
  generateObstacle, 
  checkCollision, 
  createParticles, 
  updateParticles,
  updateBoss,
  calculateSpeed,
  getObstacleSpawnRate,
  getGroundLevel
} from './utils/gameUtils';

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

  const gameLoopRef = useRef();
  const keysRef = useRef(new Set());
  const lastSpeedIncreaseRef = useRef(0);

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

  const startGame = useCallback(() => {
    const groundLevel = getGroundLevel();
    setGameState(prev => ({
      ...prev,
      isRunning: true,
      isGameOver: false,
      score: 0,
      speed: 1,
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
    lastSpeedIncreaseRef.current = 0;
  }, []);

  // Immediate key handling
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase();
    keysRef.current.add(key);
    
    if (['arrowup', 'arrowdown', ' '].includes(key)) {
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
      
      // IMMEDIATE jump response
      const jumpPressed = keys.has('arrowup') || keys.has(' ');
      const duckPressed = keys.has('arrowdown');
      
      // Handle jumping - immediate response
      if (jumpPressed && !newRunner.isJumping && !newRunner.isDucking) {
        newRunner.isJumping = true;
        newRunner.velocityY = GAME_CONFIG.jumpForce;
      }
      
      // Handle ducking - immediate response (hold to duck)
      if (duckPressed && !newRunner.isJumping) {
        newRunner.isDucking = true;
        newRunner.y = duckY;
      } else if (!duckPressed && !newRunner.isJumping) {
        newRunner.isDucking = false;
        newRunner.y = groundY;
      }
      
      // Apply jump physics
      if (newRunner.isJumping) {
        newRunner.velocityY += GAME_CONFIG.gravity;
        newRunner.y += newRunner.velocityY;
        
        // Land when hitting ground
        if (newRunner.y >= groundY) {
          newRunner.y = groundY;
          newRunner.isJumping = false;
          newRunner.velocityY = 0;
        }
      }
      
      // Calculate new speed based on score (slower progression)
      const newSpeed = calculateSpeed(prev.score);
      
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
        
        const spawnRate = getObstacleSpawnRate(newSpeed);
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
      let newScore = prev.score + 1;
      
      // Bonus points for passing obstacles and destroying bosses
      newObstacles.forEach(obstacle => {
        if (!obstacle.passed && obstacle.x + obstacle.width < newRunner.x) {
          obstacle.passed = true;
          if (obstacle.obstacleType === 'boss') {
            newScore += 100; // Big bonus for defeating boss
          } else if (obstacle.obstacleType === 'duck') {
            newScore += 15; // More points for ducking obstacles
          } else {
            newScore += 10;
          }
        }
      });

      // Update particles
      const newParticles = updateParticles(prev.particles);

      // Update background
      const newBackgroundOffset = (prev.backgroundOffset + currentSpeed) % 2000;

      // Update game time
      const newGameTime = prev.gameTime + 1;

      return {
        ...prev,
        runner: newRunner,
        obstacles: newObstacles,
        score: newScore,
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

  // Calculate game time in seconds
  const gameTimeSeconds = Math.floor(gameState.gameTime / 60);

  return (
    <div className="w-full h-screen bg-gray-900 relative overflow-hidden select-none">
      {/* Background */}
      <GameBackground backgroundOffset={gameState.backgroundOffset} />

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
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold text-gray-800">{gameState.score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Trophy size={14} className="text-yellow-500" />
                Best
              </div>
              <div className="text-xl font-bold text-yellow-600">{gameState.highScore}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Zap size={14} className="text-blue-500" />
                Speed
              </div>
              <div className="text-xl font-bold text-blue-600">{gameState.speed.toFixed(1)}x</div>
            </div>
            {gameState.isRunning && (
              <div className="text-center">
                <div className="text-sm text-gray-600">Time</div>
                <div className="text-xl font-bold text-green-600">{gameTimeSeconds}s</div>
              </div>
            )}
          </div>
        </div>

        {/* Boss Warning */}
        {gameState.bossActive && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl animate-pulse border-4 border-red-400">
              🔥 BOSS BATTLE! DUCK THE BULLETS! 🔥
            </div>
          </div>
        )}

        {/* Start Screen */}
        {!gameState.isRunning && !gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 pointer-events-auto transition-all duration-300">
            <div
              className="relative rounded-3xl shadow-2xl text-center max-w-md w-full min-w-[320px] border border-blue-200/40 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 overflow-hidden animate-fadeIn"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Top Accent Bar */}
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 h-14 w-full shadow-md">
                <span className="text-3xl">🏃‍♂️</span>
                <span className="text-2xl animate-bounce">💼</span>
              </div>
              {/* Title */}
              <div className="py-4 px-6">
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1 tracking-tight drop-shadow-sm">
                  Corporate Stress
                </h1>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Runner</h2>
                <p className="text-gray-500 dark:text-gray-300 text-base mb-4">Escape the office chaos!</p>
                {/* Quick Instructions */}
                <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl p-4 mb-4 border border-blue-100/60 shadow-sm">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 shadow-sm">
                      <div className="text-xl mb-1">⬆️</div>
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Jump</div>
                      <div className="text-xs text-gray-500">Over obstacles</div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 shadow-sm">
                      <div className="text-xl mb-1">⬇️</div>
                      <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Duck</div>
                      <div className="text-xs text-gray-500">Under threats</div>
                    </div>
                  </div>
                  <div className="mt-2 bg-red-50/80 dark:bg-red-900/40 rounded-xl p-2 border border-red-100/60">
                    <div className="text-red-600 font-bold text-xs mb-1">👹 Boss Battles!</div>
                    <div className="text-red-500 text-xs">Duck bullets, then touch to destroy!</div>
                  </div>
                </div>
                {/* High Score Display */}
                {gameState.highScore > 0 && (
                  <div className="bg-yellow-50/80 dark:bg-yellow-900/40 rounded-xl p-2 mb-4 border border-yellow-200/60 shadow-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="text-yellow-500" size={16} />
                      <span className="text-yellow-700 dark:text-yellow-200 font-bold text-sm">Best Score: {gameState.highScore}</span>
                    </div>
                  </div>
                )}
                {/* Start Button */}
                <button
                  onClick={startGame}
                  className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 mx-auto transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <Play size={20} />
                  <span>Start Running!</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 pointer-events-auto transition-all duration-300">
            <div
              className="relative rounded-2xl shadow-2xl text-center max-w-sm w-full border border-red-200/40 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 overflow-hidden animate-fadeIn"
              style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Top Accent Bar */}
              <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/80 to-orange-500/80 h-12 w-full shadow-md">
                <span className="text-2xl">💥</span>
              </div>
              <div className="py-4 px-6">
                <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-1 tracking-tight drop-shadow-sm">Game Over!</h1>
                <p className="text-base text-gray-600 dark:text-gray-300 mb-2">Corporate stress got you!</p>
                <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-3 mb-4 border border-gray-200/60 shadow-sm">
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600">{gameState.score}</div>
                      <div className="text-xs text-gray-600">Final Score</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">{gameTimeSeconds}s</div>
                      <div className="text-xs text-gray-600">Survival Time</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">{gameState.speed.toFixed(1)}x</div>
                      <div className="text-xs text-gray-600">Max Speed</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-orange-600">{Math.floor(gameState.score / 200)}</div>
                      <div className="text-xs text-gray-600">Speed Levels</div>
                    </div>
                  </div>
                  {gameState.score === gameState.highScore && gameState.score > 0 && (
                    <div className="text-xs text-yellow-600 font-bold mt-2 animate-pulse">🎉 New High Score!</div>
                  )}
                </div>
                <button
                  onClick={startGame}
                  className="mt-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 mx-auto transition-colors text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <RotateCcw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;