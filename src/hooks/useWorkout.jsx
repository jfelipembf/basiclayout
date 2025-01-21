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
    setLoading(true);
    setError(null);

    try {
      const timestamp = Timestamp.now();
      const workout = {
        ...workoutData,
        userId: user?.uid || '',
        createdAt: timestamp,
        updatedAt: timestamp
      };

      const docRef = await addDoc(workoutsRef, workout);
      return docRef.id;
    } catch (err) {
      console.error('Error in addWorkout:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, workoutsRef]);

  // Busca estatísticas do mês atual e anterior
  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);

      const workoutsQuery = query(
        workoutsRef,
        where('userId', '==', user?.uid || ''),
        where('createdAt', '>=', firstDayOfPreviousMonth),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(workoutsQuery);
      const workouts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const currentMonthWorkouts = workouts.filter(workout => 
        workout.createdAt.toDate() >= firstDayOfMonth
      );

      const previousMonthWorkouts = workouts.filter(workout => 
        workout.createdAt.toDate() >= firstDayOfPreviousMonth && 
        workout.createdAt.toDate() < firstDayOfMonth
      );

      return {
        currentMonth: {
          total: currentMonthWorkouts.length,
          completed: currentMonthWorkouts.filter(w => w.status === 'completed').length,
          inProgress: currentMonthWorkouts.filter(w => w.status === 'in_progress').length
        },
        previousMonth: {
          total: previousMonthWorkouts.length,
          completed: previousMonthWorkouts.filter(w => w.status === 'completed').length,
          inProgress: previousMonthWorkouts.filter(w => w.status === 'in_progress').length
        }
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
    setLoading(true);
    setError(null);

    try {
      const workoutsQuery = query(
        workoutsRef,
        where('userId', '==', user?.uid || ''),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(workoutsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
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
