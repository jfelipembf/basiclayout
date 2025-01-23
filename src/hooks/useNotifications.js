import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(
        notificationsRef,
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const querySnapshot = await getDocs(q);
      const notificationsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt
        };
      });

      setNotifications(notificationsData);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await deleteDoc(notificationRef);
      await fetchNotifications();
    } catch (error) {
      console.error('Erro ao deletar notificação:', error);
      throw error;
    }
  };

  const addNotification = async (data) => {
    try {
      if (!data.type || !data.message) {
        throw new Error('Dados obrigatórios faltando');
      }

      const notificationsRef = collection(db, 'notifications');
      const notification = {
        type: data.type,
        message: data.message,
        createdAt: serverTimestamp(),
        read: false,
        action: data.action || 'created',
        ...(data.type === 'competition' ? {
          competitionId: data.itemId,
          competitionName: data.itemName,
          competitionDate: data.itemDate
        } : {
          itemId: data.itemId,
          itemName: data.itemName,
          itemDate: data.itemDate
        })
      };

      await addDoc(notificationsRef, notification);
      await fetchNotifications();
    } catch (error) {
      console.error('Erro ao adicionar notificação:', error);
      throw error;
    }
  };

  const addCompetitionNotification = async (competition, action) => {
    try {
      if (!competition || !action) {
        console.error('Dados da competição inválidos');
        return;
      }

      const notificationData = {
        type: 'competition',
        itemId: competition.id || null,
        itemName: competition.name || 'Competição',
        itemDate: competition.date || null,
        action,
        message: action === 'created' 
          ? `Nova competição disponível: ${competition.name}`
          : `Competição reativada: ${competition.name}`
      };

      await addNotification(notificationData);
    } catch (error) {
      console.error('Erro ao criar notificação de competição:', error);
      throw error;
    }
  };

  const addTrainingNotification = async (training) => {
    try {
      if (!training) {
        console.error('Dados do treino inválidos');
        return;
      }

      const notificationData = {
        type: 'training',
        itemId: training.id || null,
        itemName: training.name || 'Treino',
        itemDate: training.date || null,
        action: 'created',
        message: `Novo treino adicionado: ${training.name}`
      };

      await addNotification(notificationData);
    } catch (error) {
      console.error('Erro ao criar notificação de treino:', error);
      throw error;
    }
  };

  const addEventNotification = async (event) => {
    try {
      if (!event) {
        console.error('Dados do evento inválidos');
        return;
      }

      const notificationData = {
        type: 'event',
        itemId: event.id || null,
        itemName: event.name || 'Evento',
        itemDate: event.date || null,
        action: 'created',
        message: `Novo evento criado: ${event.name}`
      };

      await addNotification(notificationData);
    } catch (error) {
      console.error('Erro ao criar notificação de evento:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    addCompetitionNotification,
    addTrainingNotification,
    addEventNotification,
    deleteNotification
  };
};
