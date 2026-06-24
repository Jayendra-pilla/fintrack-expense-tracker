import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { TransactionForm } from '../transactions/TransactionForm';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

export function AppLayout() {
  const { isDark } = useTheme();
  const [txFormOpen, setTxFormOpen] = useState(false);

  return (
    <div className={clsx('flex min-h-screen', isDark ? 'dark' : '')}>
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb w-96 h-96 bg-primary-500 top-[-10%] left-[-5%]" />
        <div className="orb w-80 h-80 bg-violet-500 bottom-[10%] right-[-5%]" />
        <div className="orb w-64 h-64 bg-cyan-500 top-[50%] left-[40%]" />
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        <Header onAddTransaction={() => setTxFormOpen(true)} />
        <main className={clsx('flex-1 overflow-auto pb-20 lg:pb-6')}>
          <Outlet context={{ openTxForm: () => setTxFormOpen(true) }} />
        </main>
        <MobileNav />
      </div>

      <TransactionForm
        isOpen={txFormOpen}
        onClose={() => setTxFormOpen(false)}
      />

      <Toaster
        position="top-right"
        containerClassName="toast-container"
        toastOptions={{
          duration: 3000,
          style: {
            background: isDark ? '#1e1e2e' : '#ffffff',
            color: isDark ? '#f1f5f9' : '#0f172a',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: 'white' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: 'white' } },
        }}
      />
    </div>
  );
}
