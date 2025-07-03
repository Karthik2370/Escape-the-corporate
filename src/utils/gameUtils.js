export const GAME_CONFIG = {
  gravity: 0.8,
  jumpForce: -18, // Base jump force
  runnerSpeed: 4,
  groundLevelPercent: 75, // Ground at 75% of screen height
  minObstacleDistance: 300,
  jumpHeight: 140, // Increased from 120
  duckHeight: 30,
  runnerWidth: 40,
  runnerHeight: 60
};

// Difficulty configurations
export const DIFFICULTY_CONFIGS = {
  easy: {
    baseSpeed: 0.8,
    speedIncrement: 0.05,
    maxSpeed: 2.0,
    scoreMultiplier: 1,
    obstacleSpawnRate: 0.8,
    speedIncreaseInterval: 300, // Every 300 points
    jumpForceMultiplier: 1.15, // Reduced from 1.3 to 1.15 - less height but still good distance
    gravityMultiplier: 0.9 // Reduced from 0.85 to 0.9 - less hang time but still easier
  },
  normal: {
    baseSpeed: 1.0,
    speedIncrement: 0.1,
    maxSpeed: 2.5,
    scoreMultiplier: 1,
    obstacleSpawnRate: 1.0,
    speedIncreaseInterval: 200, // Every 200 points
    jumpForceMultiplier: 1.0, // Standard jump
    gravityMultiplier: 1.0 // Standard gravity
  },
  expert: {
    baseSpeed: 1.2,
    speedIncrement: 0.15,
    maxSpeed: 3.5,
    scoreMultiplier: 1.5,
    obstacleSpawnRate: 1.3,
    speedIncreaseInterval: 150, // Every 150 points
    jumpForceMultiplier: 0.9, // 10% weaker jump for more challenge
    gravityMultiplier: 1.15 // 15% more gravity for faster fall
  }
};

// Function to get responsive ground level based on screen height
export const getGroundLevel = () => {
  return window.innerHeight * (GAME_CONFIG.groundLevelPercent / 100);
};

// Get difficulty-adjusted jump force
export const getJumpForce = (difficulty) => {
  const config = DIFFICULTY_CONFIGS[difficulty] || DIFFICULTY_CONFIGS.normal;
  return GAME_CONFIG.jumpForce * config.jumpForceMultiplier;
};

// Get difficulty-adjusted gravity
export const getGravity = (difficulty) => {
  const config = DIFFICULTY_CONFIGS[difficulty] || DIFFICULTY_CONFIGS.normal;
  return GAME_CONFIG.gravity * config.gravityMultiplier;
};

export const JUMP_OBSTACLES = {
  meeting: {
    width: 80,
    height: 90,
    color: '#FF4757',
    icon: '👥',
    title: 'MEETING',
    shadow: '#FF3742',
    glow: 'rgba(255, 71, 87, 0.4)',
    priority: 'high',
    type: 'jump',
    shape: 'rect'
  },
  deadline: {
    width: 75,
    height: 80,
    color: '#FF6348',
    icon: '⏰',
    title: 'DEADLINE',
    shadow: '#FF4F37',
    glow: 'rgba(255, 99, 72, 0.4)',
    priority: 'critical',
    type: 'jump',
    shape: 'rect'
  },
  timesheet: {
    width: 70,
    height: 75,
    color: '#1E90FF',
    icon: '📝',
    title: 'TIMESHEET',
    shadow: '#187bcd',
    glow: 'rgba(30, 144, 255, 0.4)',
    priority: 'medium',
    type: 'jump',
    shape: 'rect'
  },
  production: {
    width: 90,
    height: 85,
    color: '#2ED573',
    icon: '💻',
    title: 'PRODUCTION',
    shadow: '#26C65F',
    glow: 'rgba(46, 213, 115, 0.4)',
    priority: 'high',
    type: 'jump',
    shape: 'rect'
  },
  manager: {
    width: 80,
    height: 95,
    color: '#8E44AD',
    icon: '🧑‍💼',
    title: 'MANAGER',
    shadow: '#7D3C98',
    glow: 'rgba(142, 68, 173, 0.4)',
    priority: 'critical',
    type: 'jump',
    shape: 'person'
  },
  teamlead: {
    width: 70,
    height: 90,
    color: '#F39C12',
    icon: '🧑‍💻',
    title: 'TEAM LEAD',
    shadow: '#E67E22',
    glow: 'rgba(243, 156, 18, 0.4)',
    priority: 'high',
    type: 'jump',
    shape: 'person'
  },
  standup: {
    width: 60,
    height: 70,
    color: '#00B894',
    icon: '🎤',
    title: 'STANDUP',
    shadow: '#00997a',
    glow: 'rgba(0, 184, 148, 0.4)',
    priority: 'medium',
    type: 'jump',
    shape: 'circle'
  },
  codereview: {
    width: 65,
    height: 75,
    color: '#636e72',
    icon: '🔍',
    title: 'CODE REVIEW',
    shadow: '#2d3436',
    glow: 'rgba(99, 110, 114, 0.4)',
    priority: 'medium',
    type: 'jump',
    shape: 'rect'
  }
};

