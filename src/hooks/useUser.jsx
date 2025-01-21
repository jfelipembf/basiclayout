import { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const DEFAULT_PHOTO = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

const DEFAULT_USER_DATA = {
  name: '',
  displayName: '',
  email: '',
  phone: '',
  gender: '',
  photoURL: DEFAULT_PHOTO,
  workoutProgress: [],
  address: {
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  },
  createdAt: null,
};

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useUser: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('useUser: Auth state changed', firebaseUser);
      try {
        if (firebaseUser) {
          console.log('useUser: User is authenticated, fetching user data');
          // Busca dados adicionais do usuário no Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData = userDoc.data() || {};

          // Se o usuário não existir no Firestore, cria um novo documento
          if (!userDoc.exists()) {
            console.log('useUser: Creating new user document in Firestore');
            const newUserData = {
              ...DEFAULT_USER_DATA,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || DEFAULT_PHOTO,
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUserData);
            userData = newUserData;
          }

          console.log('useUser: Setting user state with data', { ...firebaseUser, ...userData });
          setUser({
            uid: firebaseUser.uid,
            ...DEFAULT_USER_DATA,
            ...userData,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.name || '',
            photoURL: firebaseUser.photoURL || userData.photoURL || DEFAULT_PHOTO,
          });
        } else {
          console.log('useUser: No user found, setting user state to null');
          setUser(null);
        }
      } catch (error) {
        console.error('useUser: Error handling auth state change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log('useUser: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const updateProfile = async (data) => {
    try {
      if (!user?.uid) throw new Error('Usuário não autenticado');

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      // Atualiza o estado local
      setUser(prev => ({
        ...prev,
        ...data,
      }));

      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  const updateAddress = async (addressData) => {
    try {
      if (!user?.uid) throw new Error('Usuário não autenticado');

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        address: {
          ...user.address,
          ...addressData,
        },
        updatedAt: serverTimestamp(),
      });

      // Atualiza o estado local
      setUser(prev => ({
        ...prev,
        address: {
          ...prev.address,
          ...addressData,
        },
      }));

      return true;
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      throw error;
    }
  };

  const updateWorkoutProgress = async (progressData) => {
    try {
      if (!user?.uid) throw new Error('Usuário não autenticado');

      const userRef = doc(db, 'users', user.uid);
      const newProgress = [...(user.workoutProgress || []), progressData];

      await updateDoc(userRef, {
        workoutProgress: newProgress,
        updatedAt: serverTimestamp(),
      });

      // Atualiza o estado local
      setUser(prev => ({
        ...prev,
        workoutProgress: newProgress,
      }));

      return true;
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // Memoriza o objeto retornado para evitar re-renders desnecessários
  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    updateProfile,
    updateAddress,
    updateWorkoutProgress,
    signOut,
  }), [user, loading]);

  return value;
};
