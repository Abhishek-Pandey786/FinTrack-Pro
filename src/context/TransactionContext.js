import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ref,
  push,
  set,
  onValue,
  remove,
  update,
  query,
  orderByChild,
  equalTo,
  get
} from 'firebase/database';
import { database } from '../services/firebase';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export function useTransactions() {
  return useContext(TransactionContext);
}

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Fetch transactions when user changes
  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch transactions from Realtime Database
  async function fetchTransactions() {
    try {
      setLoading(true);
      const transactionsRef = ref(database, 'transactions');
      
      // Listen for changes to the transactions in the database
      const unsubscribe = onValue(transactionsRef, (snapshot) => {
        const data = snapshot.val();
        const transactionList = [];
        
        if (data) {
          Object.keys(data).forEach((key) => {
            // Only include transactions that belong to the current user
            if (data[key].userId === currentUser.uid) {
              transactionList.push({
                id: key,
                ...data[key],
                date: new Date(data[key].date)
              });
            }
          });
        }
        
        // Sort transactions by date (newest first)
        transactionList.sort((a, b) => b.date - a.date);
        
        setTransactions(transactionList);
        setLoading(false);
      });
      
      // Clean up the listener when component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  }

  // Add a new transaction
  async function addTransaction(transaction) {
    try {
      const transactionsRef = ref(database, 'transactions');
      const newTransactionRef = push(transactionsRef);
      
      // Format the date as ISO string
      const newTransaction = {
        ...transaction,
        userId: currentUser.uid,
        date: transaction.date.toISOString()
      };
      
      await set(newTransactionRef, newTransaction);
      
      // The onValue listener will update the transactions list automatically
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  // Update a transaction
  async function updateTransaction(id, updatedData) {
    try {
      const transactionRef = ref(database, `transactions/${id}`);
      
      const dataToUpdate = { ...updatedData };
      if (updatedData.date) {
        dataToUpdate.date = updatedData.date.toISOString();
      }
      
      await update(transactionRef, dataToUpdate);
      
      // The onValue listener will update the transactions list automatically
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  // Delete a transaction
  async function deleteTransaction(id) {
    try {
      const transactionRef = ref(database, `transactions/${id}`);
      await remove(transactionRef);
      
      // The onValue listener will update the transactions list automatically
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  // Calculate total income
  function calculateTotalIncome() {
    return transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((total, transaction) => total + Number(transaction.amount), 0);
  }

  // Calculate total expense
  function calculateTotalExpense() {
    return transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((total, transaction) => total + Number(transaction.amount), 0);
  }

  // Get balance
  function getBalance() {
    return calculateTotalIncome() - calculateTotalExpense();
  }

  const value = {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
    calculateTotalIncome,
    calculateTotalExpense,
    getBalance
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
} 