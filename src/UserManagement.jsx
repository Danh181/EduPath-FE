import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { useModal } from './hooks/useModal';
import { useMultiFilter } from './hooks/useSearch';
import { useCRUD } from './hooks/useCRUD';
import { getAllUsers, deleteUser, createUser, updateUserProfile } from './services/userService';
import { getAllRoles, createRole, updateRole, deleteRole } from './services/roleService';
import { Modal, SearchBar, FilterDropdown, UserDropdown, Loading, ConfirmDialog } from './components/shared';
import UserTable from './components/user/UserTable';
import UserForm from './components/user/UserForm';
import RoleTable from './components/role/RoleTable';
import RoleForm from './components/role/RoleForm';
import Toast from './components/Toast';

function UserManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '', type: '' });

  // Auth
  const { user, loading: authLoading, error: authError } = useAuth({
    requireAuth: true,
    requireRole: 'admin',
    redirectTo: '/'
  });

  // Toast
  const { toast, showSuccess, showError, showToast } = useToast();

  // Modals
  const createUserModal = useModal();
  const editUserModal = useModal();
  const createRoleModal = useModal();
  const editRoleModal = useModal();

  // Users CRUD
  const userCRUD = useCRUD({
    getAll: getAllUsers,
    create: createUser,
    update: updateUserProfile,
    delete: deleteUser
  }, {
    onSuccess: (msg) => showSuccess(msg),
    onError: (msg) => showError(msg)
  });

  // Roles CRUD
  const roleCRUD = useCRUD({
    getAll: getAllRoles,
    create: createRole,
    update: updateRole,
    delete: deleteRole
  }, {
    onSuccess: (msg) => showSuccess(msg),
    onError: (msg) => showError(msg)
  });

  // Normalize user data from BE to ensure consistent field names
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

  // Normalize role data from BE (roleId, roleName, status) to FE format (roleid, RoleName, Status)
  const normalizedRoles = useMemo(() => {
    return roleCRUD.data.map(role => ({
      ...role,
      roleid: role.roleId || role.roleid,
      RoleName: role.roleName || role.RoleName,
      Status: role.Status ?? role.status
    }));
  }, [roleCRUD.data]);

  // Multi-filter for Roles
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const roleFilters = useMultiFilter(normalizedRoles, {
    Status: 'all'
  });

  const filteredRoles = roleFilters.filteredData.filter(r => {
    if (!roleSearchQuery.trim()) return true;
    const query = roleSearchQuery.toLowerCase();
    return r.RoleName?.toLowerCase().includes(query);
  });

  // Load data on mount
  useEffect(() => {
    if (user) {
      userCRUD.loadData();
      roleCRUD.loadData();
    }
  }, [user]);

  // Show auth error
  useEffect(() => {
    if (authError) {
      showError(authError);
    }
  }, [authError]);

  // Handlers for Users
  const handleCreateUser = async (formData) => {
    const result = await userCRUD.createItem(formData);
    if (result.success) {
      createUserModal.close();
    }
  };

  const handleEditUser = async (formData) => {
    if (editUserModal.data) {
      const result = await userCRUD.updateItem(editUserModal.data.userid, formData);
      if (result.success) {
        editUserModal.close();
      }
    }
  };

  const handleDeleteUser = async () => {
    if (deleteConfirm.id) {
      await userCRUD.deleteItem(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null, name: '', type: '' });
    }
  };

  // Handlers for Roles
  const handleCreateRole = async (formData) => {
    const result = await roleCRUD.createItem(formData);
    if (result.success) {
      createRoleModal.close();
    }
  };

  const handleEditRole = async (formData) => {
    if (editRoleModal.data) {
      const result = await roleCRUD.updateItem(editRoleModal.data.roleid, formData);
      if (result.success) {
        editRoleModal.close();
      }
    }
  };

  const handleDeleteRole = async () => {
    if (deleteConfirm.id) {
      await roleCRUD.deleteItem(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null, name: '', type: '' });
    }
  };

  const handleLogout = () => {
    showToast('👋 Đã đăng xuất thành công!', 'success', 1500);
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  if (authLoading || userCRUD.loading) {
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
    ...Array.from(new Set(userCRUD.data.map(u => u.role)))
      .filter(Boolean)
      .map(role => ({ value: role, label: role }))
  ];

  // Helper function to get status filter value
  const getUserStatusValue = (isActive) => {
    if (isActive === 'all') return 'all';
    return isActive ? 'active' : 'inactive';
  };

  const getRoleStatusValue = (Status) => {
    if (Status === 'all') return 'all';
    return Status ? 'active' : 'inactive';
  };

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
      <main className="max-w-7xl mx-auto px-6 py-8">
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
            👥 Quản lý người dùng
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'roles'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎭 Quản lý vai trò
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
                onClick={() => createUserModal.open()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Thêm người dùng
              </button>
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
                  value={getUserStatusValue(userFilters.filters.isActive)}
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
              onEdit={(u) => editUserModal.open(u)}
              onDelete={(id, name) => setDeleteConfirm({ isOpen: true, id, name, type: 'user' })}
              isLoading={userCRUD.loading}
            />
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
                onClick={() => createRoleModal.open()}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Thêm vai trò mới
              </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <FilterDropdown
                  value={getRoleStatusValue(roleFilters.filters.Status)}
                  onChange={(val) => {
                    if (val === 'all') roleFilters.setFilter('Status', 'all');
                    else if (val === 'active') roleFilters.setFilter('Status', true);
                    else roleFilters.setFilter('Status', false);
                  }}
                  options={statusFilterOptions}
                />
              </div>
              <SearchBar
                value={roleSearchQuery}
                onChange={setRoleSearchQuery}
                placeholder="Tìm kiếm theo tên vai trò..."
                onClear={() => setRoleSearchQuery('')}
              />
            </div>

            {/* Roles Table */}
            <RoleTable
              roles={filteredRoles}
              onEdit={(role) => editRoleModal.open(role)}
              onDelete={(id, name) => setDeleteConfirm({ isOpen: true, id, name, type: 'role' })}
              isLoading={roleCRUD.loading}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={createUserModal.isOpen}
        onClose={createUserModal.close}
        title="Thêm người dùng mới"
        size="medium"
      >
        <UserForm
          roles={normalizedRoles}
          onSubmit={handleCreateUser}
          onCancel={createUserModal.close}
          isEdit={false}
        />
      </Modal>

      <Modal
        isOpen={editUserModal.isOpen}
        onClose={editUserModal.close}
        title="Chỉnh sửa thông tin người dùng"
        size="medium"
      >
        <UserForm
          user={editUserModal.data}
          roles={normalizedRoles}
          onSubmit={handleEditUser}
          onCancel={editUserModal.close}
          isEdit={true}
        />
      </Modal>

      <Modal
        isOpen={createRoleModal.isOpen}
        onClose={createRoleModal.close}
        title="Thêm vai trò mới"
        size="small"
      >
        <RoleForm
          onSubmit={handleCreateRole}
          onCancel={createRoleModal.close}
          isEdit={false}
        />
      </Modal>

      <Modal
        isOpen={editRoleModal.isOpen}
        onClose={editRoleModal.close}
        title="Chỉnh sửa thông tin vai trò"
        size="small"
      >
        <RoleForm
          role={editRoleModal.data}
          onSubmit={handleEditRole}
          onCancel={editRoleModal.close}
          isEdit={true}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onConfirm={deleteConfirm.type === 'user' ? handleDeleteUser : handleDeleteRole}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: '', type: '' })}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa "${deleteConfirm.name}"?${deleteConfirm.type === 'user' ? '\n\nLưu ý: Đây là xóa mềm, người dùng sẽ bị vô hiệu hóa.' : ''}`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

      {/* Toast */}
      {toast && <Toast key={toast.id} {...toast} />}
    </div>
  );
}

export default UserManagement;
