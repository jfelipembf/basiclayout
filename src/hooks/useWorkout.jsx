import { useState, useCallback } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { collection, doc, getDoc, getDocs, query, where, setDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { toast } from 'react-toastify';

export const useWorkout = () => {
  const { db, auth } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para garantir que todos os campos necessários estejam presentes
  const sanitizeExercise = (exercise) => {
    return {
      id: exercise.id || '',
      name: exercise.name || '',
      description: exercise.description || '',
      series: exercise.series || '',
      repetitions: exercise.repetitions || '',
      distance: exercise.distance || '',
      duration: exercise.duration || '',
      material: exercise.material || '',
      intensity: exercise.intensity || '',
      videoUrl: exercise.videoUrl || '',
      completed: Boolean(exercise.completed),
      completedAt: exercise.completedAt || null
    };
  };

  const getWorkoutsByDate = useCallback(async (dateStr) => {
    if (!auth.currentUser) return [];

    try {
      const workouts = new Map(); // Usar Map para evitar duplicatas

      // 1. Primeiro buscar treinos já em progresso
      const progressCollection = collection(db, 'workoutProgress');
      const progressQuery = query(progressCollection, where('userId', '==', auth.currentUser.uid));
      const progressSnapshot = await getDocs(progressQuery);

      // Carregar treinos em progresso
      for (const progressDoc of progressSnapshot.docs) {
        const progressData = progressDoc.data();
        if (progressData.workoutId) {
          const workoutRef = doc(db, 'workouts', progressData.workoutId);
          const workoutDoc = await getDoc(workoutRef);
          
          if (workoutDoc.exists()) {
            const workoutData = workoutDoc.data();
            if (workoutData.date === dateStr) {
              const exercises = workoutData.exercises.map((exercise, index) => {
                const savedExercise = progressData.exercises?.[index] || {};
                return sanitizeExercise({
                  ...exercise,
                  ...savedExercise
                });
              });

              workouts.set(workoutDoc.id, {
                id: workoutDoc.id,
                ...workoutData,
                status: progressData.status || 'in_progress',
                exercises
              });
            }
          }
        }
      }

      // 2. Buscar outros treinos para a data que ainda não estão em progresso
      const workoutsRef = collection(db, 'workouts');
      const workoutsQuery = query(workoutsRef, where('date', '==', dateStr));
      const workoutsSnapshot = await getDocs(workoutsQuery);

      for (const workoutDoc of workoutsSnapshot.docs) {
        // Se já não estiver no Map, adicionar como novo
        if (!workouts.has(workoutDoc.id)) {
          const workoutData = workoutDoc.data();
          workouts.set(workoutDoc.id, {
            id: workoutDoc.id,
            ...workoutData,
            status: 'in_progress',
            exercises: workoutData.exercises.map(exercise => sanitizeExercise(exercise))
          });
        }
      }

      return Array.from(workouts.values());
    } catch (error) {
      console.error('Error getting workouts:', error);
      setError(error.message);
      return [];
    }
  }, [db, auth.currentUser]);

  const updateWorkoutProgress = useCallback(async (workoutId, exercises, status = 'in_progress', silent = false) => {
    if (!auth.currentUser) {
      toast.error('Você precisa estar logado para atualizar o treino');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const batch = writeBatch(db);

      // Garantir que todos os exercícios tenham campos válidos
      const sanitizedExercises = exercises.map(exercise => sanitizeExercise(exercise));

      // Atualizar em workoutProgress
      const progressRef = doc(db, 'workoutProgress', `${auth.currentUser.uid}_${workoutId}`);
      batch.set(progressRef, {
        userId: auth.currentUser.uid,
        workoutId,
        exercises: sanitizedExercises,
        status,
        updatedAt: serverTimestamp()
      });

      // Atualizar na subcoleção do usuário
      const userWorkoutRef = doc(db, `users/${auth.currentUser.uid}/workouts`, workoutId);
      batch.set(userWorkoutRef, {
        exercises: sanitizedExercises,
        status,
        updatedAt: serverTimestamp()
      });

      await batch.commit();
      if (!silent) {
        toast.success('Progresso salvo com sucesso!');
      }
      return true;
    } catch (error) {
      console.error('Error updating workout progress:', error);
      setError(error.message);
      if (!silent) {
        toast.error('Erro ao salvar progresso');
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [db, auth.currentUser]);

  return {
    loading,
    error,
    getWorkoutsByDate,
    updateWorkoutProgress
  };
};
