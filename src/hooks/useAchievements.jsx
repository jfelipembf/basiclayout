import { useState, useEffect } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { collection, doc, getDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { format, startOfWeek, endOfWeek, parseISO, isWithinInterval, subDays } from 'date-fns';
import { ACHIEVEMENTS } from '../utils/achievements';

export const useAchievements = () => {
  const { db, auth } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!auth.currentUser) return;

      try {
        setLoading(true);

        // Buscar dados do usuário
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        const userInfo = userDoc.data()?.info || {};

        // Buscar treinos do mês atual
        const currentDate = new Date();
        const monthId = format(currentDate, 'yyyy-MM');
        const monthStatsRef = doc(db, `users/${auth.currentUser.uid}/monthlyStats/${monthId}`);
        const monthStatsDoc = await getDoc(monthStatsRef);
        const monthStats = monthStatsDoc.data() || {};

        // Buscar treinos da semana atual
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        const workoutsRef = collection(db, `users/${auth.currentUser.uid}/workouts`);
        const weeklyWorkoutsQuery = query(
          workoutsRef,
          where('date', '>=', weekStart.toISOString()),
          where('date', '<=', weekEnd.toISOString())
        );
        const weeklyWorkoutsSnap = await getDocs(weeklyWorkoutsQuery);
        const weeklyWorkouts = weeklyWorkoutsSnap.docs
          .map(doc => doc.data())
          .filter(workout => workout.completed);

        // Calcular sequência atual usando uma abordagem diferente
        const last30Days = subDays(currentDate, 30);
        const recentWorkoutsQuery = query(
          workoutsRef,
          where('date', '>=', last30Days.toISOString()),
          orderBy('date', 'desc')
        );
        const recentWorkoutsSnap = await getDocs(recentWorkoutsQuery);
        const completedWorkouts = recentWorkoutsSnap.docs
          .map(doc => doc.data())
          .filter(workout => workout.completed)
          .map(workout => workout.date)
          .sort((a, b) => parseISO(b) - parseISO(a));

        let currentStreak = 0;
        let previousDate = null;

        for (const date of completedWorkouts) {
          const workoutDate = parseISO(date);
          if (!previousDate || isWithinInterval(workoutDate, { 
            start: startOfWeek(previousDate), 
            end: endOfWeek(previousDate) 
          })) {
            currentStreak++;
            previousDate = workoutDate;
          } else {
            break;
          }
        }

        // Processar conquistas
        const processedAchievements = Object.values(ACHIEVEMENTS).map(achievement => {
          let progress = {
            current: 0,
            total: achievement.requirement
          };

          switch (achievement.type) {
            case 'weekly_frequency':
              progress.current = weeklyWorkouts.length;
              break;
            case 'monthly_frequency':
              progress.current = monthStats.frequency || 0;
              break;
            case 'total_distance':
              progress.current = userInfo.totalDistance || 0;
              break;
            case 'total_time':
              progress.current = userInfo.totalTime || 0;
              break;
            case 'streak':
              progress.current = currentStreak;
              break;
          }

          return {
            ...achievement,
            isCompleted: progress.current >= achievement.requirement,
            progress
          };
        });

        // Ordenar conquistas: primeiro as não completadas mais próximas de serem alcançadas
        const sortedAchievements = processedAchievements.sort((a, b) => {
          if (a.isCompleted === b.isCompleted) {
            if (!a.isCompleted) {
              // Para não completadas, ordenar por progresso percentual
              const aProgress = (a.progress.current / a.progress.total) * 100;
              const bProgress = (b.progress.current / b.progress.total) * 100;
              return bProgress - aProgress;
            }
            // Para completadas, manter ordem original
            return 0;
          }
          // Não completadas vêm primeiro
          return a.isCompleted ? 1 : -1;
        });

        setAchievements(sortedAchievements);
      } catch (error) {
        console.error('Error loading achievements:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [db, auth.currentUser]);

  return {
    loading,
    error,
    achievements
  };
};
