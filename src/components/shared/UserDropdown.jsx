import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

/**
 * Reusable User Dropdown Component
 */
function UserDropdown({ 
  user, 
  isOpen, 
  onToggle, 
  onLogout,
  showAdminLinks = false 
}) {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen) onToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
          {getInitials(user.fullname || user.name)}
        </div>
        <div className="text-left hidden md:block">
          <div className="font-semibold text-gray-800">{user.fullname || user.name}</div>
          <div className="text-sm text-gray-500">{user.role}</div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-slideDown">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="font-semibold text-gray-800">{user.fullname || user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="text-xs text-indigo-600 font-medium mt-1">{user.role}</div>
          </div>

          <div className="py-2">
            <Link
              to="/profile"
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 no-underline"
              onClick={() => onToggle()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Hồ sơ của tôi</span>
            </Link>

            {showAdminLinks && (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 no-underline"
                  onClick={() => onToggle()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/users"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 no-underline"
                  onClick={() => onToggle()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>Quản lý người dùng</span>
                </Link>

                <Link
                  to="/universities"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors text-gray-700 no-underline"
                  onClick={() => onToggle()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>Quản lý trường học</span>
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-gray-200 pt-2">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors text-red-600 w-full text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

UserDropdown.propTypes = {
  user: PropTypes.shape({
    fullname: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string
  }),
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  showAdminLinks: PropTypes.bool
};

export default UserDropdown;
