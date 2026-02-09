import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

/**
 * Toast Provider Component
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    setToast({ message, type, duration });
  }, []);

  const showSuccess = useCallback((message, duration = 3000) => {
    setToast({ message, type: 'success', duration });
  }, []);

  const showError = useCallback((message, duration = 3000) => {
    setToast({ message, type: 'error', duration });
  }, []);

  const showWarning = useCallback((message, duration = 3000) => {
    setToast({ message, type: 'warning', duration });
  }, []);

  const showInfo = useCallback((message, duration = 3000) => {
    setToast({ message, type: 'info', duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo(() => ({
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast
  }), [showToast, showSuccess, showError, showWarning, showInfo, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <Toast {...toast} />}
    </ToastContext.Provider>
  );
}

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

/**
 * Custom hook to use Toast Context
 */
export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}

export default ToastContext;
