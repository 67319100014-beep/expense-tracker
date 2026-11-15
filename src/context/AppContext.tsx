import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  timestamp: string;
}

interface AppContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  userEmail: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('@transactions');
      if (data) setTransactions(JSON.parse(data));
      
      const savedUser = await AsyncStorage.getItem('@user_email');
      if (savedUser) setUserEmail(savedUser);
    } catch (e) {
      console.error(e);
    }
  };

  const login = async (email: string) => {
    setUserEmail(email);
    await AsyncStorage.setItem('@user_email', email);
  };

  const logout = async () => {
    setUserEmail(null);
    await AsyncStorage.removeItem('@user_email');
  };

  const saveData = async (newList: Transaction[]) => {
    try {
      setTransactions(newList);
      await AsyncStorage.setItem('@transactions', JSON.stringify(newList));
    } catch (e) {
      console.error(e);
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    await saveData([newTx, ...transactions]);
  };

  const deleteTransaction = async (id: string) => {
    await saveData(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  return (
    <AppContext.Provider value={{ 
      transactions, addTransaction, deleteTransaction, 
      totalBalance, totalIncome, totalExpense,
      userEmail, login, logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};