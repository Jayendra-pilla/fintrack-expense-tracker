import Papa from 'papaparse';
import { formatDate } from './formatters';

// Export transactions as CSV
export const exportToCSV = (transactions) => {
  const rows = transactions.map((t) => ({
    Date: formatDate(t.date),
    Type: t.type,
    Category: t.category,
    Description: t.description,
    Amount: t.amount,
  }));
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fintrack-export-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

// Import transactions from CSV
export const importFromCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const transactions = results.data.map((row, i) => ({
            id: `import-${Date.now()}-${i}`,
            date: parseImportDate(row.Date || row.date || ''),
            type: (row.Type || row.type || 'expense').toLowerCase(),
            category: (row.Category || row.category || 'other').toLowerCase(),
            description: row.Description || row.description || 'Imported',
            amount: parseFloat(row.Amount || row.amount || 0),
          })).filter((t) => !isNaN(t.amount) && t.amount > 0);
          resolve(transactions);
        } catch (err) {
          reject(err);
        }
      },
      error: reject,
    });
  });
};

const parseImportDate = (dateStr) => {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  // Try ISO format first
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Try DD/MM/YYYY or DD-MM-YYYY
  const match = dateStr.match(/(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
  if (match) {
    const [, d, m, y] = match;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return new Date().toISOString().slice(0, 10);
};

// Backup full data as JSON
export const backupData = (data) => {
  const json = JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fintrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Restore data from JSON backup
export const restoreFromBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch {
        reject(new Error('Invalid backup file'));
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
