import { Link } from 'react-router-dom';

function LoginPage() {
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
        
        <form>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 text-gray-700 font-semibold text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@email.com"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-700 font-semibold text-sm">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2 hover:transform hover:-translate-y-0.5 hover:shadow-xl active:transform-none"
          >
            Đăng nhập
          </button>

          <p className="text-center mt-6 text-gray-600 text-sm">
            Chưa có tài khoản? <Link to="/register" className="text-indigo-500 no-underline font-semibold transition-colors duration-300 hover:text-purple-600 hover:underline">Đăng ký ngay</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
