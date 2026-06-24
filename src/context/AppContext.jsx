import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SAMPLE_TRANSACTIONS, SAMPLE_BUDGETS, SAMPLE_GOALS } from '../data/sampleData';
import { ACHIEVEMENTS } from '../data/achievements';
import {
  getMonthTransactions, sumIncome, sumExpenses, calcSavingsRate,
  getCategoryBreakdown, calcHealthScore, calcBudgetUtil, calcAvgDailySpend,
} from '../utils/calculations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useLocalStorage('fintrack-transactions', SAMPLE_TRANSACTIONS);
  const [budgets, setBudgets] = useLocalStorage('fintrack-budgets', SAMPLE_BUDGETS);
  const [goals, setGoals] = useLocalStorage('fintrack-goals', SAMPLE_GOALS);
  const [streak, setStreak] = useLocalStorage('fintrack-streak', 7);
  const [lastTrackedDate, setLastTrackedDate] = useLocalStorage('fintrack-last-date', new Date().toISOString().slice(0, 10));
  const [earnedAchievements, setEarnedAchievements] = useLocalStorage('fintrack-achievements', ['first-transaction', 'ten-transactions', 'streak-7']);
  const [hasExported, setHasExported] = useLocalStorage('fintrack-exported', false);

  // ---- Derived state ----
  const currentMonthTxns = getMonthTransactions(transactions, 0);
  const lastMonthTxns = getMonthTransactions(transactions, -1);

  const currentIncome = sumIncome(currentMonthTxns);
  const currentExpenses = sumExpenses(currentMonthTxns);
  const lastIncome = sumIncome(lastMonthTxns);
  const lastExpenses = sumExpenses(lastMonthTxns);

  const totalBalance = sumIncome(transactions) - sumExpenses(transactions);
  const savingsRate = calcSavingsRate(currentIncome, currentExpenses);
  const categoryBreakdown = getCategoryBreakdown(currentMonthTxns);
  const budgetUtil = calcBudgetUtil(currentExpenses, budgets.overall);
  const avgDailySpend = calcAvgDailySpend(currentExpenses);
  const healthScore = calcHealthScore({
    income: currentIncome,
    expenses: currentExpenses,
    savings: currentIncome - currentExpenses,
    budgetUsage: budgetUtil,
    savingsRate,
    streak,
  });

  // ---- Achievement checking ----
  useEffect(() => {
    const stats = {
      totalTransactions: transactions.length,
      savingsRate,
      healthScore,
      streak,
      goalsCompleted: goals.filter((g) => g.currentAmount >= g.targetAmount).length,
      hasInvestment: transactions.some((t) => t.category === 'investments'),
      monthlyIncome: currentIncome,
      budgetKept: budgetUtil <= 100 && currentMonthTxns.length > 0,
      noOverspend: Object.entries(budgets.categories || {}).every(([cat, limit]) =>
        (categoryBreakdown[cat] || 0) <= limit),
      hasExported,
    };
    const newOnes = ACHIEVEMENTS
      .filter((a) => !earnedAchievements.includes(a.id) && a.condition(stats))
      .map((a) => a.id);
    if (newOnes.length > 0) {
      setEarnedAchievements((prev) => [...prev, ...newOnes]);
    }
  }, [transactions, goals, savingsRate, healthScore, streak, hasExported]);

  // ---- Streak tracking ----
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (lastTrackedDate !== today) {
      const last = new Date(lastTrackedDate);
      const now = new Date(today);
      const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
      if (diff === 1) setStreak((s) => s + 1);
      else if (diff > 1) setStreak(1);
      setLastTrackedDate(today);
    }
  }, []);

  // ---- Transaction CRUD ----
  const addTransaction = useCallback((txn) => {
    const newTxn = { ...txn, id: `txn-${Date.now()}-${Math.random().toString(36).slice(2)}` };
    setTransactions((prev) => [newTxn, ...prev]);
    return newTxn;
  }, [setTransactions]);

  const updateTransaction = useCallback((id, data) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
  }, [setTransactions]);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, [setTransactions]);

  const bulkDeleteTransactions = useCallback((ids) => {
    setTransactions((prev) => prev.filter((t) => !ids.includes(t.id)));
  }, [setTransactions]);

  const importTransactions = useCallback((newTxns) => {
    setTransactions((prev) => [...newTxns, ...prev]);
  }, [setTransactions]);

  // ---- Budget ----
  const updateBudget = useCallback((newBudgets) => {
    setBudgets(newBudgets);
  }, [setBudgets]);

  // ---- Goals ----
  const addGoal = useCallback((goal) => {
    const newGoal = { ...goal, id: `goal-${Date.now()}` };
    setGoals((prev) => [...prev, newGoal]);
  }, [setGoals]);

  const updateGoal = useCallback((id, data) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
  }, [setGoals]);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, [setGoals]);

  // ---- Reset (for demo) ----
  const resetToSampleData = useCallback(() => {
    setTransactions(SAMPLE_TRANSACTIONS);
    setBudgets(SAMPLE_BUDGETS);
    setGoals(SAMPLE_GOALS);
  }, [setTransactions, setBudgets, setGoals]);

  const value = {
    // Raw data
    transactions,
    budgets,
    goals,
    streak,
    earnedAchievements,
    // Derived
    currentMonthTxns,
    lastMonthTxns,
    currentIncome,
    currentExpenses,
    lastIncome,
    lastExpenses,
    totalBalance,
    savingsRate,
    categoryBreakdown,
    budgetUtil,
    avgDailySpend,
    healthScore,
    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    bulkDeleteTransactions,
    importTransactions,
    updateBudget,
    addGoal,
    updateGoal,
    deleteGoal,
    resetToSampleData,
    setHasExported,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
