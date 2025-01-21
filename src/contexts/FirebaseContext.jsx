import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initializeApp,
  getApps,
  getApp,
} from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicialização do Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Criação do contexto
export const FirebaseContext = createContext(null);
export const AuthContext = createContext(null);

// Hook personalizado para acessar o contexto
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase deve ser usado dentro de um FirebaseProvider.');
  }
  return context;
};

// Hook personalizado para acessar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um FirebaseProvider.');
  }
  return context;
};

// Provedor do Firebase
export const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
      throw error;
    }
  };

  const register = async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error.message);
      throw error;
    }
  };

  const addUser = async (userData) => {
    try {
      const userRef = doc(collection(db, 'users'));
      await setDoc(userRef, { ...userData, createdAt: serverTimestamp() });
      return userRef;
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error.message);
      throw error;
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, userData);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error.message);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error.message);
      throw error;
    }
  };

  const addRecord = async (userId, recordData) => {
    try {
      const recordRef = doc(collection(db, `users/${userId}/records`));
      await setDoc(recordRef, { ...recordData, createdAt: serverTimestamp() });
      return recordRef;
    } catch (error) {
      console.error('Erro ao adicionar registro:', error.message);
      throw error;
    }
  };

  const listRecords = async (userId) => {
    try {
      const recordsSnapshot = await getDocs(collection(db, `users/${userId}/records`));
      return recordsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erro ao listar registros:', error.message);
      throw error;
    }
  };

  const updateRecord = async (userId, recordId, recordData) => {
    try {
      const recordRef = doc(db, `users/${userId}/records`, recordId);
      await updateDoc(recordRef, recordData);
    } catch (error) {
      console.error('Erro ao atualizar registro:', error.message);
      throw error;
    }
  };

  const deleteRecord = async (userId, recordId) => {
    try {
      const recordRef = doc(db, `users/${userId}/records`, recordId);
      await deleteDoc(recordRef);
    } catch (error) {
      console.error('Erro ao deletar registro:', error.message);
      throw error;
    }
  };

  const authValue = {
    currentUser,
    isLoggedIn: !!currentUser,
    loading,
    login,
    logout,
    register,
  };

  const firebaseValue = {
    db,
    storage,
    addUser,
    updateUser,
    deleteUser,
    addRecord,
    listRecords,
    updateRecord,
    deleteRecord,
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <FirebaseContext.Provider value={firebaseValue}>
      <AuthContext.Provider value={authValue}>
        {children}
      </AuthContext.Provider>
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
