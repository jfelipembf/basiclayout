// Pontos por atividade
export const POINTS_PER_KM = 1;
export const POINTS_PER_HOUR = 1;
export const POINTS_PER_WORKOUT = 2;

// Marcos de bônus (milestones)
export const BONUS_MILESTONES = {
  DISTANCE: [ // Valores em km
    { amount: 5, bonus: 10 },
    { amount: 10, bonus: 20 },
    { amount: 25, bonus: 30 },
    { amount: 50, bonus: 40 },
    { amount: 100, bonus: 50 },
    { amount: 200, bonus: 60 },
    { amount: 500, bonus: 70 },
    { amount: 1000, bonus: 80 }
  ],
  TIME: [ // Valores em minutos
    { amount: 60, bonus: 10 },    // 1h
    { amount: 180, bonus: 20 },   // 3h
    { amount: 300, bonus: 30 },   // 5h
    { amount: 600, bonus: 40 },   // 10h
    { amount: 1200, bonus: 50 },  // 20h
    { amount: 1800, bonus: 60 },  // 30h
    { amount: 3000, bonus: 70 },  // 50h
    { amount: 6000, bonus: 80 }   // 100h
  ],
  FREQUENCY: [
    { amount: 5, bonus: 10 },
    { amount: 10, bonus: 20 },
    { amount: 25, bonus: 30 },
    { amount: 50, bonus: 40 },
    { amount: 100, bonus: 50 },
    { amount: 200, bonus: 60 },
    { amount: 365, bonus: 70 },
    { amount: 500, bonus: 80 }
  ]
};

// Definição dos ranks e seus níveis
export const RANKS = {
  IRON: {
    name: 'Iron',
    levels: 3,
    basePoints: 0,
    pointsPerLevel: 30
  },
  BRONZE: {
    name: 'Bronze',
    levels: 3,
    basePoints: 330,
    pointsPerLevel: 40
  },
  SILVER: {
    name: 'Silver',
    levels: 3,
    basePoints: 780,
    pointsPerLevel: 50
  },
  GOLD: {
    name: 'Gold',
    levels: 3,
    basePoints: 1380,
    pointsPerLevel: 60
  },
  DIAMOND: {
    name: 'Diamond',
    levels: 3,
    basePoints: 2160,
    pointsPerLevel: 70
  }
};

// Função para calcular bônus baseado nos marcos
export const calculateBonusPoints = ({ totalDistance, totalTime, frequency }) => {
  let bonusPoints = 0;
  let achievedMilestones = [];

  // Calcula bônus por distância (já em km)
  BONUS_MILESTONES.DISTANCE.forEach(milestone => {
    if (totalDistance >= milestone.amount) {
      bonusPoints += milestone.bonus;
      achievedMilestones.push({
        type: 'distance',
        amount: milestone.amount,
        bonus: milestone.bonus
      });
    }
  });

  // Calcula bônus por tempo (totalTime em minutos)
  BONUS_MILESTONES.TIME.forEach(milestone => {
    if (totalTime >= milestone.amount) {
      bonusPoints += milestone.bonus;
      achievedMilestones.push({
        type: 'time',
        amount: milestone.amount,
        bonus: milestone.bonus
      });
    }
  });

  // Calcula bônus por frequência
  BONUS_MILESTONES.FREQUENCY.forEach(milestone => {
    if (frequency >= milestone.amount) {
      bonusPoints += milestone.bonus;
      achievedMilestones.push({
        type: 'frequency',
        amount: milestone.amount,
        bonus: milestone.bonus
      });
    }
  });

  return {
    bonusPoints,
    achievedMilestones
  };
};

// Função para calcular pontos
export const calculatePoints = ({ totalDistance, totalTime, frequency }) => {
  // Pontos base por distância (1 ponto por km)
  const distancePoints = Math.floor(totalDistance);
  
  // Pontos base por tempo (1 ponto por hora)
  const timePoints = Math.floor(totalTime / 60);
  
  // Pontos base por frequência (2 pontos por treino)
  const frequencyPoints = Math.floor(frequency * 2);

  // Calcula pontos bônus das conquistas
  const { bonusPoints } = calculateBonusPoints({
    totalDistance,
    totalTime,
    frequency
  });

  // Total de pontos
  const totalPoints = distancePoints + timePoints + frequencyPoints + bonusPoints;

  return {
    totalPoints,
    breakdown: {
      distance: distancePoints,
      time: timePoints,
      frequency: frequencyPoints,
      bonus: bonusPoints
    }
  };
};

// Função para determinar o rank atual
export const calculateRank = (points) => {
  let rank = null;
  let level = 1;

  // Encontra o rank atual
  for (const rankKey of Object.keys(RANKS)) {
    const rankInfo = RANKS[rankKey];
    if (points >= rankInfo.basePoints) {
      rank = rankKey;
    } else {
      break;
    }
  }

  if (!rank) {
    rank = 'IRON';
  }

  // Calcula o nível dentro do rank
  const rankInfo = RANKS[rank];
  const pointsInRank = points - rankInfo.basePoints;
  level = Math.min(
    Math.floor(pointsInRank / rankInfo.pointsPerLevel) + 1,
    rankInfo.levels
  );

  // Calcula pontos para o próximo nível
  let pointsToNextLevel = null;
  if (level < rankInfo.levels) {
    pointsToNextLevel = rankInfo.basePoints + (level * rankInfo.pointsPerLevel) - points;
  } else {
    // Se estiver no último nível do rank atual, calcula pontos para o próximo rank
    const ranks = Object.keys(RANKS);
    const currentRankIndex = ranks.indexOf(rank);
    if (currentRankIndex < ranks.length - 1) {
      const nextRank = ranks[currentRankIndex + 1];
      pointsToNextLevel = RANKS[nextRank].basePoints - points;
    }
  }

  return {
    rank,
    level,
    points,
    pointsToNextLevel
  };
};

// Função para determinar o rank atual (mantida para compatibilidade)
export const getCurrentRank = (points) => {
  const rankInfo = calculateRank(points);
  return {
    rank: rankInfo.rank,
    level: rankInfo.level,
    pointsToNextLevel: rankInfo.pointsToNextLevel
  };
};
