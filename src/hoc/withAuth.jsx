import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import Loading from '../components/shared/Loading';

/**
 * Higher Order Component for authentication
 * @param {React.Component} Component - Component to wrap
 * @param {Object} options - Configuration options
 * @param {string} options.requireRole - Required role (e.g., 'admin')
 * @param {string} options.redirectTo - Redirect path if not authorized
 * @returns {React.Component} Wrapped component
 */
export function withAuth(Component, options = {}) {
  const {
    requireRole = null,
    redirectTo = '/login'
  } = options;

  return function WrappedComponent(props) {
    const { user, loading, isAuthenticated, error } = useAuth({
      requireAuth: true,
      requireRole,
      redirectTo
    });
    const { showError } = useToast();

    useEffect(() => {
      if (error) {
        showError(error);
      }
    }, [error]);

    if (loading) {
      return <Loading fullScreen message="Đang kiểm tra quyền truy cập..." />;
    }

    if (!isAuthenticated) {
      return null; // Will redirect via useAuth
    }

    if (requireRole && user?.role?.toLowerCase() !== requireRole.toLowerCase()) {
      return null; // Will redirect via useAuth
    }

    return <Component {...props} user={user} />;
  };
}

/**
 * HOC specifically for admin-only pages
 */
export function withAdminAuth(Component) {
  return withAuth(Component, { requireRole: 'admin', redirectTo: '/' });
}

/**
 * HOC for pages that require any authenticated user
 */
export function withUserAuth(Component) {
  return withAuth(Component, { requireAuth: true });
}
