import { useState, useCallback } from 'react';
import { useFirebase } from '../contexts/FirebaseContext';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  setDoc, 
  serverTimestamp, 
  writeBatch,
  increment,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

export const useWorkout = () => {
  const { db, auth } = useFirebase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Constantes para mensagens de erro/sucesso
  const MESSAGES = {
    AUTH_REQUIRED: 'Você precisa estar logado para atualizar o treino',
    USER_NOT_FOUND: 'Usuário não encontrado',
    WORKOUT_COMPLETED: 'Este treino já foi finalizado e não pode ser modificado.',
    SAVE_SUCCESS: 'Progresso salvo com sucesso!',
    COMPLETE_SUCCESS: 'Treino finalizado com sucesso!',
    SAVE_ERROR: 'Erro ao salvar progresso',
    STATS_ERROR: 'Erro ao atualizar estatísticas'
  };

  // Função para gerar o ID do documento de estatísticas mensais
  const generateMonthlyStatsId = (date) => {
    return format(date, 'yyyy-MM');
  };

  // Função para atualizar estatísticas mensais
  const updateMonthlyStats = async (userId, workoutId, workoutDate, workoutStats) => {
    try {
      const monthId = generateMonthlyStatsId(new Date(workoutDate));
      const statsRef = doc(db, `users/${userId}/monthlyStats/${monthId}`);
      const statsDoc = await getDoc(statsRef);

      // Preparar dados do treino
      const workoutEntry = {
        workoutId,
        date: workoutDate,
        distance: workoutStats.totalDistance,
        time: workoutStats.totalTime,
        frequency: 1
      };

      if (!statsDoc.exists()) {
        // Criar novo documento mensal
        await setDoc(statsRef, {
          monthId,
          year: new Date(workoutDate).getFullYear(),
          month: new Date(workoutDate).getMonth() + 1,
          totalDistance: workoutStats.totalDistance,
          totalTime: workoutStats.totalTime,
          frequency: 1,
          workouts: {
            [workoutId]: workoutEntry
          },
          updatedAt: serverTimestamp()
        });
      } else {
        // Atualizar documento existente
        const currentStats = statsDoc.data();
        const currentWorkouts = currentStats.workouts || {};

        // Se o treino já existe, não contar na frequência
        const isNewWorkout = !currentWorkouts[workoutId];

        await updateDoc(statsRef, {
          totalDistance: increment(workoutStats.totalDistance),
          totalTime: increment(workoutStats.totalTime),
          frequency: increment(isNewWorkout ? 1 : 0),
          [`workouts.${workoutId}`]: workoutEntry,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating monthly stats:', error);
      throw new Error(MESSAGES.STATS_ERROR);
    }
  };

  // Função para garantir que todos os campos necessários estejam presentes
  const sanitizeExercise = (exercise) => {
    console.log('Raw exercise:', exercise);
    const defaultExercise = {
      id: '',
      name: '',
      description: '',
      series: 0,
      repetitions: 0,
      distance: 0,
      duration: 0,
      material: '',
      intensity: '',
      videoUrl: '',
      notes: '',
      restTime: 0,
      timePerSeries: 0,
      technique: '',
      completed: false,
      completedAt: null
    };

    // Garante que nenhum campo seja undefined ou null
    const sanitized = {
      ...defaultExercise,
      ...Object.fromEntries(
        Object.entries(exercise).map(([key, value]) => {
          // Campos que devem ser números
          if (['repetitions', 'series', 'distance', 'duration', 'restTime', 'timePerSeries'].includes(key)) {
            const numValue = Number(value);
            console.log(`Converting ${key}:`, value, 'to:', numValue);
            return [key, isNaN(numValue) ? 0 : numValue];
          }
          return [key, value === undefined || value === null ? '' : value];
        })
      ),
      completed: Boolean(exercise.completed)
    };

    console.log('Sanitized exercise:', sanitized);
    return sanitized;
  };

  const calculateWorkoutStats = (workout, exercises) => {
    let totalDistance = 0;
    let totalTime = parseInt(workout.duration) || 0;

    exercises.forEach(exercise => {
      if (exercise.completed) {
        const series = parseInt(exercise.series) || 1;
        
        if (exercise.distance) {
          totalDistance += parseInt(exercise.distance) * series;
        }

        if (exercise.duration) {
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
        throw new Error(MESSAGES.USER_NOT_FOUND);
      }

      const userData = userDoc.data();
      const currentInfo = userData.info || {};

      const newInfo = {
        ...currentInfo,
        totalDistance: (currentInfo.totalDistance || 0) + workoutStats.totalDistance,
        totalTime: (currentInfo.totalTime || 0) + workoutStats.totalTime,
        frequency: (currentInfo.frequency || 0) + 1,
        lastWorkoutDate: serverTimestamp()
      };

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

      return workoutsSnapshot.docs.map(workoutDoc => {
        const workoutData = workoutDoc.data();
        const workoutProgress = userProgress.workouts?.[workoutDoc.id] || {};
        
        // Ajustar a data para considerar o timezone local
        const adjustedWorkoutData = {
          ...workoutData,
          date: workoutData.date ? new Date(workoutData.date + 'T00:00:00').toISOString().split('T')[0] : null
        };

        const exercises = adjustedWorkoutData.exercises.map((exercise, index) => {
          const exerciseId = exercise.id || `${exercise.name}-${index}`;
          const savedExercise = workoutProgress.exercises?.[exerciseId] || {};
          
          return sanitizeExercise({
            ...exercise,
            ...savedExercise,
            id: exerciseId
          });
        });

        return {
          id: workoutDoc.id,
          ...adjustedWorkoutData,
          status: workoutProgress.status || 'in_progress',
          exercises
        };
      });
    } catch (error) {
      console.error('Error getting workouts:', error);
      setError(error.message);
      return [];
    }
  }, [db, auth.currentUser]);

  const updateWorkoutProgress = useCallback(async (workoutId, exercises, status = 'in_progress', silent = false) => {
    if (!auth.currentUser) {
      toast.error(MESSAGES.AUTH_REQUIRED);
      return false;
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
        toast.info(MESSAGES.WORKOUT_COMPLETED);
        return false;
      }

      const batch = writeBatch(db);

      // Buscar dados do treino para estatísticas
      const workoutRef = doc(db, 'workouts', workoutId);
      const workoutDoc = await getDoc(workoutRef);
      const workoutData = workoutDoc.exists() ? workoutDoc.data() : {};

      // Preparar exercícios
      const sanitizedExercises = exercises.map(exercise => {
        const sanitized = sanitizeExercise(exercise);
        // Garantir que campos numéricos sejam números
        ['repetitions', 'series', 'distance', 'duration', 'restTime', 'timePerSeries'].forEach(field => {
          if (sanitized[field]) {
            sanitized[field] = Number(sanitized[field]);
          }
        });
        return {
          ...sanitized,
          updatedAt: new Date().toISOString()
        };
      });

      const exercisesById = Object.fromEntries(
        sanitizedExercises.map(exercise => [exercise.id, exercise])
      );

      // Atualizar progresso
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

      // Se estiver finalizando o treino, atualizar estatísticas
      if (status === 'completed') {
        const stats = calculateWorkoutStats(workoutData, sanitizedExercises);
        await updateUserStats(auth.currentUser.uid, stats);
        await updateMonthlyStats(auth.currentUser.uid, workoutId, workoutData.date, stats);
      }

      // Salvar alterações
      batch.set(progressRef, updatedProgress);
      batch.set(
        doc(db, `users/${auth.currentUser.uid}/workouts`, workoutId),
        {
          exercises: sanitizedExercises,
          status,
          updatedAt: serverTimestamp(),
          workoutData: {
            name: workoutData.name,
            description: workoutData.description,
            date: workoutData.date,
            duration: workoutData.duration
          }
        }
      );

      await batch.commit();

      if (!silent) {
        toast.success(status === 'completed' ? MESSAGES.COMPLETE_SUCCESS : MESSAGES.SAVE_SUCCESS);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating workout progress:', error);
      setError(error.message);
      if (!silent) {
        toast.error(MESSAGES.SAVE_ERROR);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [db, auth.currentUser]);

  const completeWorkout = async (workoutId, workout, exercises) => {
    if (!auth.currentUser) {
      throw new Error(MESSAGES.AUTH_REQUIRED);
    }

    try {
      setLoading(true);
      const userId = auth.currentUser.uid;
      const batch = writeBatch(db);

      // Atualizar progresso do treino
      const progressRef = doc(db, 'workoutProgress', userId);
      const progressDoc = await getDoc(progressRef);
      const currentProgress = progressDoc.exists() ? progressDoc.data() : { workouts: {} };

      const workoutProgress = {
        ...currentProgress.workouts[workoutId],
        status: 'completed',
        completedAt: serverTimestamp(),
        exercises: exercises.reduce((acc, exercise) => {
          acc[exercise.id] = {
            completed: exercise.completed,
            completedAt: exercise.completedAt
          };
          return acc;
        }, {})
      };

      batch.set(progressRef, {
        workouts: {
          ...currentProgress.workouts,
          [workoutId]: workoutProgress
        }
      }, { merge: true });

      // Calcular e atualizar estatísticas
      const workoutStats = calculateWorkoutStats(workout, exercises);
      await updateUserStats(userId, workoutStats);
      await updateMonthlyStats(userId, workoutId, workout.date, workoutStats);

      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error completing workout:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addWorkout = async (workoutData) => {
    if (!auth.currentUser) {
      throw new Error(MESSAGES.AUTH_REQUIRED);
    }

    try {
      setLoading(true);
      const userId = auth.currentUser.uid;
      const workoutRef = await addDoc(collection(db, 'workouts'), {
        ...workoutData,
        createdAt: serverTimestamp(),
        userId
      });

      // Criar notificação
      const notificationsRef = collection(db, 'notifications');
      await addDoc(notificationsRef, {
        type: 'training',
        itemId: workoutRef.id,
        itemName: workoutData.name || 'Treino',
        itemDate: workoutData.date,
        createdAt: serverTimestamp(),
        action: 'created',
        message: `Novo treino adicionado: ${workoutData.name}`
      });

      toast.success(MESSAGES.SAVE_SUCCESS);
    } catch (error) {
      console.error('Erro ao adicionar treino:', error);
      toast.error(MESSAGES.SAVE_ERROR);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getWorkoutsByDate,
    updateWorkoutProgress,
    completeWorkout,
    addWorkout,
    sanitizeExercise
  };
};
