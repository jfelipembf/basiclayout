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

  const calculateWorkoutStats = (workout, exercises) => {
    let totalDistance = 0;
    let totalTime = parseInt(workout.duration) || 0;

    exercises.forEach(exercise => {
      if (exercise.completed) {
        // Calcular distância
        if (exercise.distance) {
          const series = parseInt(exercise.series) || 1;
          totalDistance += parseInt(exercise.distance) * series;
        }

        // Calcular tempo
        if (exercise.duration) {
          const series = parseInt(exercise.series) || 1;
          totalTime += parseInt(exercise.duration) * series;
        }
      }
    });

    return { totalDistance, totalTime };
  };

  const updateUserStats = async (userId, workoutStats) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }

      const userData = userDoc.data();
      const currentInfo = userData.info || {};

      // Atualizar todas as estatísticas
      const newInfo = {
        ...currentInfo,
        totalDistance: (currentInfo.totalDistance || 0) + workoutStats.totalDistance,
        totalTime: (currentInfo.totalTime || 0) + workoutStats.totalTime,
        frequency: (currentInfo.frequency || 0) + 1,
        lastWorkoutDate: serverTimestamp()
      };

      // Atualizar no Firestore
      await setDoc(userRef, { info: newInfo }, { merge: true });

      return newInfo;
    } catch (error) {
      console.error('Erro ao atualizar estatísticas:', error);
      throw error;
    }
  };

  const getWorkoutsByDate = useCallback(async (dateStr) => {
    if (!auth.currentUser) return [];

    try {
      // 1. Buscar documento de progresso do usuário
      const progressRef = doc(db, 'workoutProgress', auth.currentUser.uid);
      const progressDoc = await getDoc(progressRef);
      const userProgress = progressDoc.exists() ? progressDoc.data() : { workouts: {} };

      // 2. Buscar treinos da data
      const workoutsRef = collection(db, 'workouts');
      const workoutsQuery = query(workoutsRef, where('date', '==', dateStr));
      const workoutsSnapshot = await getDocs(workoutsQuery);

      const workouts = [];
      for (const workoutDoc of workoutsSnapshot.docs) {
        const workoutData = workoutDoc.data();
        const workoutProgress = userProgress.workouts?.[workoutDoc.id] || {};
        
        const exercises = workoutData.exercises.map((exercise, index) => {
          const exerciseId = exercise.id || `${exercise.name}-${index}`;
          const savedExercise = workoutProgress.exercises?.[exerciseId] || {};
          
          return sanitizeExercise({
            ...exercise,
            ...savedExercise,
            id: exerciseId
          });
        });

        workouts.push({
          id: workoutDoc.id,
          ...workoutData,
          status: workoutProgress.status || 'in_progress',
          exercises
        });
      }

      return workouts;
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
      // Buscar documento atual de progresso
      const progressRef = doc(db, 'workoutProgress', auth.currentUser.uid);
      const progressDoc = await getDoc(progressRef);
      const currentProgress = progressDoc.exists() ? progressDoc.data() : { workouts: {} };

      // Verificar se o treino já foi completado anteriormente
      const previousStatus = currentProgress.workouts?.[workoutId]?.status;
      if (previousStatus === 'completed') {
        toast.info('Este treino já foi finalizado e não pode ser modificado.');
        return false;
      }

      const batch = writeBatch(db);

      // Buscar dados do treino para estatísticas
      const workoutRef = doc(db, 'workouts', workoutId);
      const workoutDoc = await getDoc(workoutRef);
      const workoutData = workoutDoc.exists() ? workoutDoc.data() : {};

      // Garantir que todos os exercícios tenham campos válidos
      const sanitizedExercises = exercises.map(exercise => sanitizeExercise(exercise));

      // Preparar exercícios indexados por ID
      const exercisesById = {};
      sanitizedExercises.forEach(exercise => {
        exercisesById[exercise.id] = {
          ...exercise,
          updatedAt: new Date().toISOString()
        };
      });

      // Atualizar progresso do treino específico
      const updatedProgress = {
        ...currentProgress,
        workouts: {
          ...currentProgress.workouts,
          [workoutId]: {
            status,
            exercises: exercisesById,
            updatedAt: new Date().toISOString()
          }
        },
        lastUpdated: serverTimestamp()
      };

      // Se estiver finalizando o treino, calcular e atualizar estatísticas
      if (status === 'completed') {
        const stats = calculateWorkoutStats(workoutData, sanitizedExercises);
        await updateUserStats(auth.currentUser.uid, stats);
      }

      // Salvar no documento único do usuário
      batch.set(progressRef, updatedProgress);

      // Salvar na subcoleção do usuário
      const userWorkoutRef = doc(db, `users/${auth.currentUser.uid}/workouts`, workoutId);
      batch.set(userWorkoutRef, {
        exercises: sanitizedExercises,
        status,
        updatedAt: serverTimestamp(),
        workoutData: {
          name: workoutData.name,
          description: workoutData.description,
          date: workoutData.date,
          duration: workoutData.duration
        }
      });

      await batch.commit();

      if (!silent) {
        if (status === 'completed') {
          toast.success('Treino finalizado com sucesso!');
        } else {
          toast.success('Progresso salvo com sucesso!');
        }
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
