import { useState, useCallback, useMemo } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useUser } from './useUser';

export const useWorkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [workouts, setWorkouts] = useState([]);
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
        createdBy: user?.uid || '',
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

  // Busca treinos por data
  const getWorkoutsByDate = useCallback(async (date) => {
    setLoading(true);
    setError(null);

    try {
      const workoutsQuery = query(
        workoutsRef,
        where('date', '==', date)
      );

      const querySnapshot = await getDocs(workoutsQuery);
      const workoutsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return workoutsList;
    } catch (err) {
      console.error('Error in getWorkoutsByDate:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workoutsRef]);

  // Busca todas as datas disponíveis
  const getAvailableDates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const workoutsQuery = query(
        workoutsRef,
        orderBy('date', 'desc')
      );

      const querySnapshot = await getDocs(workoutsQuery);
      const dates = querySnapshot.docs
        .map(doc => doc.data().date)
        .filter((date, index, self) => self.indexOf(date) === index);

      return dates;
    } catch (err) {
      console.error('Error in getAvailableDates:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [workoutsRef]);

  return {
    loading,
    error,
    workouts,
    addWorkout,
    getWorkoutsByDate,
    getAvailableDates
  };
};
