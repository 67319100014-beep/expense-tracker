import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  note?: string;
  date?: string;
  timestamp: number;
}

export interface UserAccount {
  name: string;
  email: string;
  password: string;
}

interface AppContextType {
  user: UserAccount | null;
  transactions: Transaction[];
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'> & { timestamp?: number }) => Promise<void>;
  updateTransaction: (id: string, updated: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('@current_user');
      if (savedUser) {
        const parsedUser: UserAccount = JSON.parse(savedUser);
        setUser(parsedUser);
        await loadTransactions(parsedUser.email);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async (email: string) => {
    try {
      const data = await AsyncStorage.getItem(`@transactions_${email}`);
      setTransactions(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const { totalIncome, totalExpense, totalBalance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    return {
      totalIncome: income,
      totalExpense: expense,
      totalBalance: income - expense,
    };
  }, [transactions]);

  const register = async (name: string, email: string, password: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const newUser: UserAccount = {
        name: name.trim() || 'ผู้ใช้งาน',
        email: normalizedEmail,
        password,
      };

      await AsyncStorage.setItem('@current_user', JSON.stringify(newUser));
      setUser(newUser);
      await loadTransactions(newUser.email);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const loggedInUser: UserAccount = {
        name: normalizedEmail.split('@')[0] || 'ผู้ใช้งาน',
        email: normalizedEmail,
        password,
      };

      await AsyncStorage.setItem('@current_user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      await loadTransactions(loggedInUser.email);
      return { success: true };
    } catch (error) {
      return { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@current_user');
      setUser(null);
      setTransactions([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addTransaction = async (newTx: Omit<Transaction, 'id' | 'timestamp'> & { timestamp?: number }) => {
    if (!user) return;
    const tx: Transaction = {
      ...newTx,
      title: newTx.title || newTx.category || 'รายการทั่วไป',
      id: Date.now().toString(),
      timestamp: newTx.timestamp || Date.now(),
    };
    const updated = [tx, ...transactions];
    setTransactions(updated);
    await AsyncStorage.setItem(`@transactions_${user.email}`, JSON.stringify(updated));
  };

  const updateTransaction = async (id: string, updatedTx: Partial<Transaction>) => {
    if (!user) return;
    const updated = transactions.map((item) =>
      item.id === id ? { ...item, ...updatedTx } : item
    );
    setTransactions(updated);
    await AsyncStorage.setItem(`@transactions_${user.email}`, JSON.stringify(updated));
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;
    const updated = transactions.filter((item) => item.id !== id);
    setTransactions(updated);
    await AsyncStorage.setItem(`@transactions_${user.email}`, JSON.stringify(updated));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        totalBalance,
        totalIncome,
        totalExpense,
        register,
        login,
        logout,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};