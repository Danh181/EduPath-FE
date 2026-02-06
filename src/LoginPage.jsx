import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from './services/authService';
import Toast from './components/Toast';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

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
    <div className="min-h-screen flex justify-center items-center p-5 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
      {/* Logo button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 text-white text-2xl font-bold no-underline transition-all duration-300 hover:opacity-70 z-50"
      >
        EduPath
      </Link>
      <div className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Đăng nhập</h2>
        <p className="text-gray-600 text-center mb-8 text-sm">Chào mừng bạn quay lại!</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-gray-700 font-semibold text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:ring-4 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-700 font-semibold text-sm">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 border-2 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:ring-4 ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-100' 
                  : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold transition-all duration-300 mt-2 ${
              isSubmitting 
                ? 'opacity-70 cursor-not-allowed' 
                : 'cursor-pointer hover:transform hover:-translate-y-0.5 hover:shadow-xl active:transform-none'
            }`}
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p className="text-center mt-6 text-gray-600 text-sm">
            Chưa có tài khoản? <Link to="/register" className="text-indigo-500 no-underline font-semibold transition-colors duration-300 hover:text-purple-600 hover:underline">Đăng ký ngay</Link>
          </p>
        </form>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          duration={toast.duration || (toast.type === 'error' ? 4000 : 3000)}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default LoginPage;