export const DUCK_OBSTACLES = {
  hremail: {
    width: 100,
    height: 40,
    color: '#e17055',
    icon: '📩',
    title: 'HR EMAIL',
    shadow: '#d35400',
    glow: 'rgba(225, 112, 85, 0.4)',
    priority: 'medium',
    type: 'duck',
    yOffset: 70,
    shape: 'banner'
  },
  allhands: {
    width: 110,
    height: 45,
    color: '#00b894',
    icon: '📢',
    title: 'ALL-HANDS',
    shadow: '#00997a',
    glow: 'rgba(0, 184, 148, 0.4)',
    priority: 'high',
    type: 'duck',
    yOffset: 80,
    shape: 'banner'
  },
  announcement: {
    width: 90,
    height: 35,
    color: '#fdcb6e',
    icon: '📣',
    title: 'ANNOUNCEMENT',
    shadow: '#e1b12c',
    glow: 'rgba(253, 203, 110, 0.4)',
    priority: 'medium',
    type: 'duck',
    yOffset: 65,
    shape: 'banner'
  },
  feedback: {
    width: 85,
    height: 35,
    color: '#0984e3',
    icon: '💬',
    title: 'FEEDBACK',
    shadow: '#0652dd',
    glow: 'rgba(9, 132, 227, 0.4)',
    priority: 'low',
    type: 'duck',
    yOffset: 60,
    shape: 'circle'
  }
};

// Boss enemy configuration
export const BOSS_CONFIG = {
  width: 120,
  height: 100,
  color: '#8B0000',
  shadow: '#660000',
  glow: 'rgba(139, 0, 0, 0.6)',
  spawnChance: 0.015, // Increased spawn chance
  minScoreToSpawn: 500, // Boss appears after score 500
  shootDuration: 180, // 3 seconds at 60fps
  type: 'boss'
};

// Check if boss should spawn based on score milestones
export const shouldSpawnBoss = (score, lastBossScore = 0) => {
  // Boss spawns at 500, 1000, 1500, 2000, etc. (every 500 points)
  const currentMilestone = Math.floor(score / 500) * 500;
  const lastMilestone = Math.floor(lastBossScore / 500) * 500;
  
  // If we've reached a new milestone and haven't spawned a boss for this milestone
  if (currentMilestone > lastMilestone && currentMilestone >= 500) {
    return Math.random() < 0.3; // 30% chance when milestone is reached
  }
  
  return false;
};

export const generateObstacle = (x, score = 0, lastBossScore = 0) => {
  const groundLevel = getGroundLevel();
  
  // Check if boss should spawn based on score milestones
  if (shouldSpawnBoss(score, lastBossScore)) {
    return {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y: groundLevel - BOSS_CONFIG.height,
      width: BOSS_CONFIG.width,
      height: BOSS_CONFIG.height,
      type: 'devil_boss',
      passed: false,
      config: BOSS_CONFIG,
      obstacleType: 'boss',
      isShooting: false,
      shootTimer: 0,
      bullets: [],
      spawnScore: Math.floor(score / 500) * 500 // Track which milestone this boss represents
    };
  }
  
  // Normal obstacle generation (70% jump, 30% duck)
  const useJumpObstacle = Math.random() < 0.7;
  const obstacleTypes = useJumpObstacle ? JUMP_OBSTACLES : DUCK_OBSTACLES;
  const types = Object.keys(obstacleTypes);
  const type = types[Math.floor(Math.random() * types.length)];
  const config = obstacleTypes[type];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    x,
    y: config.yOffset !== undefined ? groundLevel - config.yOffset : groundLevel - config.height,
    width: config.width,
    height: config.height,
    type,
    passed: false,
    config,
    obstacleType: config.type
  };
};

