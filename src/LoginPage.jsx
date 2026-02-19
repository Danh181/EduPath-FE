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
          console.log('Login SUCCESS - showing success toast');

          // Check user role and redirect accordingly (case-insensitive)
          const userRole = result.user?.role?.toLowerCase();
          const redirectPath = userRole === 'admin' ? '/dashboard' : '/';

          setToast({
            message: '✨ Đăng nhập thành công! Đang chuyển hướng...',
            type: 'success',
            duration: 1500
          });
          setTimeout(() => {
            navigate(redirectPath);
          }, 1500);
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
      <div className="fixed inset-0 bg-gray-50" />

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* LEFT – Login Card */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 z-10 bg-white">
          <div className="w-full max-w-md bg-white p-6">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-4 group">
                <div className="w-14 h-14 bg-gradient-to-tr from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-110 transition-transform duration-300 transform rotate-3 group-hover:rotate-0">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </Link>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                Chào mừng trở lại!
              </h1>
              <p className="text-gray-500">Đăng nhập để tiếp tục hành trình phát triển bản thân.</p>
            </div>

            {/* Email */}
            <div className="mb-6 group">
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
              <div className="relative transition-all duration-300 group-focus-within:scale-[1.01]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.email}
              </p>}
            </div>

            {/* Password */}
            <div className="mb-8 group">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative transition-all duration-300 group-focus-within:scale-[1.01]">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu của bạn"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 ml-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {errors.password}
              </p>}
            </div>

            {/* Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : 'Đăng nhập'}
            </button>

            {/* Links */}
            <div className="mt-8 text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="text-sm text-gray-600 mb-1">
                Bạn chưa có tài khoản?
              </div>
              <Link
                to="/register"
                className="text-red-600 font-extrabold hover:text-red-700 hover:underline transition-colors uppercase tracking-wide text-sm"
              >
                Đăng ký tài khoản mới
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT – Branding (Bright Theme) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 relative overflow-hidden items-center justify-center p-12">
          {/* Background Gradient & Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-emerald-600"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          {/* Floating Shapes */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

          <div className="relative z-10 text-center max-w-lg text-white">
            {/* Glass Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <div className="mb-6 inline-flex p-4 bg-white/20 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                Khám Phá <br /> Tương Lai Của Bạn
              </h2>
              <p className="text-red-100 text-lg mb-8 font-medium">
                Nền tảng định hướng nghề nghiệp hàng đầu với công nghệ AI tiên tiến, giúp bạn tìm ra con đường phù hợp nhất.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <div className="font-bold text-2xl mb-1">10k+</div>
                  <div className="text-xs text-red-100 uppercase tracking-wide">Học viên</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                  <div className="font-bold text-2xl mb-1">98%</div>
                  <div className="text-xs text-red-100 uppercase tracking-wide">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="mt-8 text-sm text-white/60 font-medium">
              © 2026 EduPath Inc. All rights reserved.
            </div>
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
