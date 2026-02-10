import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated, logout } from './services/authService';
import { getUserProfile, updateUserProfile } from './services/userService';
import Toast from './components/Toast';

function MyProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    dateOfBirth: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Load user data
    const loadUserProfile = async () => {
      try {
        const currentUser = getCurrentUser();
        console.log('=== MY PROFILE DEBUG ===');
        console.log('Current user from localStorage:', currentUser);
        console.log('User role:', currentUser?.role);
        console.log('Is Admin?', currentUser?.role === 'Admin');
        
        if (!currentUser) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }

        // Try to fetch full user profile from API if userId exists
        if (currentUser.userId) {
          console.log('Fetching profile from API with userId:', currentUser.userId);
          const profileData = await getUserProfile(currentUser.userId);
          console.log('API profile response:', profileData);
          
          if (profileData.success && profileData.user) {
            const apiUser = profileData.user;
            console.log('Using API user data:', apiUser);
            
            // Merge API data with localStorage data, prioritizing role from JWT token
            const mergedUser = {
              ...apiUser,
              role: currentUser.role || apiUser.role, // Ưu tiên role từ JWT token (localStorage)
              userId: currentUser.userId
            };
            
            console.log('Merged user data:', mergedUser);
            setUser(mergedUser);
            setFormData({
              fullname: apiUser.fullname || currentUser.fullname || '',
              email: apiUser.email || currentUser.email || '',
              dateOfBirth: apiUser.DateOfBirth || apiUser.dateOfBirth || apiUser.dateofbirth || ''
            });
            return;
          }
        }
        
        // Fallback to localStorage data (nếu không có userId hoặc API call failed)
        console.log('Using localStorage data as fallback');
        console.log('Fullname from localStorage:', currentUser.fullname);
        setUser(currentUser);
        setFormData({
          fullname: currentUser.fullname || '',
          email: currentUser.email || '',
          dateOfBirth: currentUser.DateOfBirth || currentUser.dateOfBirth || currentUser.dateofbirth || ''
        });
        console.log('========================');
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to localStorage
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setFormData({
            fullname: currentUser.fullname || '',
            email: currentUser.email || '',
            dateOfBirth: currentUser.DateOfBirth || currentUser.dateOfBirth || currentUser.dateofbirth || ''
          });
        }
      }
    };

    loadUserProfile();
  }, [navigate]);

  const validateField = (name, value) => {
    let error = '';

    if (name === 'fullname') {
      if (!value.trim()) {
        error = 'Họ tên không được để trống';
      } else if (value.trim().length < 2) {
        error = 'Họ tên phải có ít nhất 2 ký tự';
      } else if (value.trim().length > 255) {
        error = 'Họ tên không được quá 255 ký tự';
      }
    } else if (name === 'email') {
      if (!value.trim()) {
        error = 'Email không được để trống';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Email không hợp lệ';
      }
    } else if (name === 'dateOfBirth' && value) {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (birthDate > today) {
        error = 'Ngày sinh không được là ngày trong tương lai';
      } else if (age < 13) {
        error = 'Bạn phải từ 13 tuổi trở lên';
      } else if (age > 100) {
        error = 'Ngày sinh không hợp lệ';
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    ['fullname', 'email', 'dateOfBirth'].forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      try {
        // Nếu có userId thì call API update
        if (user.userId) {
          const result = await updateUserProfile(user.userId, {
            fullname: formData.fullname,
            email: formData.email,
            DateOfBirth: formData.dateOfBirth || null // BE expects DateOfBirth (capital D and B)
          });

          if (result.success) {
            setToast({
              message: 'Cập nhật thông tin thành công!',
              type: 'success'
            });
            setIsEditing(false);
            
            // Update user in localStorage
            const updatedUser = {
              ...user,
              fullname: formData.fullname,
              email: formData.email
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
          } else {
            setToast({
              message: result.message || 'Cập nhật thất bại. Vui lòng thử lại.',
              type: 'error'
            });
          }
        } else {
          // Không có userId, chỉ update localStorage
          console.log('No userId, updating localStorage only');
          setToast({
            message: 'Cập nhật thông tin thành công (chỉ lưu local)!',
            type: 'success'
          });
          setIsEditing(false);
          
          const updatedUser = {
            ...user,
            fullname: formData.fullname,
            email: formData.email
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        }
      } catch (error) {
        console.error('Update profile error:', error);
        setToast({
          message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
          type: 'error'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data
    setFormData({
      fullname: user.fullname || '',
      email: user.email || '',
      dateOfBirth: user.DateOfBirth || user.dateOfBirth || user.dateofbirth || ''
    });
    setErrors({});
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-full mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Back to Home Button */}
            <Link 
              to="/" 
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 no-underline group"
              title="Quay về trang chủ"
            >
              <svg className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">EduPath</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Admin Dashboard Button */}
            {user?.role && user.role.toLowerCase() === 'admin' && (
              <Link
                to="/dashboard"
                className="px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 no-underline shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>📊</span>
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            )}
            
            {/* Organization Dashboard Button */}
            {user?.role && user.role.toLowerCase() === 'organization' && (
              <Link
                to="/organization-dashboard"
                className="px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 transition-all duration-300 no-underline shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <span>🏢</span>
                <span className="hidden md:inline">Organization Dashboard</span>
              </Link>
            )}
            
            <button
              onClick={logout}
              className="px-4 md:px-6 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-300"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                {getInitials(user.fullname || user.email)}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.fullname || 'User'}</h1>
                <p className="text-gray-600">{user.email}</p>
                {user.role && (
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="mb-6">
                <label htmlFor="fullname" className="block mb-2 text-gray-700 font-semibold text-sm">
                  Họ và tên <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-300 ${
                    isEditing
                      ? errors.fullname 
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } focus:outline-none`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.fullname && (
                  <p className="mt-1 text-xs text-red-500">{errors.fullname}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-gray-700 font-semibold text-sm">
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-300 ${
                    isEditing
                      ? errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } focus:outline-none`}
                  placeholder="example@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="mb-6">
                <label htmlFor="dateOfBirth" className="block mb-2 text-gray-700 font-semibold text-sm">
                  Ngày sinh <span className="text-gray-500 font-normal">(Không bắt buộc)</span>
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-300 ${
                    isEditing
                      ? errors.dateOfBirth 
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  } focus:outline-none`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold transition-all duration-300 ${
                      isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-lg hover:transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default MyProfile;
