import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const useMonthlyStats = (months = 12) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    labels: [],
    distance: [],
    time: [],
    frequency: []
  });

  useEffect(() => {
    const fetchMonthlyStats = async () => {
      try {
        if (!auth.currentUser) {
          setError('Usuário não autenticado');
          return;
        }

        const monthlyStatsRef = collection(db, `users/${auth.currentUser.uid}/monthlyStats`);
        const q = query(monthlyStatsRef, orderBy('monthId', 'desc'));
        const querySnapshot = await getDocs(q);

        const monthlyData = {
          labels: [],
          distance: [],
          time: [],
          frequency: []
        };

        // Processar os documentos
        querySnapshot.docs.slice(0, months).reverse().forEach(doc => {
          const data = doc.data();
          
          // Formatar o rótulo do mês (ex: "2024-12" para "Dez/24")
          const [year, month] = data.monthId.split('-');
          const monthNames = [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
          ];
          const monthLabel = `${monthNames[parseInt(month) - 1]}/${year.slice(2)}`;

          monthlyData.labels.push(monthLabel);
          monthlyData.distance.push(Number(data.totalDistance || 0) / 1000); // Converter para km
          monthlyData.time.push(Number(data.totalTime || 0) / 60); // Converter para horas
          monthlyData.frequency.push(Number(data.frequency || 0));
        });

        setStats(monthlyData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar estatísticas mensais:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMonthlyStats();
  }, [months]);

  return { stats, loading, error };
};

export default useMonthlyStats;
