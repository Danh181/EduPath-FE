import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { getAllUsers } from './services/userService';
import { getAllUniversities } from './services/universityService';
import { getAllPersonalTraits } from './services/personalTraitService';
import { logout } from './services/authService';
import { UserDropdown, Loading } from './components/shared';
import Toast from './components/Toast';

function Dashboard() {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalUniversities, setTotalUniversities] = useState(0);
  const [totalPersonalTraits, setTotalPersonalTraits] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Auth
  const { user, loading: authLoading, error: authError } = useAuth({
    requireAuth: true,
    requireRole: 'admin',
    redirectTo: '/'
  });

  // Toast
  const { toast, showSuccess, showError, showToast } = useToast();

  useEffect(() => {
    if (authError) {
      showError(authError);
    }
  }, [authError]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setDataLoading(true);
    await Promise.all([loadTotalUsers(), loadTotalUniversities(), loadTotalPersonalTraits()]);
    setDataLoading(false);
  };

  const loadTotalUsers = async () => {
    try {
      const result = await getAllUsers();
      if (result.success && result.users) {
        setTotalUsers(result.users.length);
      } else {
        showError('⚠️ Không thể tải dữ liệu người dùng');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showError('❌ Lỗi khi tải dữ liệu');
    }
  };

  const loadTotalUniversities = async () => {
    try {
      const result = await getAllUniversities();
      if (result.success && result.universities) {
        setTotalUniversities(result.universities.length);
      }
    } catch (error) {
      console.error('Error loading universities:', error);
    }
  };

  const loadTotalPersonalTraits = async () => {
    try {
      const result = await getAllPersonalTraits();
      if (result.success && result.traits) {
        setTotalPersonalTraits(result.traits.length);
      }
    } catch (error) {
      console.error('Error loading personal traits:', error);
    }
  };

  const handleLogout = () => {
    logout(); // This will immediately redirect to /login
  };

  const handleRefresh = () => {
    loadData();
    showSuccess('Đã làm mới dữ liệu!');
  };

  if (authLoading || dataLoading) {
    return <Loading fullScreen message="Đang tải dữ liệu..." />;
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
            <UserDropdown
              user={user}
              isOpen={showDropdown}
              onToggle={() => setShowDropdown(!showDropdown)}
              onLogout={handleLogout}
              showAdminLinks={true}
            />
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
            to="/users"
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

          {/* Total Universities Card */}
          <Link 
            to="/universities"
            className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1 no-underline cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                🏛️
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase">Tổng số</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{totalUniversities}</h3>
            <p className="text-gray-600 font-medium">Trường đại học</p>
            <p className="text-xs text-indigo-600 font-semibold mt-2 flex items-center gap-1">
              <span>Xem chi tiết</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </p>
          </Link>

          {/* Total Personal Traits Card */}
          <Link 
            to="/personal-traits"
            className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-1 no-underline cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                🧠
              </div>
              <span className="text-sm font-semibold text-gray-500 uppercase">Tổng số</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-1">{totalPersonalTraits}</h3>
            <p className="text-gray-600 font-medium">Tính cách</p>
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
                onClick={handleRefresh}
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

      {/* Toast */}
      {toast && <Toast key={toast.id} {...toast} />}
    </div>
  );
}

export default Dashboard;
