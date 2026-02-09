import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from './services/authService';
import { getAllUniversities, createUniversity, updateUniversity, deleteUniversity } from './services/universityService';
import { getAllMajors, createMajor, updateMajor, deleteMajor } from './services/majorService';
import Toast from './components/Toast';

function UniversityManagement() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('universities'); // 'universities' or 'majors'
  
  // University states
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [universityStatusFilter, setUniversityStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  // Create modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    universityName: '',
    location: ''
  });

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [editFormData, setEditFormData] = useState({
    universityName: '',
    location: '',
    status: true
  });

  // Major states
  const [majors, setMajors] = useState([]);
  const [filteredMajors, setFilteredMajors] = useState([]);
  const [majorsLoading, setMajorsLoading] = useState(false);
  const [majorSearchQuery, setMajorSearchQuery] = useState('');
  const [majorStatusFilter, setMajorStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [showCreateMajorModal, setShowCreateMajorModal] = useState(false);
  const [showEditMajorModal, setShowEditMajorModal] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [createMajorData, setCreateMajorData] = useState({
    majorName: '',
    description: ''
  });
  const [editMajorData, setEditMajorData] = useState({
    majorName: '',
    description: '',
    status: true
  });

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
    loadUniversities();
    loadMajors(); // Load majors on mount
  }, [navigate]);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      const result = await getAllUniversities();
      
      if (result.success && result.universities) {
        // Normalize field names
        const normalized = result.universities.map(uni => ({
          universityId: uni.universityId || uni.UniversityId,
          universityName: uni.universityName || uni.UniversityName,
          location: uni.location || uni.Location,
          status: uni.status !== undefined ? uni.status : uni.Status
        }));
        setUniversities(normalized);
        setFilteredUniversities(normalized);
      } else {
        setToast({
          message: '⚠️ Không thể tải danh sách trường đại học',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error loading universities:', error);
      setToast({
        message: '❌ Lỗi khi tải dữ liệu',
        type: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyUniversityFilters(query, universityStatusFilter);
  };

  const handleUniversityStatusFilter = (filter) => {
    setUniversityStatusFilter(filter);
    applyUniversityFilters(searchQuery, filter);
  };

  const applyUniversityFilters = (search, status) => {
    let filtered = universities;

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(uni => 
        uni.universityName?.toLowerCase().includes(search.toLowerCase()) ||
        uni.location?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status === 'active') {
      filtered = filtered.filter(uni => uni.status === true);
    } else if (status === 'inactive') {
      filtered = filtered.filter(uni => uni.status === false);
    }

    setFilteredUniversities(filtered);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createUniversity(createFormData);
      
      if (result.success) {
        setToast({
          message: '✅ Tạo trường đại học mới thành công!',
          type: 'success',
          duration: 3000
        });
        setShowCreateModal(false);
        setCreateFormData({
          universityName: '',
          location: ''
        });
        loadUniversities();
      } else {
        setToast({
          message: result.message || '❌ Tạo trường đại học thất bại',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error creating university:', error);
      setToast({
        message: '❌ Lỗi khi tạo trường đại học',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleEditClick = (university) => {
    setEditingUniversity(university);
    setEditFormData({
      universityName: university.universityName || '',
      location: university.location || '',
      status: university.status !== false
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await updateUniversity(editingUniversity.universityId, editFormData);
      
      if (result.success) {
        setToast({
          message: '✅ Cập nhật thông tin thành công!',
          type: 'success',
          duration: 3000
        });
        setShowEditModal(false);
        setEditingUniversity(null);
        loadUniversities();
      } else {
        setToast({
          message: result.message || '❌ Cập nhật thất bại',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error updating university:', error);
      setToast({
        message: '❌ Lỗi khi cập nhật thông tin',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleDelete = async (universityId, universityName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa trường "${universityName}"?\n\nLưu ý: Đây là xóa mềm, trường sẽ bị vô hiệu hóa.`)) {
      return;
    }

    try {
      const result = await deleteUniversity(universityId);
      
      if (result.success) {
        setToast({
          message: '✅ Đã xóa trường đại học thành công!',
          type: 'success',
          duration: 3000
        });
        loadUniversities();
      } else {
        setToast({
          message: result.message || '❌ Không thể xóa trường đại học',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error deleting university:', error);
      setToast({
        message: '❌ Lỗi khi xóa trường đại học',
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

  // Major handlers
  const loadMajors = async () => {
    try {
      setMajorsLoading(true);
      const result = await getAllMajors();
      
      if (result.success && result.majors) {
        // Normalize field names - backend returns majorId, majorName, description, status (lowercase)
        const normalizedMajors = result.majors.map(major => ({
          majorId: major.majorId || major.MajorId,
          majorName: major.majorName || major.MajorName,
          description: major.description || major.Description,
          status: major.status !== undefined ? major.status : major.Status
        }));
        setMajors(normalizedMajors);
        setFilteredMajors(normalizedMajors);
      } else {
        setToast({
          message: '⚠️ Không thể tải danh sách ngành học',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error loading majors:', error);
      setToast({
        message: '❌ Lỗi khi tải ngành học',
        type: 'error',
        duration: 3000
      });
    } finally {
      setMajorsLoading(false);
    }
  };

  const handleMajorSearch = (query) => {
    setMajorSearchQuery(query);
    applyMajorFilters(query, majorStatusFilter);
  };

  const handleMajorStatusFilter = (filter) => {
    setMajorStatusFilter(filter);
    applyMajorFilters(majorSearchQuery, filter);
  };

  const applyMajorFilters = (search, status) => {
    let filtered = majors;

    // Search filter
    if (search.trim()) {
      filtered = filtered.filter(major => 
        major.majorName?.toLowerCase().includes(search.toLowerCase()) ||
        major.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status === 'active') {
      filtered = filtered.filter(major => major.status === true);
    } else if (status === 'inactive') {
      filtered = filtered.filter(major => major.status === false);
    }

    setFilteredMajors(filtered);
  };

  const handleCreateMajor = async (e) => {
    e.preventDefault();

    try {
      const result = await createMajor(createMajorData);
      
      if (result.success) {
        setToast({
          message: '✅ Tạo ngành học mới thành công!',
          type: 'success',
          duration: 3000
        });
        setShowCreateMajorModal(false);
        setCreateMajorData({ majorName: '', description: '' });
        loadMajors();
      } else {
        setToast({
          message: result.message || '❌ Tạo ngành học thất bại',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error creating major:', error);
      setToast({
        message: '❌ Lỗi khi tạo ngành học',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleEditMajorClick = (major) => {
    setEditingMajor(major);
    setEditMajorData({
      majorName: major.majorName || '',
      description: major.description || '',
      status: major.status !== false
    });
    setShowEditMajorModal(true);
  };

  const handleEditMajor = async (e) => {
    e.preventDefault();

    try {
      const result = await updateMajor(editingMajor.majorId, editMajorData);
      
      if (result.success) {
        setToast({
          message: '✅ Cập nhật ngành học thành công!',
          type: 'success',
          duration: 3000
        });
        setShowEditMajorModal(false);
        setEditingMajor(null);
        loadMajors();
      } else {
        setToast({
          message: result.message || '❌ Cập nhật thất bại',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error updating major:', error);
      setToast({
        message: '❌ Lỗi khi cập nhật ngành học',
        type: 'error',
        duration: 3000
      });
    }
  };

  const handleDeleteMajor = async (majorId, majorName) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ngành "${majorName}"?\n\nLưu ý: Đây là xóa mềm, ngành sẽ bị vô hiệu hóa.`)) {
      return;
    }

    try {
      const result = await deleteMajor(majorId);
      
      if (result.success) {
        setToast({
          message: '✅ Đã xóa ngành học thành công!',
          type: 'success',
          duration: 3000
        });
        loadMajors();
      } else {
        setToast({
          message: result.message || '❌ Không thể xóa ngành học',
          type: 'error',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error deleting major:', error);
      setToast({
        message: '❌ Lỗi khi xóa ngành học',
        type: 'error',
        duration: 3000
      });
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
                <p className="text-gray-600">Tổng số: {filteredUniversities.length} trường</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Thêm trường mới
              </button>
            </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-gray-600">Trạng thái:</label>
              <select
                value={universityStatusFilter}
                onChange={(e) => handleUniversityStatusFilter(e.target.value)}
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
              placeholder="Tìm kiếm theo tên trường hoặc địa điểm..."
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

        {/* Universities Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tên trường</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Địa điểm</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUniversities.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'Không tìm thấy trường nào' : 'Chưa có trường đại học nào'}
                    </td>
                  </tr>
                ) : (
                  filteredUniversities.map((university) => (
                    <tr key={university.universityId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{university.universityId}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-800">{university.universityName || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{university.location || 'Chưa cập nhật'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          university.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${university.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {university.status ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(university)}
                            className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(university.universityId, university.universityName)}
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

        {/* Majors Tab */}
        {activeTab === 'majors' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý ngành học</h1>
                <p className="text-gray-600">Tổng số: {filteredMajors.length} ngành</p>
              </div>
              <button
                onClick={() => setShowCreateMajorModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Thêm ngành mới
              </button>
            </div>

            {/* Major Filters and Search Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-gray-600">Trạng thái:</label>
                  <select
                    value={majorStatusFilter}
                    onChange={(e) => handleMajorStatusFilter(e.target.value)}
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
                  placeholder="Tìm kiếm theo tên ngành hoặc mô tả..."
                  value={majorSearchQuery}
                  onChange={(e) => handleMajorSearch(e.target.value)}
                  className="flex-1 px-4 py-2 border-0 focus:outline-none focus:ring-0 text-gray-700"
                />
                {majorSearchQuery && (
                  <button
                    onClick={() => handleMajorSearch('')}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 font-semibold"
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>

            {/* Majors Table */}
            {majorsLoading ? (
              <div className="bg-white rounded-xl shadow-lg p-12 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-700 font-semibold">Đang tải ngành học...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Tên ngành</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Mô tả</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredMajors.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            {majorSearchQuery ? 'Không tìm thấy ngành nào' : 'Chưa có ngành học nào'}
                          </td>
                        </tr>
                      ) : (
                        filteredMajors.map((major) => (
                          <tr key={major.majorId} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">{major.majorId}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-gray-800">{major.majorName || 'N/A'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-600">{major.description || 'Chưa có mô tả'}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                major.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                <span className={`w-2 h-2 rounded-full ${major.status ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {major.status ? 'Hoạt động' : 'Không hoạt động'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditMajorClick(major)}
                                  className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Sửa
                                </button>
                                <button
                                  onClick={() => handleDeleteMajor(major.majorId, major.majorName)}
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
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm trường đại học mới</h2>
            
            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên trường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createFormData.universityName}
                  onChange={(e) => setCreateFormData({...createFormData, universityName: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Ví dụ: Đại học FPT"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={createFormData.location}
                  onChange={(e) => setCreateFormData({...createFormData, location: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Ví dụ: Hà Nội, TP.HCM..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Tạo trường
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateFormData({
                      universityName: '',
                      location: ''
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa thông tin trường</h2>
            
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên trường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.universityName}
                  onChange={(e) => setEditFormData({...editFormData, universityName: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa điểm
                </label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editFormData.status}
                      onChange={(e) => setEditFormData({...editFormData, status: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-200 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  {editFormData.status ? '✅ Trường đang hoạt động' : '❌ Trường bị vô hiệu hóa'}
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
                    setEditingUniversity(null);
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

      {/* Create Major Modal */}
      {showCreateMajorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm ngành học mới</h2>
            
            <form onSubmit={handleCreateMajor}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên ngành <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={createMajorData.majorName}
                  onChange={(e) => setCreateMajorData({...createMajorData, majorName: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Ví dụ: Công nghệ thông tin"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={createMajorData.description}
                  onChange={(e) => setCreateMajorData({...createMajorData, description: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="Mô tả ngắn về ngành học..."
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all"
                >
                  Tạo ngành
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateMajorModal(false);
                    setCreateMajorData({ majorName: '', description: '' });
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

      {/* Edit Major Modal */}
      {showEditMajorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Chỉnh sửa thông tin ngành</h2>
            
            <form onSubmit={handleEditMajor}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên ngành <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editMajorData.majorName}
                  onChange={(e) => setEditMajorData({...editMajorData, majorName: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mô tả
                </label>
                <textarea
                  value={editMajorData.description}
                  onChange={(e) => setEditMajorData({...editMajorData, description: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  rows="3"
                />
              </div>

              <div className="mb-6">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={editMajorData.status}
                      onChange={(e) => setEditMajorData({...editMajorData, status: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-200 transition-all"></div>
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  {editMajorData.status ? '✅ Ngành đang hoạt động' : '❌ Ngành bị vô hiệu hóa'}
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
                    setShowEditMajorModal(false);
                    setEditingMajor(null);
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
    </div>
  );
}

export default UniversityManagement;
