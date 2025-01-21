import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const DEFAULT_PHOTO = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Busca dados adicionais do usuário no Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data() || {};

          // Combina dados do Firebase Auth com dados do Firestore
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.name,
            photoURL: firebaseUser.photoURL || userData.photo || DEFAULT_PHOTO,
            ...userData
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Memoriza o objeto retornado para evitar re-renders desnecessários
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    signOut: async () => {
      try {
        await firebaseSignOut(auth);
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        throw error;
      }
    }
  }), [user, loading]);

  return value;
};