export const checkCollision = (runner, obstacle) => {
  const margin = 8;
  const runnerWidth = runner.isDucking ? 50 : GAME_CONFIG.runnerWidth;
  const runnerHeight = runner.isDucking ? 30 : GAME_CONFIG.runnerHeight;
  
  // Special collision for boss - runner destroys boss on contact
  if (obstacle.obstacleType === 'boss') {
    const collision = (
      runner.x + runnerWidth - margin > obstacle.x &&
      runner.x + margin < obstacle.x + obstacle.width &&
      runner.y + runnerHeight - margin > obstacle.y &&
      runner.y + margin < obstacle.y + obstacle.height
    );
    
    if (collision) {
      obstacle.destroyed = true;
      return false; // Boss gets destroyed, no game over
    }
    
    // Check bullet collisions
    if (obstacle.bullets) {
      for (const bullet of obstacle.bullets) {
        const bulletCollision = (
          runner.x + runnerWidth - margin > bullet.x &&
          runner.x + margin < bullet.x + bullet.width &&
          runner.y + runnerHeight - margin > bullet.y &&
          runner.y + margin < bullet.y + bullet.height
        );
        
        if (bulletCollision && !runner.isDucking) {
          return true; // Game over if hit by bullet while not ducking
        }
      }
    }
    
    return false;
  }
  
  // Normal collision detection
  return (
    runner.x + runnerWidth - margin > obstacle.x &&
    runner.x + margin < obstacle.x + obstacle.width &&
    runner.y + runnerHeight - margin > obstacle.y &&
    runner.y + margin < obstacle.y + obstacle.height
  );
};

export const updateBoss = (boss, runnerX) => {
  if (boss.destroyed) return boss;
  
  // Start shooting when runner gets close
  const distanceToRunner = boss.x - runnerX;
  if (distanceToRunner < 400 && distanceToRunner > 0 && !boss.isShooting) {
    boss.isShooting = true;
    boss.shootTimer = BOSS_CONFIG.shootDuration;
  }
  
  // Update shooting
  if (boss.isShooting && boss.shootTimer > 0) {
    boss.shootTimer--;
    
    // Spawn bullets every 20 frames (3 bullets per second)
    if (boss.shootTimer % 20 === 0) {
      if (!boss.bullets) boss.bullets = [];
      boss.bullets.push({
        id: Math.random().toString(36).substr(2, 9),
        x: boss.x - 10,
        y: boss.y + boss.height - 24,
        width: 8,
        height: 4,
        velocityX: -8
      });
    }
    
    if (boss.shootTimer <= 0) {
      boss.isShooting = false;
    }
  }
  
  // Update bullets
  if (boss.bullets) {
    boss.bullets = boss.bullets
      .map(bullet => ({
        ...bullet,
        x: bullet.x + bullet.velocityX
      }))
      .filter(bullet => bullet.x > -50); // Remove bullets that went off screen
  }
  
  return boss;
};

export const createParticles = (x, y, count = 12) => {
  const particles = [];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD93D'];
  
  for (let i = 0; i < count; i++) {
    particles.push({
      id: Math.random().toString(36).substr(2, 9),
      x: x + Math.random() * 40 - 20,
      y: y + Math.random() * 40 - 20,
      velocityX: (Math.random() - 0.5) * 10,
      velocityY: Math.random() * -8 - 3,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 3
    });
  }
  return particles;
};

export const updateParticles = (particles) => {
  return particles
    .map(particle => ({
      ...particle,
      x: particle.x + particle.velocityX,
      y: particle.y + particle.velocityY,
      velocityY: particle.velocityY + 0.5,
      life: particle.life - 0.025,
      size: particle.size * 0.97
    }))
    .filter(particle => particle.life > 0);
};

// Speed progression based on difficulty
export const calculateSpeed = (score, difficultyConfig) => {
  const { baseSpeed, speedIncrement, maxSpeed, speedIncreaseInterval } = difficultyConfig;
  
  // Increase speed based on difficulty interval
  const speedLevel = Math.floor(score / speedIncreaseInterval);
  const newSpeed = baseSpeed + (speedLevel * speedIncrement);
  
  return Math.min(newSpeed, maxSpeed);
};

// Obstacle spawn rate based on difficulty
export const getObstacleSpawnRate = (speed, difficultyConfig) => {
  const baseRate = 0.025 * difficultyConfig.obstacleSpawnRate;
  const speedMultiplier = 1 + (speed - 1) * 0.3;
  return baseRate * speedMultiplier;
};