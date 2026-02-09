import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout as authLogout } from '../services/authService';

/**
 * Custom hook for authentication
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - Require authentication
 * @param {string} options.requireRole - Require specific role (e.g., 'admin')
 * @param {string} options.redirectTo - Redirect path if not authenticated
 * @returns {Object} Auth state and methods
 */
export function useAuth(options = {}) {
  const {
    requireAuth = false,
    requireRole = null,
    redirectTo = '/login'
  } = options;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setLoading(true);
    setError(null);

    if (!isAuthenticated()) {
      if (requireAuth) {
        setError('Vui lòng đăng nhập để tiếp tục');
        navigate(redirectTo);
      }
      setLoading(false);
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Check role requirement
    if (requireRole && currentUser?.role?.toLowerCase() !== requireRole.toLowerCase()) {
      setError(`Bạn không có quyền truy cập trang này! Yêu cầu: ${requireRole}`);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }

    setLoading(false);
  };

  const logout = () => {
    authLogout();
    setUser(null);
    navigate(redirectTo);
  };

  const refreshUser = () => {
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    logout,
    refreshUser,
    checkAuth
  };
}
