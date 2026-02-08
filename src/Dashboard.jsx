import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from './services/authService';
import { getAllUsers } from './services/userService';
import Toast from './components/Toast';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = getCurrentUser();
    
    // Check if user is Admin (case-insensitive)
    if (!currentUser?.role || currentUser.role.toLowerCase() !== 'admin') {
      setToast({
        message: '⚠️ Bạn không có quyền truy cập trang này!',
        type: 'error',
        duration: 3000
      });
      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }

    setUser(currentUser);

    // Load total users
    loadTotalUsers();
  }, [navigate]);

  const loadTotalUsers = async () => {
    try {
      setLoading(true);
      const result = await getAllUsers();
      
      if (result.success && result.users) {
        setTotalUsers(result.users.length);
      } else {
        setToast({
          message: '⚠️ Không thể tải dữ liệu người dùng',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setToast({
        message: '❌ Lỗi khi tải dữ liệu',
        type: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setToast({
      message: '👋 Đã đăng xuất thành công!',
      type: 'success',
      duration: 1500
    });
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-semibold">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-indigo-600 no-underline hover:text-purple-600 transition-colors">
              EduPath
            </Link>
            <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full">
              ADMIN
            </span>
          </div>

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user.fullname?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="font-semibold text-gray-700">{user.fullname || 'Admin'}</span>
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 animate-fadeIn">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors no-underline text-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="text-xl">👤</span>
                    <span className="font-medium">Thông tin cá nhân</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 transition-colors no-underline text-gray-700"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="text-xl">📊</span>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <span className="text-xl">🚪</span>
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Quản trị</h1>
          <p className="text-indigo-100 text-lg">Chào mừng {user?.fullname || 'Admin'} đến với trang quản trị! 👋</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <Link 
            to="/user-management"
            className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1 no-underline cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                👥
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase">Tổng số</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{totalUsers}</h3>
            <p className="text-gray-600 font-medium">Người dùng</p>
            <p className="text-xs text-indigo-600 font-semibold mt-2 flex items-center gap-1">
              <span>Xem chi tiết</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </p>
          </Link>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              Thao tác nhanh
            </h3>
            <div className="space-y-3">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all no-underline font-semibold shadow-md hover:shadow-lg"
              >
                <span className="text-xl">🏠</span>
                <span>Về trang chủ</span>
              </Link>
              <button
                onClick={loadTotalUsers}
                className="w-full flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                <span className="text-xl">🔄</span>
                <span>Làm mới dữ liệu</span>
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">ℹ️</span>
              Thông tin hệ thống
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Phiên bản:</span>
                <span className="font-semibold text-gray-800">1.0.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="flex items-center gap-1 font-semibold text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Hoạt động
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vai trò:</span>
                <span className="font-semibold text-indigo-600">Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="text-5xl">🎉</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng đến với Dashboard!</h2>
              <p className="text-gray-600 leading-relaxed">
                Đây là trang quản trị dành cho Admin. Bạn có thể xem thống kê tổng quan về hệ thống, 
                quản lý người dùng và thực hiện các thao tác quản trị khác.
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  to="/profile"
                  className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all no-underline font-semibold"
                >
                  Xem profile
                </Link>
                <Link
                  to="/"
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all no-underline font-semibold"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration || 3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
