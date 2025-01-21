import { useState, useCallback, useMemo } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useUser } from './useUser';

export const useWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useUser();

  // Memoriza a referência da coleção de workouts
  const workoutsRef = useMemo(() => {
    return collection(db, 'workouts');
  }, []);

  // Adiciona um novo treino
  const addWorkout = useCallback(async (workoutData) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const timestamp = Timestamp.now();
      await addDoc(workoutsRef, {
        ...workoutData,
        userId: user.uid,
        createdAt: timestamp
      });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, workoutsRef]);

  // Busca estatísticas do mês atual e anterior
  const getStats = useCallback(async () => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      // Calcula as datas do mês atual
      const now = new Date();
      const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      // Calcula as datas do mês anterior
      const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Busca treinos do mês atual
      const currentMonthQuery = query(
        workoutsRef,
        where('userId', '==', user.uid),
        where('createdAt', '>=', Timestamp.fromDate(startOfCurrentMonth)),
        where('createdAt', '<=', Timestamp.fromDate(endOfCurrentMonth)),
        orderBy('createdAt', 'desc')
      );

      // Busca treinos do mês anterior
      const previousMonthQuery = query(
        workoutsRef,
        where('userId', '==', user.uid),
        where('createdAt', '>=', Timestamp.fromDate(startOfPreviousMonth)),
        where('createdAt', '<=', Timestamp.fromDate(endOfPreviousMonth)),
        orderBy('createdAt', 'desc')
      );

      const [currentMonthSnapshot, previousMonthSnapshot] = await Promise.all([
        getDocs(currentMonthQuery),
        getDocs(previousMonthQuery)
      ]);

      // Processa os treinos do mês atual
      const currentMonthWorkouts = [];
      let currentMonthStats = {
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        workoutCount: 0
      };

      currentMonthSnapshot.forEach(doc => {
        const workout = { id: doc.id, ...doc.data() };
        currentMonthWorkouts.push(workout);
        
        currentMonthStats.totalSets += workout.sets || 0;
        currentMonthStats.totalReps += workout.reps || 0;
        currentMonthStats.totalWeight += workout.weight || 0;
        currentMonthStats.workoutCount += 1;
      });

      // Processa os treinos do mês anterior
      const previousMonthWorkouts = [];
      let previousMonthStats = {
        totalSets: 0,
        totalReps: 0,
        totalWeight: 0,
        workoutCount: 0
      };

      previousMonthSnapshot.forEach(doc => {
        const workout = { id: doc.id, ...doc.data() };
        previousMonthWorkouts.push(workout);
        
        previousMonthStats.totalSets += workout.sets || 0;
        previousMonthStats.totalReps += workout.reps || 0;
        previousMonthStats.totalWeight += workout.weight || 0;
        previousMonthStats.workoutCount += 1;
      });

      // Calcula médias para o mês atual
      if (currentMonthStats.workoutCount > 0) {
        currentMonthStats.avgSets = currentMonthStats.totalSets / currentMonthStats.workoutCount;
        currentMonthStats.avgReps = currentMonthStats.totalReps / currentMonthStats.workoutCount;
        currentMonthStats.avgWeight = currentMonthStats.totalWeight / currentMonthStats.workoutCount;
      }

      // Calcula médias para o mês anterior
      if (previousMonthStats.workoutCount > 0) {
        previousMonthStats.avgSets = previousMonthStats.totalSets / previousMonthStats.workoutCount;
        previousMonthStats.avgReps = previousMonthStats.totalReps / previousMonthStats.workoutCount;
        previousMonthStats.avgWeight = previousMonthStats.totalWeight / previousMonthStats.workoutCount;
      }

      // Calcula o crescimento
      const calculateGrowth = (current, previous) => {
        if (previous === 0) return 0;
        return ((current - previous) / previous) * 100;
      };

      const growth = {
        workouts: calculateGrowth(currentMonthStats.workoutCount, previousMonthStats.workoutCount),
        weight: calculateGrowth(currentMonthStats.avgWeight, previousMonthStats.avgWeight),
        volume: calculateGrowth(
          currentMonthStats.totalSets * currentMonthStats.totalReps,
          previousMonthStats.totalSets * previousMonthStats.totalReps
        )
      };

      return {
        current: currentMonthStats,
        previous: previousMonthStats,
        growth,
        workouts: currentMonthWorkouts,
        lastWorkout: currentMonthWorkouts[0] || null
      };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, workoutsRef]);

  // Busca todos os treinos do usuário
  const getWorkouts = useCallback(async () => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    setError(null);

    try {
      const workoutsQuery = query(
        workoutsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(workoutsQuery);
      const workouts = [];

      querySnapshot.forEach(doc => {
        workouts.push({ id: doc.id, ...doc.data() });
      });

      return workouts;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, workoutsRef]);

  return {
    loading,
    error,
    addWorkout,
    getStats,
    getWorkouts
  };
};
