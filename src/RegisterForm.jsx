import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from './services/authService';
import Toast from './components/Toast';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);

  // Validate từng field
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'fullname':
        if (!value.trim()) {
          error = 'Họ tên không được để trống';
        } else if (value.trim().length < 2) {
          error = 'Họ tên phải có ít nhất 2 ký tự';
        } else if (value.trim().length > 255) {
          error = 'Họ tên không được quá 255 ký tự';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email không hợp lệ';
        }
        break;

      case 'dateOfBirth':
        // Optional field - chỉ validate nếu có value
        if (value) {
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
        break;

      case 'password':
        if (!value) {
          error = 'Mật khẩu không được để trống';
        } else if (value.length < 6) {
          error = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Vui lòng xác nhận mật khẩu';
        } else if (value !== formData.password) {
          error = 'Mật khẩu xác nhận không khớp';
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate toàn bộ form
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate ngay khi user đang nhập (nếu field đã được touch)
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Validate lại confirmPassword khi password thay đổi
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate toàn bộ form
    const newErrors = validateForm();
    setErrors(newErrors);

    // Nếu không có lỗi thì submit
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      try {
        // Convert date format (YYYY-MM-DD) hoặc null
        const dateofbirth = formData.dateOfBirth ? formData.dateOfBirth : null;

        const result = await register(
          formData.email,
          formData.password,
          formData.fullname,
          dateofbirth
        );

        if (result.success) {
          setToast({
            message: 'Đăng ký thành công! Đang chuyển đến trang đăng nhập...',
            type: 'success'
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setToast({
            message: result.message || 'Đăng ký thất bại. Vui lòng thử lại.',
            type: 'error'
          });
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Register error:', error);
        setToast({
          message: 'Có lỗi xảy ra. Vui lòng thử lại sau.',
          type: 'error'
        });
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-50" />

      <div className="relative min-h-screen flex flex-col lg:flex-row">
        {/* Left Side - Image/Content (Swapped) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center p-12 order-last lg:order-first">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>
          {/* Decorative Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

          <div className="relative z-10 text-center max-w-lg">
            <div className="mb-8 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Students" className="relative rounded-2xl shadow-2xl border-4 border-white/10 mx-auto w-3/4 object-cover h-64 transform transition duration-500 hover:scale-[1.02]" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4">
              Tham Gia Cộng Đồng <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-emerald-400">EduPath</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Kết nối với hàng ngàn học sinh, sinh viên và chuyên gia. Nhận lộ trình học tập được cá nhân hóa ngay hôm nay.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <div className="flex items-center text-sm font-semibold text-gray-400">
                <span className="text-emerald-400 mr-1">+50k</span> thành viên
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form (Swapped) */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 z-10 bg-white lg:order-last">
          <div className="w-full max-w-md bg-white p-8 h-full overflow-y-auto max-h-screen">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex justify-center mb-4 group">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-2xl">E</span>
                </div>
              </Link>
              <h2 className="text-3xl font-bold text-gray-900">Đăng Ký Tài Khoản</h2>
              <p className="text-gray-500 mt-2">Bắt đầu hành trình định hướng miễn phí</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nguyễn Văn A"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.fullname && touched.fullname ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 hover:bg-white`}
                  />
                </div>
                {errors.fullname && touched.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="email@example.com"
                    className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 hover:bg-white`}
                  />
                </div>
                {errors.email && touched.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tối thiểu 6 ký tự"
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 hover:bg-white`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.password && touched.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Nhập lại mật khẩu"
                    className={`w-full pl-12 pr-12 py-3 rounded-lg border ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 hover:bg-white`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Ngày sinh</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.dateOfBirth && touched.dateOfBirth ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all bg-gray-50 hover:bg-white`}
                />
                {errors.dateOfBirth && touched.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>


              {/* Terms Checkbox */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300 rounded cursor-pointer"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700 cursor-pointer">
                    Tôi đồng ý với <a href="#" className="text-red-600 hover:text-red-500 underline">Điều khoản dịch vụ</a> và <a href="#" className="text-red-600 hover:text-red-500 underline">Chính sách bảo mật</a>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6 transform hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Đăng Ký Tài Khoản"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="font-bold text-red-600 hover:text-red-500 transition-colors">
                Đăng nhập ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.type === 'success' ? 2000 : 4000} // Reverted duration to original logic
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default RegisterForm;
