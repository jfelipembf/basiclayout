export const POINTS_PER_KM = 3;
export const POINTS_PER_HOUR = 2;
export const POINTS_PER_WORKOUT = 1;

// Marcos de bônus
export const BONUS_MILESTONES = {
  FREQUENCY: [
    { amount: 5, bonus: 3, description: 'Complete 5 treinos' },
    { amount: 10, bonus: 5, description: 'Complete 10 treinos' },
    { amount: 20, bonus: 10, description: 'Complete 20 treinos' },
    { amount: 50, bonus: 25, description: 'Complete 50 treinos' },
    { amount: 100, bonus: 50, description: 'Complete 100 treinos' }
  ],
  TIME: [
    { amount: 5, bonus: 3, description: '5 horas de treino' },
    { amount: 10, bonus: 5, description: '10 horas de treino' },
    { amount: 20, bonus: 10, description: '20 horas de treino' },
    { amount: 50, bonus: 25, description: '50 horas de treino' },
    { amount: 100, bonus: 50, description: '100 horas de treino' }
  ],
  DISTANCE: [
    { amount: 10, bonus: 3, description: 'Percorra 10km' },
    { amount: 25, bonus: 5, description: 'Percorra 25km' },
    { amount: 50, bonus: 10, description: 'Percorra 50km' },
    { amount: 100, bonus: 25, description: 'Percorra 100km' },
    { amount: 200, bonus: 50, description: 'Percorra 200km' }
  ]
};

// Função auxiliar para gerar níveis
const generateLevels = () => {
  const levels = [];
  for (let i = 1; i <= 10; i++) {
    levels.push({
      id: i,
      minPoints: (i - 1) * 40,
      maxPoints: i * 40 - 1
    });
  }
  return levels;
};

export const RANKS = {
  IRON: {
    name: 'Iron',
    icon: 'fa-circle',
    color: '#95a5a6',
    levels: generateLevels()
  },
  BRONZE: {
    name: 'Bronze',
    icon: 'fa-medal',
    color: '#cd7f32',
    levels: generateLevels()
  },
  SILVER: {
    name: 'Silver',
    icon: 'fa-medal',
    color: '#C0C0C0',
    levels: generateLevels()
  },
  GOLD: {
    name: 'Gold',
    icon: 'fa-medal',
    color: '#FFD700',
    levels: generateLevels()
  },
  DIAMOND: {
    name: 'Diamond',
    icon: 'fa-gem',
    color: '#b9f2ff',
    levels: generateLevels()
  }
};

// Função para calcular bônus baseado nos marcos
export const calculateBonusPoints = (stats) => {
  let totalBonus = 0;
  let achievedMilestones = [];

  // Bônus por frequência
  BONUS_MILESTONES.FREQUENCY.forEach(milestone => {
    if (stats.frequency >= milestone.amount) {
      totalBonus += milestone.bonus;
      achievedMilestones.push({
        type: 'frequency',
        ...milestone
      });
    }
  });

  // Bônus por tempo
  BONUS_MILESTONES.TIME.forEach(milestone => {
    if (stats.totalTime >= milestone.amount) {
      totalBonus += milestone.bonus;
      achievedMilestones.push({
        type: 'time',
        ...milestone
      });
    }
  });

  // Bônus por distância
  BONUS_MILESTONES.DISTANCE.forEach(milestone => {
    if (stats.totalDistance >= milestone.amount) {
      totalBonus += milestone.bonus;
      achievedMilestones.push({
        type: 'distance',
        ...milestone
      });
    }
  });

  return {
    bonusPoints: totalBonus,
    milestones: achievedMilestones
  };
};

// Função para calcular pontos
export const calculatePoints = (distanceKm, timeHours, frequency) => {
  const basePoints = (
    distanceKm * POINTS_PER_KM +
    timeHours * POINTS_PER_HOUR +
    frequency * POINTS_PER_WORKOUT
  );

  const { bonusPoints } = calculateBonusPoints({
    totalDistance: distanceKm,
    totalTime: timeHours,
    frequency: frequency
  });

  return basePoints + bonusPoints;
};

// Função para determinar o rank atual
export const getCurrentRank = (totalPoints) => {
  let currentRankPoints = totalPoints;
  const pointsPerRank = 400; // 10 níveis * 40 pontos = 400 pontos por rank

  for (const rank of Object.values(RANKS)) {
    if (currentRankPoints < pointsPerRank) {
      // Encontrar o nível dentro do rank
      for (const level of rank.levels) {
        if (
          currentRankPoints >= level.minPoints &&
          currentRankPoints <= level.maxPoints
        ) {
          return {
            rank: rank.name,
            level: level.id,
            icon: rank.icon,
            color: rank.color,
            currentPoints: currentRankPoints,
            pointsToNextLevel: level.maxPoints - currentRankPoints + 1,
            nextLevelPoints: level.maxPoints + 1,
            totalPointsInRank: pointsPerRank
          };
        }
      }
    }
    currentRankPoints -= pointsPerRank;
  }

  // Se passar de todos os ranks, retorna Diamond 10
  const diamondRank = RANKS.DIAMOND;
  return {
    rank: diamondRank.name,
    level: 10,
    icon: diamondRank.icon,
    color: diamondRank.color,
    currentPoints: totalPoints,
    pointsToNextLevel: 0,
    nextLevelPoints: null,
    totalPointsInRank: pointsPerRank
  };
};
