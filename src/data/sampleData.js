import { subDays, subMonths, format } from 'date-fns';

const today = new Date();
const fmt = (d) => format(d, 'yyyy-MM-dd');

export const SAMPLE_TRANSACTIONS = [
  // --- Current month ---
  { id: 'seed-1',  type: 'income',  category: 'other',         amount: 85000,  description: 'Monthly Salary',           date: fmt(subDays(today, 1))  },
  { id: 'seed-2',  type: 'income',  category: 'investments',   amount: 12000,  description: 'Dividend Income',          date: fmt(subDays(today, 3))  },
  { id: 'seed-3',  type: 'expense', category: 'rent',          amount: 18000,  description: 'Monthly Rent',             date: fmt(subDays(today, 2))  },
  { id: 'seed-4',  type: 'expense', category: 'food',          amount: 2400,   description: 'Groceries — Big Basket',   date: fmt(subDays(today, 4))  },
  { id: 'seed-5',  type: 'expense', category: 'food',          amount: 850,    description: 'Dinner — Zomato',          date: fmt(subDays(today, 5))  },
  { id: 'seed-6',  type: 'expense', category: 'travel',        amount: 1200,   description: 'Uber rides',               date: fmt(subDays(today, 6))  },
  { id: 'seed-7',  type: 'expense', category: 'entertainment', amount: 649,    description: 'Netflix subscription',     date: fmt(subDays(today, 7))  },
  { id: 'seed-8',  type: 'expense', category: 'bills',         amount: 1850,   description: 'Electricity Bill',         date: fmt(subDays(today, 8))  },
  { id: 'seed-9',  type: 'expense', category: 'shopping',      amount: 3200,   description: 'Amazon — Electronics',     date: fmt(subDays(today, 9))  },
  { id: 'seed-10', type: 'expense', category: 'healthcare',    amount: 1500,   description: 'Apollo Pharmacy',          date: fmt(subDays(today, 10)) },
  { id: 'seed-11', type: 'expense', category: 'food',          amount: 620,    description: 'Starbucks coffee',         date: fmt(subDays(today, 11)) },
  { id: 'seed-12', type: 'expense', category: 'education',     amount: 4999,   description: 'Udemy Course',             date: fmt(subDays(today, 12)) },
  { id: 'seed-13', type: 'expense', category: 'investments',   amount: 10000,  description: 'SIP — Mutual Fund',        date: fmt(subDays(today, 13)) },
  { id: 'seed-14', type: 'expense', category: 'shopping',      amount: 2100,   description: 'Myntra — Clothing',        date: fmt(subDays(today, 14)) },
  { id: 'seed-15', type: 'expense', category: 'travel',        amount: 5500,   description: 'Weekend Trip — Goa',       date: fmt(subDays(today, 15)) },

  // --- Last month ---
  { id: 'seed-16', type: 'income',  category: 'other',         amount: 85000,  description: 'Monthly Salary',           date: fmt(subMonths(today, 1)) },
  { id: 'seed-17', type: 'expense', category: 'rent',          amount: 18000,  description: 'Monthly Rent',             date: fmt(subMonths(today, 1)) },
  { id: 'seed-18', type: 'expense', category: 'food',          amount: 4200,   description: 'Groceries & Dining',       date: fmt(subMonths(today, 1)) },
  { id: 'seed-19', type: 'expense', category: 'bills',         amount: 2200,   description: 'Utility Bills',            date: fmt(subMonths(today, 1)) },
  { id: 'seed-20', type: 'expense', category: 'shopping',      amount: 6500,   description: 'Online Shopping',          date: fmt(subMonths(today, 1)) },
  { id: 'seed-21', type: 'expense', category: 'entertainment', amount: 1200,   description: 'Movies & OTT',             date: fmt(subMonths(today, 1)) },
  { id: 'seed-22', type: 'expense', category: 'travel',        amount: 3800,   description: 'Fuel & Transport',         date: fmt(subMonths(today, 1)) },
  { id: 'seed-23', type: 'expense', category: 'investments',   amount: 10000,  description: 'SIP — Mutual Fund',        date: fmt(subMonths(today, 1)) },
  { id: 'seed-24', type: 'income',  category: 'other',         amount: 8000,   description: 'Freelance Project',        date: fmt(subMonths(today, 1)) },

  // --- 2 months ago ---
  { id: 'seed-25', type: 'income',  category: 'other',         amount: 85000,  description: 'Monthly Salary',           date: fmt(subMonths(today, 2)) },
  { id: 'seed-26', type: 'expense', category: 'rent',          amount: 18000,  description: 'Monthly Rent',             date: fmt(subMonths(today, 2)) },
  { id: 'seed-27', type: 'expense', category: 'food',          amount: 3800,   description: 'Groceries & Dining',       date: fmt(subMonths(today, 2)) },
  { id: 'seed-28', type: 'expense', category: 'healthcare',    amount: 3200,   description: 'Annual Health Checkup',    date: fmt(subMonths(today, 2)) },
  { id: 'seed-29', type: 'expense', category: 'education',     amount: 12000,  description: 'Professional Course',      date: fmt(subMonths(today, 2)) },
  { id: 'seed-30', type: 'expense', category: 'shopping',      amount: 4500,   description: 'Gadgets',                  date: fmt(subMonths(today, 2)) },
  { id: 'seed-31', type: 'expense', category: 'bills',         amount: 1900,   description: 'Internet + Mobile Bill',   date: fmt(subMonths(today, 2)) },
  { id: 'seed-32', type: 'expense', category: 'investments',   amount: 15000,  description: 'Stock Purchase',           date: fmt(subMonths(today, 2)) },

  // --- 3 months ago ---
  { id: 'seed-33', type: 'income',  category: 'other',         amount: 85000,  description: 'Monthly Salary',           date: fmt(subMonths(today, 3)) },
  { id: 'seed-34', type: 'income',  category: 'investments',   amount: 5000,   description: 'Capital Gains',            date: fmt(subMonths(today, 3)) },
  { id: 'seed-35', type: 'expense', category: 'rent',          amount: 18000,  description: 'Monthly Rent',             date: fmt(subMonths(today, 3)) },
  { id: 'seed-36', type: 'expense', category: 'food',          amount: 5100,   description: 'Food & Dining',            date: fmt(subMonths(today, 3)) },
  { id: 'seed-37', type: 'expense', category: 'travel',        amount: 14000,  description: 'International Flight',     date: fmt(subMonths(today, 3)) },
  { id: 'seed-38', type: 'expense', category: 'shopping',      amount: 8000,   description: 'Festival Shopping',        date: fmt(subMonths(today, 3)) },
  { id: 'seed-39', type: 'expense', category: 'entertainment', amount: 2500,   description: 'Events & Concerts',        date: fmt(subMonths(today, 3)) },
];

export const SAMPLE_BUDGETS = {
  overall: 70000,
  categories: {
    food:          8000,
    travel:        6000,
    shopping:      5000,
    bills:         3000,
    rent:          20000,
    education:     5000,
    healthcare:    3000,
    entertainment: 2000,
    investments:   15000,
    other:         5000,
  },
};

export const SAMPLE_GOALS = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    description: '6 months of living expenses',
    targetAmount: 300000,
    currentAmount: 180000,
    deadline: format(subMonths(today, -6), 'yyyy-MM-dd'),
    icon: '🛡️',
    color: '#10b981',
  },
  {
    id: 'goal-2',
    title: 'Europe Vacation',
    description: 'Trip to 5 European countries',
    targetAmount: 150000,
    currentAmount: 45000,
    deadline: format(subMonths(today, -9), 'yyyy-MM-dd'),
    icon: '✈️',
    color: '#6366f1',
  },
  {
    id: 'goal-3',
    title: 'MacBook Pro',
    description: 'M3 Pro for work and projects',
    targetAmount: 200000,
    currentAmount: 120000,
    deadline: format(subMonths(today, -3), 'yyyy-MM-dd'),
    icon: '💻',
    color: '#8b5cf6',
  },
];
