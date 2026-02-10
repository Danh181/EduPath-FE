import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from './services/authService';
import { useFormValidation } from './hooks/useFormValidation';
import { useToast } from './hooks/useToast';
import Toast from './components/Toast';

function RegisterForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast hook
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Form validation hook
  const {
    formData,
    errors,
    touched,
    handleChange: formHandleChange,
    handleBlur,
    validateForm,
    touchAllFields
  } = useFormValidation(
    {
      fullname: '',
      email: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: ''
    },
    ['fullname', 'email', 'dateOfBirth', 'password', 'confirmPassword']
  );

  const handleChange = (e) => {
    formHandleChange(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    touchAllFields();

    // Validate toàn bộ form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const dateofbirth = formData.dateOfBirth || null;

      const result = await register(
        formData.email,
        formData.password,
        formData.fullname,
        dateofbirth
      );

      if (result.success) {
        showSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        showError(result.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Register error:', error);
      showError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
      {/* Logo button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-white text-2xl font-bold no-underline transition-all duration-300 hover:opacity-70 z-50"
      >
        EduPath
      </Link>
      <div className="bg-white rounded-2xl p-10 w-full max-w-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Đăng ký tài khoản</h2>
        <p className="text-gray-600 text-center mb-8 text-sm">Tạo tài khoản để khám phá ngành học phù hợp với bạn</p>
        
        <form onSubmit={handleSubmit} noValidate>
          {/* Họ Tên */}
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
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-300 ${
                errors.fullname && touched.fullname 
                  ? 'border-red-600 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
              } focus:outline-none focus:ring-4`}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullname && touched.fullname && (
              <span className="block text-red-600 text-xs mt-1.5 font-medium">{errors.fullname}</span>
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
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-300 ${
                errors.email && touched.email 
                  ? 'border-red-600 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
              } focus:outline-none focus:ring-4`}
              placeholder="example@email.com"
            />
            {errors.email && touched.email && (
              <span className="block text-red-600 text-xs mt-1.5 font-medium">{errors.email}</span>
            )}
          </div>

          {/* Ngày sinh */}
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
              onBlur={handleBlur}
              className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-300 ${
                errors.dateOfBirth && touched.dateOfBirth 
                  ? 'border-red-600 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
              } focus:outline-none focus:ring-4`}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dateOfBirth && touched.dateOfBirth && (
              <span className="block text-red-600 text-xs mt-1.5 font-medium">{errors.dateOfBirth}</span>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-700 font-semibold text-sm">
              Mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg text-sm transition-all duration-300 ${
                  errors.password && touched.password 
                    ? 'border-red-600 focus:ring-red-100' 
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                } focus:outline-none focus:ring-4`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-gray-500 transition-colors duration-300 hover:text-indigo-500 focus:outline-none focus:text-indigo-500"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && touched.password && (
              <span className="block text-red-600 text-xs mt-1.5 font-medium">{errors.password}</span>
            )}
            <small className="block text-gray-500 text-xs mt-1.5">
              Mật khẩu phải có ít nhất 6 ký tự
            </small>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-700 font-semibold text-sm">
              Xác nhận mật khẩu <span className="text-red-600">*</span>
            </label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg text-sm transition-all duration-300 ${
                  errors.confirmPassword && touched.confirmPassword 
                    ? 'border-red-600 focus:ring-red-100' 
                    : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                } focus:outline-none focus:ring-4`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-gray-500 transition-colors duration-300 hover:text-indigo-500 focus:outline-none focus:text-indigo-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <span className="block text-red-600 text-xs mt-1.5 font-medium">{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2 ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:transform hover:-translate-y-0.5 hover:shadow-xl active:transform-none'
            }`}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
          </button>

          <p className="text-center mt-6 text-gray-600 text-sm">
            Đã có tài khoản? <Link to="/login" className="text-indigo-500 no-underline font-semibold transition-colors duration-300 hover:text-purple-600 hover:underline">Đăng nhập ngay</Link>
          </p>
        </form>
      </div>

      {/* Toast notification */}
      {toast && <Toast key={toast.id} {...toast} onClose={hideToast} />}
    </div>
  );
}

export default RegisterForm;
