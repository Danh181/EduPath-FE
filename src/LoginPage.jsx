import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "./services/authService";
import Toast from "./components/Toast";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email không được để trống';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Email không hợp lệ';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Mật khẩu không được để trống';
      } else if (value.length < 6) {
        error = 'Mật khẩu phải có ít nhất 6 ký tự';
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

    // Clear error khi user nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Thêm stopPropagation để chắc chắn không bubble

    console.log('=== FORM SUBMIT START ===');
    console.log('Form data:', formData);

    // Validate
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      console.log('Starting login API call...');

      try {
        const result = await login(formData.email, formData.password);

        console.log('=== LOGIN RESULT ===');
        console.log('Result:', result);
        console.log('Success:', result.success);
        console.log('Message:', result.message);

        if (result.success) {
          console.log('Login SUCCESS - redirecting immediately');
          
          // Check user role and redirect accordingly (case-insensitive)
          const userRole = result.user?.role?.toLowerCase();
          let redirectPath = '/home';
          
          if (userRole === 'admin') {
            redirectPath = '/dashboard';
          } else if (userRole === 'organization') {
            redirectPath = '/organization-dashboard';
          }
          
          // Immediate redirect without delay
          navigate(redirectPath);
        } else {
          // Login failed - show error toast
          console.log('Login FAILED - showing error toast');
          console.log('Setting isSubmitting to false');
          setIsSubmitting(false);
          
          console.log('Setting toast with message:', result.message);
          setToast({
            message: result.message || '❌ Email hoặc mật khẩu không đúng. Vui lòng thử lại!',
            type: 'error',
            duration: 4000
          });
          console.log('Toast state updated');
        }
      } catch (error) {
        console.error('=== CATCH BLOCK - EXCEPTION ===');
        console.error('Error caught:', error);
        setIsSubmitting(false);
        
        // Xác định thông báo lỗi cụ thể
        let errorMessage = '⚠️ Có lỗi xảy ra. Vui lòng thử lại sau.';
        
        if (error.response) {
          // Server response với error
          console.log('Error has response:', error.response.status);
          if (error.response.status === 401) {
            errorMessage = '🔒 Email hoặc mật khẩu không đúng!';
          } else if (error.response.status === 404) {
            errorMessage = '❌ Không tìm thấy tài khoản này!';
          } else if (error.response.status >= 500) {
            errorMessage = '🔧 Lỗi máy chủ. Vui lòng thử lại sau.';
          }
        } else if (error.request) {
          // Request được gửi nhưng không nhận được response
          console.log('Error has request but no response');
          errorMessage = '🌐 Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng!';
        }
        
        console.log('Setting error toast:', errorMessage);
        setToast({
          message: errorMessage,
          type: 'error',
          duration: 4000
        });
      }
    } else {
      // Validation errors - hiển thị toast cho validation
      const firstError = Object.values(newErrors)[0];
      console.log('Validation failed, showing toast:', firstError);
      setToast({
        message: `⚠️ ${firstError}`,
        type: 'error',
        duration: 3000
      });
    }
    
    console.log('=== FORM SUBMIT END ===');
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600" />

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* LEFT – Login Card */}
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-extrabold text-center mb-8">
              Edu<span className="text-indigo-600">Path</span>
            </h1>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">EMAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className={`w-full px-5 py-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-indigo-500`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">
                MẬT KHẨU
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu của bạn"
                  className={`w-full px-5 py-4 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-indigo-500`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Button */}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-500 text-white rounded-xl font-semibold shadow-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập vào EduPath'}
            </button>

            {/* Links */}
            <div className="mt-6 text-center space-y-3">
              <Link
                to="/register"
                className="block py-3 rounded-xl bg-indigo-50 text-indigo-600 font-semibold"
              >
                Chưa có tài khoản? Tạo tài khoản mới
              </Link>

              <Link to="/forgot-password" className="text-sm text-gray-500">
                Quên mật khẩu?
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT – Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-24">
          <div className="text-center max-w-lg">
            <h1
              className="
                text-5xl font-extrabold mb-6
                bg-gradient-to-r from-blue-200 to-pink-300
                bg-clip-text text-transparent
                drop-shadow-md
              "
            >
              Chào mừng trở lại với EduPath
            </h1>

            <p className="text-white/90 text-lg mb-12">
              Nền tảng học tập với định hướng nghề nghiệp thông minh dành cho
              bạn
            </p>

            <div className="flex justify-center gap-10 mb-12">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                  ✓
                </div>
                Học tập cá nhân hóa
              </div>

              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center">
                  ⚡
                </div>
                Định hướng ngành nghề
              </div>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white/30 text-white rounded-xl font-semibold"
            >
              Bắt đầu học ngay →
            </Link>
          </div>
        </div>
      </div>
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default LoginPage;
