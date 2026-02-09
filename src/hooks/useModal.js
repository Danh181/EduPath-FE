import { useState, useCallback } from 'react';

/**
 * Custom hook for modal state management
 * @returns {Object} Modal state and methods
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const open = useCallback((initialData = null) => {
    setData(initialData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Clear data after animation completes
    setTimeout(() => setData(null), 300);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const updateData = useCallback((newData) => {
    setData(newData);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    updateData
  };
}

/**
 * Custom hook to manage multiple modals
 * @param {Array<string>} modalNames - Array of modal names
 * @returns {Object} Object with modal states and methods for each named modal
 */
export function useModals(modalNames = []) {
  const [modals, setModals] = useState(() => 
    modalNames.reduce((acc, name) => ({
      ...acc,
      [name]: { isOpen: false, data: null }
    }), {})
  );

  const open = useCallback((name, data = null) => {
    setModals(prev => ({
      ...prev,
      [name]: { isOpen: true, data }
    }));
  }, []);

  const close = useCallback((name) => {
    setModals(prev => ({
      ...prev,
      [name]: { isOpen: false, data: null }
    }));
  }, []);

  const toggle = useCallback((name) => {
    setModals(prev => ({
      ...prev,
      [name]: { 
        isOpen: !prev[name]?.isOpen, 
        data: prev[name]?.data 
      }
    }));
  }, []);

  const updateData = useCallback((name, data) => {
    setModals(prev => ({
      ...prev,
      [name]: { ...prev[name], data }
    }));
  }, []);

  return {
    modals,
    open,
    close,
    toggle,
    updateData
  };
}
