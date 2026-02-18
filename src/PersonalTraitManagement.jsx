import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { useModal } from './hooks/useModal';
import { useMultiFilter } from './hooks/useSearch';
import { useCRUD } from './hooks/useCRUD';
import { getAllPersonalTraits, updatePersonalTrait, deletePersonalTrait } from './services/personalTraitService';
import { logout } from './services/authService';
import { Modal, SearchBar, FilterDropdown, UserDropdown, Loading, ConfirmDialog } from './components/shared';
import PersonalTraitTable from './components/personalTrait/PersonalTraitTable';
import PersonalTraitForm from './components/personalTrait/PersonalTraitForm';
import Toast from './components/Toast';

function PersonalTraitManagement() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });

  // Auth
  const { user, loading: authLoading, error: authError } = useAuth({
    requireAuth: true,
    requireRole: 'admin',
    redirectTo: '/'
  });

  // Toast
  const { toast, showSuccess, showError } = useToast();

  // Modals
  const editTraitModal = useModal();

  // PersonalTraits CRUD (no create endpoint)
  const traitCRUD = useCRUD({
    getAll: getAllPersonalTraits,
    update: updatePersonalTrait,
    delete: deletePersonalTrait
  }, {
    onSuccess: (msg) => showSuccess(msg),
    onError: (msg) => showError(msg)
  });

  // Normalize PersonalTrait data
  const normalizedTraits = useMemo(() => {
    return traitCRUD.data.map(trait => ({
      ...trait,
      TraitCode: trait.TraitCode || trait.traitCode,
      TraitName: trait.TraitName || trait.traitName,
      status: trait.status ?? trait.Status
    }));
  }, [traitCRUD.data]);

  // Multi-filter for PersonalTraits
  const [traitSearchQuery, setTraitSearchQuery] = useState('');
  const traitFilters = useMultiFilter(normalizedTraits, {
    status: 'all'
  });

  const filteredTraits = traitFilters.filteredData.filter(t => {
    if (!traitSearchQuery.trim()) return true;
    const query = traitSearchQuery.toLowerCase();
    return (
      t.TraitCode?.toLowerCase().includes(query) ||
      t.TraitName?.toLowerCase().includes(query)
    );
  });

  // Load data on mount
  useEffect(() => {
    if (user) {
      traitCRUD.loadData();
    }
  }, [user]);

  // Show auth error
  useEffect(() => {
    if (authError) {
      showError(authError);
    }
  }, [authError]);

  // Handlers for PersonalTraits
  const handleEditTrait = async (formData) => {
    if (editTraitModal.data) {
      const result = await traitCRUD.updateItem(editTraitModal.data.TraitCode, formData);
      if (result.success) {
        editTraitModal.close();
        traitCRUD.loadData();
      }
    }
  };

  const handleDeleteTrait = async () => {
    if (deleteConfirm.id) {
      await traitCRUD.deleteItem(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
      traitCRUD.loadData();
    }
  };

  const handleLogout = () => {
    logout();
  };

  const getStatusValue = (status) => {
    if (status === 'all') return 'all';
    return status ? 'active' : 'inactive';
  };

  const statusFilterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' }
  ];

  if (authLoading || traitCRUD.loading) {
    return <Loading fullScreen message="Đang tải dữ liệu..." />;
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🧠 Quản lý tính cách</h1>
            <p className="text-gray-600">Tổng số: {filteredTraits.length} tính cách</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => traitCRUD.loadData()}
              disabled={traitCRUD.loading}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Làm mới dữ liệu"
            >
              <svg className={`w-5 h-5 ${traitCRUD.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden md:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <FilterDropdown
              value={getStatusValue(traitFilters.filters.status)}
              onChange={(val) => {
                if (val === 'all') traitFilters.setFilter('status', 'all');
                else if (val === 'active') traitFilters.setFilter('status', true);
                else traitFilters.setFilter('status', false);
              }}
              options={statusFilterOptions}
            />
          </div>
          <SearchBar
            value={traitSearchQuery}
            onChange={setTraitSearchQuery}
            placeholder="Tìm kiếm theo mã hoặc tên tính cách..."
            onClear={() => setTraitSearchQuery('')}
          />
        </div>

        {/* PersonalTraits Table */}
        <PersonalTraitTable
          traits={filteredTraits}
          onEdit={(trait) => editTraitModal.open(trait)}
          onDelete={(code, name) => setDeleteConfirm({ isOpen: true, id: code, name })}
          isLoading={traitCRUD.loading}
        />
      </main>

      {/* Edit Modal */}
      <Modal
        isOpen={editTraitModal.isOpen}
        onClose={editTraitModal.close}
        title="Chỉnh sửa thông tin tính cách"
        size="small"
      >
        <PersonalTraitForm
          trait={editTraitModal.data}
          onSubmit={handleEditTrait}
          onCancel={editTraitModal.close}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onConfirm={handleDeleteTrait}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa tính cách "${deleteConfirm.name}"?\n\nLưu ý: Đây là xóa mềm, tính cách sẽ bị vô hiệu hóa.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

      {/* Toast */}
      {toast && <Toast key={toast.id} {...toast} />}
    </div>
  );
}

export default PersonalTraitManagement;
