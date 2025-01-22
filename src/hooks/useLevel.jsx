import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { calculatePoints, getCurrentRank } from '../utils/levels';

export const useLevel = () => {
  const [levelInfo, setLevelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchLevelInfo = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data().info;
          
          // Converter distância de metros para quilômetros
          const distanceKm = userData.totalDistance / 1000;
          
          // Converter tempo de minutos para horas
          const timeHours = userData.totalTime / 60;
          
          // Calcular pontos totais
          const totalPoints = calculatePoints(
            distanceKm,
            timeHours,
            userData.frequency
          );

          // Obter informações do rank atual
          const rankInfo = getCurrentRank(totalPoints);

          setLevelInfo({
            ...rankInfo,
            totalPoints,
            stats: {
              distance: distanceKm,
              time: timeHours,
              frequency: userData.frequency
            }
          });
        }
      } catch (error) {
        console.error('Erro ao buscar informações de nível:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelInfo();
  }, [auth.currentUser]);

  return { levelInfo, loading };
};
