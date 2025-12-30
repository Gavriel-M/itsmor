interface NetworkLink {
  id: string;
  label: string;
  href: string;
  x: number;
  y: number;
}

interface Particle {
  active: boolean;
  currentX: number;
  currentY: number;
  progress: number;
  speed: number;
  size: number;
  bezierControlOffsetX: number;
  bezierControlOffsetY: number;
  targetX: number;
  targetY: number;
  spiralPhase: number;
}

export const LINKS: NetworkLink[] = [
  {
    id: "linkedin",
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/gavriel-mor/",
    x: -150,
    y: -50,
  },
  {
    id: "github",
    label: "GITHUB",
    href: "https://github.com/Gavriel-M",
    x: 150,
    y: -50,
  },
  {
    id: "readcv",
    label: "READ.CV",
    href: "https://read.cv/itsmor",
    x: 0,
    y: 120,
  },
];

export const TERRACOTTA = "#b85b40";
export const MAX_PARTICLES = 40;
export const PARTICLES_PER_FRAME = 2;
export const PARTICLE_MIN_SPEED = 0.009;
export const PARTICLE_MAX_SPEED = 0.014;
export const PARTICLE_MIN_SIZE = 2;
export const PARTICLE_MAX_SIZE = 4;
export const SPIRAL_FREQUENCY = 3;
export const SPIRAL_AMPLITUDE = 4;
export const LOGO_OPEN_DURATION_MS = 350;

/**
 * Quadratic bezier interpolation for smooth particle movement
 */
export const calculateBezierPoint = (
  interpolationValue: number,
  startPoint: number,
  controlPoint: number,
  endPoint: number
): number => {
  const inverseInterpolation = 1 - interpolationValue;
  return (
    inverseInterpolation * inverseInterpolation * startPoint +
    2 * inverseInterpolation * interpolationValue * controlPoint +
    interpolationValue * interpolationValue * endPoint
  );
};

/**
 * Calculate perpendicular offset for spiral effect
 */
export const calculateSpiralOffset = (
  progress: number,
  spiralPhase: number
): number => {
  return (
    Math.sin(progress * SPIRAL_FREQUENCY * Math.PI * 2 + spiralPhase) *
    SPIRAL_AMPLITUDE
  );
};

/**
 * Create a pool of pre-allocated particle objects
 */
export const createParticlePool = (): Particle[] => {
  const pool: Particle[] = [];
  for (let i = 0; i < MAX_PARTICLES; i++) {
    pool.push({
      active: false,
      currentX: 0,
      currentY: 0,
      progress: 0,
      speed: 0,
      size: 0,
      bezierControlOffsetX: 0,
      bezierControlOffsetY: 0,
      targetX: 0,
      targetY: 0,
      spiralPhase: 0,
    });
  }
  return pool;
};

/**
 * Get an inactive particle from the pool for reuse
 */
export const getInactiveParticle = (pool: Particle[]): Particle | null => {
  return pool.find((particle) => !particle.active) || null;
};

/**
 * Initialize a particle with starting values and direction
 */
export const initializeParticle = (
  pool: Particle[],
  startX: number,
  startY: number,
  destinationX: number,
  destinationY: number
): void => {
  const particle = getInactiveParticle(pool);
  if (!particle) return;

  // Calculate perpendicular offset for bezier control point
  const deltaX = destinationX - startX;
  const deltaY = destinationY - startY;
  const pathLength = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const perpendicularX = -deltaY / pathLength;
  const perpendicularY = deltaX / pathLength;

  // Random offset along perpendicular for path variation
  const offsetMagnitude = (Math.random() - 0.5) * 60;

  particle.active = true;
  particle.currentX = startX;
  particle.currentY = startY;
  particle.progress = 0;
  particle.speed =
    PARTICLE_MIN_SPEED +
    Math.random() * (PARTICLE_MAX_SPEED - PARTICLE_MIN_SPEED);
  particle.size =
    PARTICLE_MIN_SIZE + Math.random() * (PARTICLE_MAX_SIZE - PARTICLE_MIN_SIZE);
  particle.bezierControlOffsetX = perpendicularX * offsetMagnitude;
  particle.bezierControlOffsetY = perpendicularY * offsetMagnitude;
  particle.targetX = destinationX;
  particle.targetY = destinationY;
  particle.spiralPhase = Math.random() * Math.PI * 4;
};
