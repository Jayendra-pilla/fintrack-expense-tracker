import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format, subMonths, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

// Current month range
export const getCurrentMonthRange = () => {
  const now = new Date();
  return { start: startOfMonth(now), end: endOfMonth(now) };
};

// Filter transactions by month offset (0 = current, -1 = last month)
export const getMonthTransactions = (transactions, monthOffset = 0) => {
  const date = subMonths(new Date(), Math.abs(monthOffset));
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return transactions.filter((t) => {
    const d = parseISO(t.date);
    return isWithinInterval(d, { start, end });
  });
};

// Sum income from transaction list
export const sumIncome = (transactions) =>
  transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

// Sum expenses from transaction list
export const sumExpenses = (transactions) =>
  transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

// Balance
export const calcBalance = (transactions) =>
  sumIncome(transactions) - sumExpenses(transactions);

// Savings rate
export const calcSavingsRate = (income, expenses) => {
  if (income === 0) return 0;
  return Math.max(0, ((income - expenses) / income) * 100);
};

// Category breakdown for a list of transactions
export const getCategoryBreakdown = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return map;
};

// Monthly data for charts (last N months)
export const getMonthlyChartData = (transactions, months = 6) => {
  return Array.from({ length: months }, (_, i) => {
    const offset = months - 1 - i;
    const date = subMonths(new Date(), offset);
    const monthTxns = getMonthTransactions(transactions, -offset);
    const income = sumIncome(monthTxns);
    const expenses = sumExpenses(monthTxns);
    const savings = Math.max(0, income - expenses);
    return {
      month: format(date, 'MMM'),
      fullMonth: format(date, 'MMMM yyyy'),
      income,
      expenses,
      savings,
    };
  });
};

// Weekly data (last 4 weeks)
export const getWeeklyChartData = (transactions) => {
  return Array.from({ length: 4 }, (_, i) => {
    const offset = 3 - i;
    const refDate = subMonths(new Date(), 0);
    const start = startOfWeek(new Date(refDate.getTime() - offset * 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 });
    const end = endOfWeek(start, { weekStartsOn: 1 });
    const weekTxns = transactions.filter((t) => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start, end });
    });
    return {
      week: `W${4 - offset}`,
      label: `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`,
      income: sumIncome(weekTxns),
      expenses: sumExpenses(weekTxns),
    };
  });
};

// Daily heatmap data (last 12 weeks)
export const getDailyHeatmapData = (transactions) => {
  const end = new Date();
  const start = subMonths(end, 3);
  const days = eachDayOfInterval({ start, end });
  return days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const total = transactions
      .filter((t) => t.type === 'expense' && t.date === dayStr)
      .reduce((sum, t) => sum + t.amount, 0);
    return { date: dayStr, amount: total, day: format(day, 'EEE'), month: format(day, 'MMM') };
  });
};

// Financial Health Score (0–100)
export const calcHealthScore = ({ income, savings, budgetUsage, savingsRate, streak }) => {
  let score = 0;
  // Savings rate: 0-35 pts
  score += Math.min(35, savingsRate * 1.17);
  // Budget adherence: 0-30 pts
  if (budgetUsage <= 100) score += 30 - Math.max(0, budgetUsage - 70) * 1;
  else score += Math.max(0, 30 - (budgetUsage - 100) * 0.5);
  // Income positivity: 0-15 pts
  if (income > 0) score += 15;
  // Streak: 0-10 pts
  score += Math.min(10, (streak / 30) * 10);
  // Investments: 0-10 pts
  if (savings > 0) score += 10;
  return Math.round(Math.min(100, Math.max(0, score)));
};

// Budget utilization %
export const calcBudgetUtil = (expenses, budget) => {
  if (!budget || budget === 0) return 0;
  return (expenses / budget) * 100;
};

// Top N categories by spending
export const getTopCategories = (categoryBreakdown, n = 5) =>
  Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([id, amount]) => ({ id, amount }));

// Average daily spending this month
export const calcAvgDailySpend = (expenses) => {
  const today = new Date();
  const dayOfMonth = today.getDate();
  return dayOfMonth > 0 ? expenses / dayOfMonth : 0;
};
