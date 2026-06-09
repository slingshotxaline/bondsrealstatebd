'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

let id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const toastId = ++id;
    setToasts(prev => [...prev, { id: toastId, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 3500);
  }, []);

  const remove = (toastId) => setToasts(prev => prev.filter(t => t.id !== toastId));

  const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle };
  const styles = {
    success: 'bg-white border-emerald-200 text-emerald-700',
    error: 'bg-white border-red-200 text-red-600',
    warning: 'bg-white border-amber-200 text-amber-600',
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 max-w-xs w-full">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = icons[t.type] || CheckCircle;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.9 }}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border shadow-xl shadow-gray-200 ${styles[t.type]}`}
              >
                <Icon size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium flex-1 text-gray-800">{t.message}</p>
                <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
};