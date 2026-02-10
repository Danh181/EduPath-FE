import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import { useModal } from './hooks/useModal';
import { useSearch } from './hooks/useSearch';
import { useCRUD } from './hooks/useCRUD';
import {getAllUniversities, createUniversity, updateUniversity, deleteUniversity } from './services/universityService';
import { getAllMajors, createMajor, updateMajor, deleteMajor } from './services/majorService';
import { logout } from './services/authService';
import { Modal, SearchBar, FilterDropdown, UserDropdown, Loading, ConfirmDialog } from './components/shared';
import UniversityTable from './components/university/UniversityTable';
import UniversityForm from './components/university/UniversityForm';
import MajorTable from './components/major/MajorTable';
import MajorForm from './components/major/MajorForm';
import Toast from './components/Toast';

function UniversityManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('universities');
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
  const createUniversityModal = useModal();
  const editUniversityModal = useModal();
  const createMajorModal = useModal();
  const editMajorModal = useModal();

  // Universities CRUD
  const universityCRUD = useCRUD({
    getAll: getAllUniversities,
    create: createUniversity,
    update: updateUniversity,
    delete: deleteUniversity
  }, {
    onSuccess: (msg) => showSuccess(msg),
    onError: (msg) => showError(msg)
  });

  // Majors CRUD
  const majorCRUD = useCRUD({
    getAll: getAllMajors,
    create: createMajor,
    update: updateMajor,
    delete: deleteMajor
  }, {
    onSuccess: (msg) => showSuccess(msg),
    onError: (msg) => showError(msg)
  });

  // Search & Filter for Universities
  const universitySearch = useSearch(universityCRUD.data, {
    searchFields: ['universityName', 'location'],
    filterField: 'status',
    initialFilter: 'all'
  });

  // Search & Filter for Majors
  const majorSearch = useSearch(majorCRUD.data, {
    searchFields: ['majorName', 'description'],
    filterField: 'status',
    initialFilter: 'all'
  });

  // Load data on mount
  useEffect(() => {
    if (user) {
      universityCRUD.loadData();
      majorCRUD.loadData();
    }
  }, [user]);

  // Show auth error
  useEffect(() => {
    if (authError) {
      showError(authError);
    }
  }, [authError]);

  // Handlers for Universities
  const handleCreateUniversity = async (formData) => {
    const result = await universityCRUD.createItem(formData);
    if (result.success) {
      createUniversityModal.close();
    }
  };

  const handleEditUniversity = async (formData) => {
    if (editUniversityModal.data) {
      const result = await universityCRUD.updateItem(editUniversityModal.data.universityId, formData);
      if (result.success) {
        editUniversityModal.close();
      }
    }
  };

  const handleDeleteUniversity = async () => {
    if (deleteConfirm.id) {
      await universityCRUD.deleteItem(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null, name: '', type: '' });
    }
  };

  // Handlers for Majors
  const handleCreateMajor = async (formData) => {
    const result = await majorCRUD.createItem(formData);
    if (result.success) {
      createMajorModal.close();
    }
  };

  const handleEditMajor = async (formData) => {
    if (editMajorModal.data) {
      const result = await majorCRUD.updateItem(editMajorModal.data.majorId, formData);
      if (result.success) {
        editMajorModal.close();
      }
    }
  };

  const handleDeleteMajor = async () => {
    if (deleteConfirm.id) {
      await majorCRUD.deleteItem(deleteConfirm.id);
      setDeleteConfirm({ isOpen: false, id: null, name: '', type: '' });
    }
  };

  const handleLogout = () => {
    logout(); // This will immediately redirect to /login
  };

  if (authLoading || universityCRUD.loading) {
    return <Loading fullScreen message="Đang tải dữ liệu..." />;
  }

  const statusFilterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' }
  ];

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
            onClick={() => setActiveTab('universities')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'universities'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏛️ Quản lý trường đại học
          </button>
          <button
            onClick={() => setActiveTab('majors')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'majors'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📚 Quản lý ngành học
          </button>
        </div>

        {/* Universities Tab */}
        {activeTab === 'universities' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý trường đại học</h1>
                <p className="text-gray-600">Tổng số: {universitySearch.resultCount} trường</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => universityCRUD.loadData()}
                  disabled={universityCRUD.loading}
                  className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Làm mới dữ liệu"
                >
                  <svg className={`w-5 h-5 ${universityCRUD.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden md:inline">Làm mới</span>
                </button>
                <button
                  onClick={() => createUniversityModal.open()}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm trường mới
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <FilterDropdown
                  value={universitySearch.filter}
                  onChange={universitySearch.setFilter}
                  options={statusFilterOptions}
                />
              </div>
              <SearchBar
                value={universitySearch.searchQuery}
                onChange={universitySearch.setSearchQuery}
                placeholder="Tìm kiếm theo tên trường hoặc địa điểm..."
                onClear={universitySearch.clearSearch}
              />
            </div>

            {/* Universities Table */}
            <UniversityTable
              universities={universitySearch.filteredData}
              onEdit={(uni) => editUniversityModal.open(uni)}
              onDelete={(id, name) => setDeleteConfirm({ isOpen: true, id, name, type: 'university' })}
              isLoading={universityCRUD.loading}
            />
          </>
        )}

        {/* Majors Tab */}
        {activeTab === 'majors' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý ngành học</h1>
                <p className="text-gray-600">Tổng số: {majorSearch.resultCount} ngành</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => majorCRUD.loadData()}
                  disabled={majorCRUD.loading}
                  className="px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Làm mới dữ liệu"
                >
                  <svg className={`w-5 h-5 ${majorCRUD.loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden md:inline">Làm mới</span>
                </button>
                <button
                  onClick={() => createMajorModal.open()}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm ngành mới
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <FilterDropdown
                  value={majorSearch.filter}
                  onChange={majorSearch.setFilter}
                  options={statusFilterOptions}
                />
              </div>
              <SearchBar
                value={majorSearch.searchQuery}
                onChange={majorSearch.setSearchQuery}
                placeholder="Tìm kiếm theo tên ngành hoặc mô tả..."
                onClear={majorSearch.clearSearch}
              />
            </div>

            {/* Majors Table */}
            <MajorTable
              majors={majorSearch.filteredData}
              onEdit={(major) => editMajorModal.open(major)}
              onDelete={(id, name) => setDeleteConfirm({ isOpen: true, id, name, type: 'major' })}
              isLoading={majorCRUD.loading}
            />
          </>
        )}
      </main>

      {/* Modals */}
      <Modal
        isOpen={createUniversityModal.isOpen}
        onClose={createUniversityModal.close}
        title="Thêm trường đại học mới"
        size="medium"
      >
        <UniversityForm
          onSubmit={handleCreateUniversity}
          onCancel={createUniversityModal.close}
          isEdit={false}
        />
      </Modal>

      <Modal
        isOpen={editUniversityModal.isOpen}
        onClose={editUniversityModal.close}
        title="Chỉnh sửa thông tin trường"
        size="medium"
      >
        <UniversityForm
          university={editUniversityModal.data}
          onSubmit={handleEditUniversity}
          onCancel={editUniversityModal.close}
          isEdit={true}
        />
      </Modal>

      <Modal
        isOpen={createMajorModal.isOpen}
        onClose={createMajorModal.close}
        title="Thêm ngành học mới"
        size="medium"
      >
        <MajorForm
          onSubmit={handleCreateMajor}
          onCancel={createMajorModal.close}
          isEdit={false}
        />
      </Modal>

      <Modal
        isOpen={editMajorModal.isOpen}
        onClose={editMajorModal.close}
        title="Chỉnh sửa thông tin ngành"
        size="medium"
      >
        <MajorForm
          major={editMajorModal.data}
          onSubmit={handleEditMajor}
          onCancel={editMajorModal.close}
          isEdit={true}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onConfirm={deleteConfirm.type === 'university' ? handleDeleteUniversity : handleDeleteMajor}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: '', type: '' })}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa "${deleteConfirm.name}"?\n\nLưu ý: Đây là xóa mềm, ${deleteConfirm.type === 'university' ? 'trường' : 'ngành'} sẽ bị vô hiệu hóa.`}
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />

      {/* Toast */}
      {toast && <Toast key={toast.id} {...toast} />}
    </div>
  );
}

export default UniversityManagement;
