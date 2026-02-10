import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { useModal } from './hooks/useModal';
import { useMultiFilter } from './hooks/useSearch';
import { useCRUD } from './hooks/useCRUD';
import { getUsersByOrganization, deleteUser, createUser, updateUserProfile } from './services/userService';
import { getAllRoles } from './services/roleService';
import { logout } from './services/authService';
import { Modal, SearchBar, FilterDropdown, UserDropdown, Loading, ConfirmDialog } from './components/shared';
import UserTable from './components/user/UserTable';
import Toast from './components/Toast';
import { jwtDecode } from 'jwt-decode';

function OrganizationDashboard() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });
  const [organizationId, setOrganizationId] = useState(null);

  // Auth
  const { user, loading: authLoading, error: authError } = useAuth({
    requireAuth: true,
    requireRole: 'organization',
    redirectTo: '/'
  });

  // Toast
  const { toast, showSuccess, showError, showToast } = useToast();

  // Modals
  const createUserModal = useModal();
  const editUserModal = useModal();

  // Users CRUD (using organization-specific endpoint)
  const userCRUD = useCRUD({
    getAll: getUsersByOrganization,
    create: createUser,
    update: updateUserProfile,
    delete: deleteUser
  }, {
    onSuccess: (msg) => showSuccess(msg),
    onError: (msg) => showError(msg)
  });

  // Roles CRUD (just for loading roles)
  const roleCRUD = useCRUD({
    getAll: getAllRoles
  }, {
    onSuccess: () => {},
    onError: (msg) => showError(msg)
  });

  // Get organizationId from JWT token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const orgId = decoded.organizationid || decoded.OrganizationId || decoded.organizationId;
        setOrganizationId(orgId);
      } catch (error) {
        console.error('Error decoding token:', error);
        showError('Không thể lấy thông tin organization');
      }
    }
  }, []);

  // Normalize user data (no need to filter, API already returns organization's users)
  const normalizedUsers = useMemo(() => {
    return userCRUD.data.map(user => ({
      ...user,
      DateOfBirth: user.DateOfBirth || user.dateOfBirth || user.dateofbirth || null,
      roleid: user.roleid || user.roleId,
      userid: user.userid || user.userId
    }));
  }, [userCRUD.data]);

  // Multi-filter for Users (search + role filter + status filter)
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const userFilters = useMultiFilter(normalizedUsers, {
    role: 'all',
    isActive: 'all'
  });

  // Apply search on top of filters
  const filteredUsers = userFilters.filteredData.filter(u => {
    if (!userSearchQuery.trim()) return true;
    const query = userSearchQuery.toLowerCase();
    return (
      u.fullname?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  });

  // Normalize role data
  const normalizedRoles = useMemo(() => {
    return roleCRUD.data.map(role => ({
      ...role,
      roleid: role.roleId || role.roleid,
      RoleName: role.roleName || role.RoleName,
      Status: role.Status ?? role.status
    }));
  }, [roleCRUD.data]);

  // Load data on mount
  useEffect(() => {
    if (user && organizationId) {
      userCRUD.loadData();
      roleCRUD.loadData();
    }
  }, [user, organizationId]);

  // Show auth error
  useEffect(() => {
    if (authError) {
      showError(authError);
    }
  }, [authError]);

  // Handlers for Users
  const handleCreateUser = async (formData) => {
    // Auto-assign organizationId and role
    const userData = {
      ...formData,
      organizationid: organizationId,
      roleid: normalizedRoles.find(r => r.RoleName.toLowerCase() === 'user')?.roleid || 4
    };
    
    const result = await userCRUD.createItem(userData);
    if (result.success) {
      createUserModal.close();
      userCRUD.loadData();
    }
  };

  const handleEditUser = async (formData) => {
    if (editUserModal.data) {
      const result = await userCRUD.updateItem(editUserModal.data.userid, formData);
      if (result.success) {
        editUserModal.close();
        userCRUD.loadData();
      }
    }
  };

  const handleDeleteUser = async () => {
    if (deleteConfirm.id) {
      await userCRUD.deleteItem(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
      userCRUD.loadData();
    }
  };

  const handleLogout = () => {
    logout(); // This will immediately redirect to /login
  };

  if (authLoading || userCRUD.loading || !organizationId) {
    return <Loading fullScreen message="Đang tải dữ liệu..." />;
  }

  const statusFilterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' }
  ];

  // Get unique roles for filter
  const roleFilterOptions = [
    { value: 'all', label: 'Tất cả vai trò' },
    ...Array.from(new Set(normalizedUsers.map(u => u.role)))
      .filter(Boolean)
      .map(role => ({ value: role, label: role }))
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 no-underline"
              title="Về trang chủ"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <Link to="/" className="text-2xl font-bold text-indigo-600 no-underline hover:text-purple-600 transition-colors">
              EduPath
            </Link>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs font-bold rounded-full">
              ORGANIZATION
            </span>
          </div>

          {user && (
            <UserDropdown
              user={user}
              isOpen={showDropdown}
              onToggle={() => setShowDropdown(!showDropdown)}
              onLogout={handleLogout}
              showAdminLinks={false}
            />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Card */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Quản lý người dùng</h2>
                <p className="text-indigo-100">Quản lý thành viên trong tổ chức của bạn</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold mb-2">{filteredUsers.length}</div>
                <div className="text-indigo-100">Tổng số người dùng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Management */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Danh sách người dùng</h1>
            <p className="text-gray-600">Tổng số: {filteredUsers.length} người dùng</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => userCRUD.loadData()}
              disabled={userCRUD.loading}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Làm mới dữ liệu"
            >
              <svg className={`w-5 h-5 ${userCRUD.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden md:inline">Làm mới</span>
            </button>
            <button
              onClick={() => createUserModal.open()}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Thêm người dùng
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <FilterDropdown
              value={userFilters.filters.role}
              onChange={(val) => userFilters.setFilter('role', val)}
              options={roleFilterOptions}
            />
            <FilterDropdown
              value={userFilters.filters.isActive === 'all' ? 'all' : userFilters.filters.isActive ? 'active' : 'inactive'}
              onChange={(val) => {
                if (val === 'all') userFilters.setFilter('isActive', 'all');
                else if (val === 'active') userFilters.setFilter('isActive', true);
                else userFilters.setFilter('isActive', false);
              }}
              options={statusFilterOptions}
            />
          </div>
          <SearchBar
            value={userSearchQuery}
            onChange={setUserSearchQuery}
            placeholder="Tìm kiếm theo tên hoặc email..."
            onClear={() => setUserSearchQuery('')}
          />
        </div>

        {/* Users Table */}
        <UserTable
          users={filteredUsers}
          onEdit={(user) => editUserModal.open(user)}
          onDelete={(id, name) => setDeleteConfirm({ isOpen: true, id, name })}
          isLoading={userCRUD.loading}
          showRole={false}
        />
      </main>

      {/* Create User Modal */}
      <Modal
        isOpen={createUserModal.isOpen}
        onClose={createUserModal.close}
        title="Thêm người dùng mới"
        size="medium"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleCreateUser({
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            DateOfBirth: formData.get('dateOfBirth'), // BE expects PascalCase
            password: formData.get('password')
          });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Nhập họ tên"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              required
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              minLength="6"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
              placeholder="Tối thiểu 6 ký tự"
            />
            <p className="text-xs text-gray-500 mt-1">Người dùng sẽ được tạo với vai trò User</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={createUserModal.close}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
            >
              Tạo người dùng
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editUserModal.isOpen}
        onClose={editUserModal.close}
        title="Chỉnh sửa thông tin người dùng"
        size="medium"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          handleEditUser({
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            DateOfBirth: formData.get('dateOfBirth') || null,
            isActive: formData.get('isActive') === 'true'
          });
        }} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullname"
              required
              defaultValue={editUserModal.data?.fullname || ''}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              defaultValue={editUserModal.data?.email || ''}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              name="dateOfBirth"
              defaultValue={editUserModal.data?.DateOfBirth || ''}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trạng thái
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  defaultChecked={editUserModal.data?.isActive !== false}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Hoạt động</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  defaultChecked={editUserModal.data?.isActive === false}
                  className="w-4 h-4 text-indigo-600"
                />
                <span className="text-sm text-gray-700">Không hoạt động</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={editUserModal.close}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn vô hiệu hóa người dùng "${deleteConfirm.name}"?\n\nLưu ý: Đây là xóa mềm, người dùng sẽ bị vô hiệu hóa.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

      {/* Toast */}
      {toast && <Toast key={toast.id} {...toast} />}
    </div>
  );
}

export default OrganizationDashboard;
