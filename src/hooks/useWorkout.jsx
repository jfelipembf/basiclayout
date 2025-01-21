import { useState, useCallback } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const useWorkout = () => {
  const { db, auth } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWorkoutsByDate = useCallback(async (date) => {
    if (!auth.currentUser || !date) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const userId = auth.currentUser.uid;

      // Primeiro buscar todos os treinos do dia
      const workoutsRef = collection(db, 'workouts');
      const q = query(workoutsRef, where('date', '==', date));
      const querySnapshot = await getDocs(q);
      
      // Se não houver treinos, retornar array vazio
      if (querySnapshot.empty) {
        return [];
      }

      // Buscar progresso do usuário dos dois locais
      const progressRef = doc(db, 'workoutProgress', userId);
      const progressSnap = await getDoc(progressRef);
      const progress = progressSnap.exists() ? progressSnap.data() : {};

      // Mapear os treinos com seus progressos
      const workouts = await Promise.all(
        querySnapshot.docs.map(async (workoutDoc) => {
          const workoutId = workoutDoc.id;
          const workoutData = workoutDoc.data();

          // Tentar buscar da subcoleção do usuário primeiro
          const userWorkoutRef = doc(db, 'users', userId, 'workouts', workoutId);
          const userWorkoutSnap = await getDoc(userWorkoutRef);
          
          // Pegar o progresso da subcoleção do usuário ou da coleção workoutProgress
          const workoutProgress = userWorkoutSnap.exists() 
            ? userWorkoutSnap.data() 
            : progress[workoutId];

          // Se não houver progresso, retornar o treino original
          if (!workoutProgress) {
            return {
              id: workoutId,
              ...workoutData,
              status: 'not_started',
              savedStatus: 'not_started',
              exercises: workoutData.exercises.map(exercise => ({
                ...exercise,
                completed: false
              }))
            };
          }

          // Se houver progresso, combinar os dados
          return {
            id: workoutId,
            ...workoutData,
            status: workoutProgress.status,
            savedStatus: workoutProgress.status,
            exercises: workoutData.exercises.map((exercise, index) => ({
              ...exercise,
              completed: workoutProgress.exercises?.some(e => e.index === index) || false,
              completedAt: workoutProgress.exercises?.find(e => e.index === index)?.completedAt
            }))
          };
        })
      );

      return workouts;
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [db, auth]);

  const updateWorkoutProgress = useCallback(async (workoutId, exercises, status = 'in_progress') => {
    if (!auth.currentUser) {
      toast.error('Você precisa estar logado para salvar seu progresso');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userId = auth.currentUser.uid;
      
      // Referências para os dois locais onde vamos salvar
      const progressRef = doc(db, 'workoutProgress', userId);
      const userWorkoutRef = doc(db, 'users', userId, 'workouts', workoutId);
      
      // Buscar treino original
      const workoutRef = doc(db, 'workouts', workoutId);
      const workoutSnap = await getDoc(workoutRef);
      
      if (!workoutSnap.exists()) {
        throw new Error('Treino não encontrado');
      }

      const originalWorkout = workoutSnap.data();

      // Dados a serem salvos
      const progressData = {
        status,
        exercises,
        updatedAt: serverTimestamp(),
        userId,
        workoutId,
        workoutName: originalWorkout.name,
        workoutDate: originalWorkout.date,
        completedAt: status === 'completed' ? serverTimestamp() : null
      };

      // Buscar progresso atual para manter outros treinos
      const currentProgressSnap = await getDoc(progressRef);
      const currentProgress = currentProgressSnap.exists() ? currentProgressSnap.data() : {};

      // Salvar na coleção workoutProgress
      await setDoc(progressRef, {
        ...currentProgress,
        [workoutId]: progressData
      });

      // Salvar na subcoleção do usuário
      await setDoc(userWorkoutRef, {
        ...progressData,
        // Adicionar dados extras do treino original para referência
        sport: originalWorkout.sport,
        level: originalWorkout.level,
        objective: originalWorkout.objective,
        duration: originalWorkout.duration,
        description: originalWorkout.description
      });

      return progressData;
    } catch (err) {
      console.error('Error updating workout progress:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [db, auth]);

  const finishWorkout = useCallback(async (workoutId, exercises) => {
    if (!auth.currentUser) {
      toast.error('Você precisa estar logado para finalizar o treino');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Atualizar o progresso com status completed
      return await updateWorkoutProgress(workoutId, exercises, 'completed');
    } catch (err) {
      console.error('Error finishing workout:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateWorkoutProgress, auth]);

  return {
    loading,
    error,
    getWorkoutsByDate,
    updateWorkoutProgress,
    finishWorkout
  };
};
