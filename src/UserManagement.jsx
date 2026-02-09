import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from './services/authService';
import { getAllUsers, deleteUser, createUser, updateUserProfile } from './services/userService';
import { getAllRoles, createRole, updateRole, deleteRole } from './services/roleService';
import Toast from './components/Toast';

function UserManagement() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'roles'
  
  // User states
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'user', 'organization'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    fullname: '',
    email: '',
    DateOfBirth: '',
    isActive: true
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    roleid: '', // Will be set when modal opens
    DateOfBirth: ''
  });

  // Role states
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [roleStatusFilter, setRoleStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [createRoleData, setCreateRoleData] = useState({
    RoleName: ''
  });
  const [editRoleData, setEditRoleData] = useState({
    RoleName: '',
    Status: true
  });

  // Common states
  const [toast, setToast] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Check authentication and role
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const user = getCurrentUser();
    
    // Check if user is Admin
    if (!user?.role || user.role.toLowerCase() !== 'admin') {
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

    setCurrentUser(user);
    loadUsers();
    loadRoles(); // Load roles on mount
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await getAllUsers();
      
      if (result.success && result.users) {
        setUsers(result.users);
        setFilteredUsers(result.users);
      } else {
        setToast({
          message: '⚠️ Không thể tải danh sách người dùng',
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

  const loadRoles = async () => {
    try {
      setRolesLoading(true);
      const result = await getAllRoles();
      
      if (result.success && result.roles) {
        // Normalize role data - backend returns roleId, roleName, status (lowercase)
        const normalizedRoles = result.roles.map(role => ({
          RoleId: role.roleId || role.RoleId || role.id,
          RoleName: role.roleName || role.RoleName || role.name,
          Status: role.status !== undefined ? role.status : (role.Status !== undefined ? role.Status : true)
        }));
        setRoles(normalizedRoles);
        setFilteredRoles(normalizedRoles);
      } else {
        setToast({
          message: '⚠️ Không thể tải danh sách vai trò',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error loading roles:', error);
      setToast({
        message: '❌ Lỗi khi tải vai trò',
        type: 'error',
        duration: 3000
      });
    } finally {
      setRolesLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyUserFilters(query, roleFilter, statusFilter);
  };

  const handleRoleFilter = (filter) => {
    setRoleFilter(filter);
    applyUserFilters(searchQuery, filter, statusFilter);
  };

  const handleStatusFilter = (filter) => {
    setStatusFilter(filter);
    applyUserFilters(searchQuery, roleFilter, filter);
  };

  const applyUserFilters = (search, role, status) => {
    let filtered = users;

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(user => 
        user.fullname?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Role filter
    if (role !== 'all') {
      filtered = filtered.filter(user => 
        user.role?.toLowerCase() === role.toLowerCase()
      );
    }

    // Status filter
    if (status === 'active') {
      filtered = filtered.filter(user => user.isActive === true);
    } else if (status === 'inactive') {
      filtered = filtered.filter(user => user.isActive === false);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa người dùng "${userName}"?`)) {
      return;
    }

    try {
      const result = await deleteUser(userId);
      
      if (result.success) {
        setToast({
          message: '✅ Đã xóa người dùng thành công!',
          type: 'success',
          duration: 3000
        });
        loadUsers(); // Reload danh sách
      } else {
        // Show specific error message from BE
        const errorMessages = {
          'You cannot delete your own account.': '⚠️ Bạn không thể xóa tài khoản của chính mình!',
          'You cannot delete another admin.': '⚠️ Bạn không thể xóa tài khoản Admin khác!'
        };
        
        const message = errorMessages[result.message] || result.message || '❌ Không thể xóa người dùng';
        
        setToast({
          message: message,
          type: 'error',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setToast({
        message: '❌ Lỗi khi xóa người dùng',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      fullname: user.fullname || '',
      email: user.email || '',
      DateOfBirth: user.DateOfBirth || user.dateOfBirth || user.dateofbirth || '',
      isActive: user.isActive !== false
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateUserProfile(editingUser.userid, editFormData);
      
      if (result.success) {
        setToast({
          message: '✅ Cập nhật thông tin thành công!',
          type: 'success',
          duration: 3000
        });
        setShowEditModal(false);
        setEditingUser(null);
        loadUsers(); // Reload danh sách
      } else {
        setToast({
          message: result.message || '❌ Cập nhật thất bại',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setToast({
        message: '❌ Lỗi khi cập nhật thông tin',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createUser(createFormData);
      
      if (result.success) {
        setToast({
          message: '✅ Tạo người dùng mới thành công!',
          type: 'success',
          duration: 3000
        });
        setShowCreateModal(false);
        setCreateFormData({
          fullname: '',
          email: '',
          password: '',
          roleid: '',
          DateOfBirth: ''
        });
        loadUsers(); // Reload danh sách
      } else {
        setToast({
          message: result.message || '❌ Tạo người dùng thất bại',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setToast({
        message: '❌ Lỗi khi tạo người dùng',
        type: 'error',
        duration: 3000
      });
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

  // Role handlers
  const handleRoleSearch = (query) => {
    setRoleSearchQuery(query);
    applyRoleFilters(query, roleStatusFilter);
  };

  const handleRoleStatusFilter = (filter) => {
    setRoleStatusFilter(filter);
    applyRoleFilters(roleSearchQuery, filter);
  };

  const applyRoleFilters = (search, status) => {
    let filtered = roles;

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(role => 
        role.RoleName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status === 'active') {
      filtered = filtered.filter(role => role.Status === true);
    } else if (status === 'inactive') {
      filtered = filtered.filter(role => role.Status === false);
    }

    setFilteredRoles(filtered);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();

    try {
      const result = await createRole(createRoleData);
      
      if (result.success) {
        setToast({
          message: '✅ Tạo vai trò mới thành công!',
          type: 'success',
          duration: 3000
        });
        setShowCreateRoleModal(false);
        setCreateRoleData({ RoleName: '' });
        loadRoles();
      } else {
        setToast({
          message: result.message || '❌ Tạo vai trò thất bại',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error creating role:', error);
      setToast({
        message: '❌ Lỗi khi tạo vai trò',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleEditRoleClick = (role) => {
    setEditingRole(role);
    setEditRoleData({
      RoleName: role.RoleName || '',
      Status: role.Status !== false
    });
    setShowEditRoleModal(true);
  };

  const handleEditRole = async (e) => {
    e.preventDefault();

    try {
      const result = await updateRole(editingRole.RoleId, editRoleData);
      
      if (result.success) {
        setToast({
          message: '✅ Cập nhật vai trò thành công!',
          type: 'success',
          duration: 3000
        });
        setShowEditRoleModal(false);
        setEditingRole(null);
        loadRoles();
      } else {
        setToast({
          message: result.message || '❌ Cập nhật thất bại',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setToast({
        message: '❌ Lỗi khi cập nhật vai trò',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleDeleteRole = async (roleId, roleName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa vai trò "${roleName}"?\n\nLưu ý: Đây là xóa mềm, vai trò sẽ bị vô hiệu hóa.`)) {
      return;
    }

    try {
      const result = await deleteRole(roleId);
      
      if (result.success) {
        setToast({
          message: '✅ Đã xóa vai trò thành công!',
          type: 'success',
          duration: 3000
        });
        loadRoles();
      } else {
        setToast({
          message: result.message || '❌ Không thể xóa vai trò',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      setToast({
        message: '❌ Lỗi khi xóa vai trò',
        type: 'error',
        duration: 3000
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([loadUsers(), loadRoles()]);
      setToast({
        message: '✅ Đã làm mới dữ liệu!',
        type: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('Error refreshing:', error);
      setToast({
        message: '❌ Lỗi khi làm mới',
        type: 'error',
        duration: 3000
      });
    } finally {
      setIsRefreshing(false);
    }
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard" 
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 no-underline"
              title="Quay về Dashboard"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <Link to="/dashboard" className="text-2xl font-bold text-indigo-600 no-underline hover:text-purple-600 transition-colors">
              EduPath
            </Link>
            <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full">
              ADMIN
            </span>
          </div>

          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {currentUser.fullname?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="font-semibold text-gray-700">{currentUser.fullname || 'Admin'}</span>
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
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Refresh Button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý hệ thống</h1>
            <p className="text-gray-600 mt-1">Quản lý người dùng và vai trò</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRefreshing ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl mr-2">👥</span>
            Quản lý người dùng
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'roles'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Quản lý vai trò
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý người dùng</h1>
                <p className="text-gray-600">Tổng số: {filteredUsers.length} người dùng</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Tạo người dùng mới
              </button>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                {/* Role Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-600">Vai trò:</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => handleRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                  >
                    <option value="all">Tất cả</option>
                    {roles.map(role => (
                      <option key={role.RoleId} value={role.RoleName}>{role.RoleName}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-600">Trạng thái:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                  >
                    <option value="all">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 px-4 py-2 border-0 focus:outline-none focus:ring-0 text-gray-700"
                />
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 font-semibold"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Họ tên</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Vai trò</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Ngày sinh</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          {searchQuery ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.userid} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-700 font-medium">{user.userid}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {user.fullname?.charAt(0).toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800">{user.fullname || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{user.email || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role?.toLowerCase() === 'admin' 
                                ? 'bg-amber-100 text-amber-700'
                                : user.role?.toLowerCase() === 'organization'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {user.role?.toLowerCase() === 'admin' && '👑'}
                              {user.role?.toLowerCase() === 'organization' && '🏢'}
                              {user.role?.toLowerCase() === 'user' && '👤'}
                              <span className="ml-1">{user.role || 'N/A'}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">{formatDate(user.DateOfBirth || user.dateOfBirth || user.dateofbirth)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(user)}
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Sửa
                              </button>
                              <button
                                onClick={() => handleDelete(user.userid, user.fullname || user.email)}
                                className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý vai trò</h1>
                <p className="text-gray-600">Tổng số: {filteredRoles.length} vai trò</p>
              </div>
              <button
                onClick={() => setShowCreateRoleModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Tạo vai trò mới
              </button>
            </div>

            {/* Role Filters and Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-600">Trạng thái:</label>
                  <select
                    value={roleStatusFilter}
                    onChange={(e) => handleRoleStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
                  >
                    <option value="all">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentControl" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên vai trò..."
                  value={roleSearchQuery}
                  onChange={(e) => handleRoleSearch(e.target.value)}
                  className="flex-1 px-4 py-2 border-0 focus:outline-none focus:ring-0 text-gray-700"
                />
                {roleSearchQuery && (
                  <button
                    onClick={() => handleRoleSearch('')}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 font-semibold"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* Roles Table */}
            {rolesLoading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-700 font-semibold">Đang tải vai trò...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Tên vai trò</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredRoles.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                            {roleSearchQuery ? 'Không tìm thấy vai trò nào' : 'Chưa có vai trò nào'}
                          </td>
                        </tr>
                      ) : (
                        filteredRoles.map((role) => (
                          <tr key={role.RoleId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">{role.RoleId}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-gray-800">{role.RoleName || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                role.Status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${role.Status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {role.Status ? 'Hoạt động' : 'Không hoạt động'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditRoleClick(role)}
                                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteRole(role.RoleId, role.RoleName)}
                                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Xóa
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo người dùng mới</h2>
            
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createFormData.fullname}
                  onChange={(e) => setCreateFormData({...createFormData, fullname: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={createFormData.password}
                  onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                  minLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  value={createFormData.roleid}
                  onChange={(e) => setCreateFormData({...createFormData, roleid: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Chọn vai trò</option>
                  {roles
                    .filter(role => role.Status) // Only show active roles
                    .map(role => (
                      <option key={role.RoleId} value={role.RoleId}>
                        {role.RoleName}
                      </option>
                    ))}
                </select>
                {roles.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">⚠️ Chưa có vai trò nào. Vui lòng tạo vai trò trước.</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={createFormData.DateOfBirth}
                  onChange={(e) => setCreateFormData({...createFormData, DateOfBirth: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Tạo người dùng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateFormData({
                      fullname: '',
                      email: '',
                      password: '',
                      roleid: '',
                      DateOfBirth: ''
                    });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa thông tin</h2>
            
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.fullname}
                  onChange={(e) => setEditFormData({...editFormData, fullname: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={editFormData.DateOfBirth}
                  onChange={(e) => setEditFormData({...editFormData, DateOfBirth: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-200 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  {editFormData.isActive ? '✅ Tài khoản đang hoạt động' : '❌ Tài khoản bị vô hiệu hóa'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
                >
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration || 3000}
          onClose={() => setToast(null)}
        />
      )}

      {/* Create Role Modal */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo vai trò mới</h2>
            
            <form onSubmit={handleCreateRole}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên vai trò <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createRoleData.RoleName}
                  onChange={(e) => setCreateRoleData({...createRoleData, RoleName: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Ví dụ: Moderator, Editor, Viewer..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Vai trò mới sẽ được tạo với trạng thái hoạt động</p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Tạo vai trò
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateRoleModal(false);
                    setCreateRoleData({ RoleName: '' });
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {showEditRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa vai trò</h2>
            
            <form onSubmit={handleEditRole}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên vai trò <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editRoleData.RoleName}
                  onChange={(e) => setEditRoleData({...editRoleData, RoleName: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editRoleData.Status}
                      onChange={(e) => setEditRoleData({...editRoleData, Status: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-200 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  {editRoleData.Status ? '✅ Vai trò đang hoạt động' : '❌ Vai trò bị vô hiệu hóa'}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
                >
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditRoleModal(false);
                    setEditingRole(null);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
