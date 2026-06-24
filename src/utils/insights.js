import { formatCurrency, formatPercent } from './formatters';
import { getCategoryById } from '../data/categories';

export const generateInsights = ({ currentMonth, lastMonth, categoryBreakdown, budget, savingsRate, avgDailySpend }) => {
  const insights = [];

  // 1. Highest spending category
  const topCategoryEntries = Object.entries(categoryBreakdown).sort(([, a], [, b]) => b - a);
  if (topCategoryEntries.length > 0) {
    const [topCat, topAmount] = topCategoryEntries[0];
    const cat = getCategoryById(topCat);
    insights.push({
      id: 'top-category',
      type: 'info',
      icon: '🏷️',
      title: 'Highest Spending',
      message: `${cat.label} is your top spending category this month at ${formatCurrency(topAmount)}.`,
      action: 'View Analytics',
      actionPath: '/analytics',
    });
  }

  // 2. Savings rate
  if (savingsRate >= 30) {
    insights.push({
      id: 'savings-good',
      type: 'success',
      icon: '💰',
      title: 'Great Savings Rate!',
      message: `You're saving ${formatPercent(savingsRate)} of your income this month. Excellent financial discipline!`,
    });
  } else if (savingsRate > 0 && savingsRate < 10) {
    insights.push({
      id: 'savings-low',
      type: 'warning',
      icon: '⚠️',
      title: 'Low Savings Rate',
      message: `Your savings rate is only ${formatPercent(savingsRate)}. Consider cutting discretionary spending to save more.`,
      action: 'View Budget',
      actionPath: '/budget',
    });
  }

  // 3. Average daily spend
  if (avgDailySpend > 0) {
    insights.push({
      id: 'daily-spend',
      type: 'info',
      icon: '📅',
      title: 'Daily Spending',
      message: `You're spending an average of ${formatCurrency(avgDailySpend)} per day this month.`,
    });
  }

  // 4. Month-over-month comparison
  if (lastMonth.expenses > 0 && currentMonth.expenses > 0) {
    const change = ((currentMonth.expenses - lastMonth.expenses) / lastMonth.expenses) * 100;
    if (change > 15) {
      insights.push({
        id: 'spending-up',
        type: 'warning',
        icon: '📈',
        title: 'Spending Increased',
        message: `Your expenses are ${Math.abs(change).toFixed(1)}% higher than last month. Review your recent transactions.`,
        action: 'View Transactions',
        actionPath: '/transactions',
      });
    } else if (change < -10) {
      insights.push({
        id: 'spending-down',
        type: 'success',
        icon: '📉',
        title: 'Spending Decreased',
        message: `Great job! Your expenses dropped by ${Math.abs(change).toFixed(1)}% compared to last month.`,
      });
    }
  }

  // 5. Budget status
  if (budget > 0) {
    const utilPercent = (currentMonth.expenses / budget) * 100;
    if (utilPercent > 90 && utilPercent <= 100) {
      insights.push({
        id: 'budget-near',
        type: 'warning',
        icon: '🔔',
        title: 'Budget Almost Full',
        message: `You've used ${utilPercent.toFixed(0)}% of your monthly budget. Slow down on spending!`,
        action: 'View Budget',
        actionPath: '/budget',
      });
    } else if (utilPercent > 100) {
      insights.push({
        id: 'budget-exceeded',
        type: 'danger',
        icon: '🚨',
        title: 'Budget Exceeded!',
        message: `You've gone over budget by ${formatCurrency(currentMonth.expenses - budget)}. Consider reviewing your expenses.`,
        action: 'View Budget',
        actionPath: '/budget',
      });
    } else if (utilPercent < 60 && new Date().getDate() > 20) {
      insights.push({
        id: 'budget-good',
        type: 'success',
        icon: '✅',
        title: 'On Track with Budget',
        message: `Only ${utilPercent.toFixed(0)}% of budget used with few days left. You're doing great!`,
      });
    }
  }

  // 6. Recommendation — food spending
  const foodSpend = categoryBreakdown['food'] || 0;
  const totalExpenses = currentMonth.expenses;
  if (totalExpenses > 0 && (foodSpend / totalExpenses) > 0.35) {
    insights.push({
      id: 'food-high',
      type: 'tip',
      icon: '🍽️',
      title: 'Food Spending High',
      message: `Food & dining accounts for ${((foodSpend / totalExpenses) * 100).toFixed(0)}% of expenses. Meal prepping could help reduce costs.`,
    });
  }

  // 7. Investment recommendation
  const investSpend = categoryBreakdown['investments'] || 0;
  if (currentMonth.income > 0 && investSpend === 0) {
    insights.push({
      id: 'no-investment',
      type: 'tip',
      icon: '📈',
      title: 'Consider Investing',
      message: 'You haven\'t made any investments this month. Consider setting up a SIP to build long-term wealth.',
      action: 'Learn More',
    });
  }

  return insights.slice(0, 6);
};
