import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header with buttons */}
      <div className="absolute top-0 right-0 p-6 flex gap-3 z-50">
        <Link 
          to="/login" 
          className="px-6 py-2.5 rounded-lg text-sm font-semibold no-underline transition-all duration-300 text-white hover:bg-white/10 backdrop-blur-sm"
        >
          Đăng nhập
        </Link>
        <Link 
          to="/register" 
          className="px-6 py-2.5 rounded-lg text-sm font-semibold no-underline transition-all duration-300 bg-white text-indigo-600 hover:transform hover:-translate-y-0.5 hover:shadow-xl hover:bg-gray-50"
        >
          Đăng ký ngay
        </Link>
      </div>

      {/* Main content */}
      <div className="min-h-screen flex justify-center items-center p-5 relative z-10">
        <div className="text-center text-white max-w-3xl">
          {/* Logo/Icon placeholder */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <h1 className="text-7xl font-extrabold mb-6 drop-shadow-2xl tracking-tight animate-fade-in">
            EduPath
          </h1>
          <p className="text-3xl font-semibold mb-4 opacity-95 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Tìm kiếm ngành học phù hợp với tính cách của bạn
          </p>
          <p className="text-lg mb-10 opacity-90 leading-relaxed max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Làm bài test tính cách để khám phá ngành học và trường đại học phù hợp nhất với bạn
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link 
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 rounded-full text-lg font-bold no-underline transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl group"
            >
              Bắt đầu ngay
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transition-all duration-300 hover:bg-white/20 hover:transform hover:-translate-y-1">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg mb-2">Chính xác</h3>
              <p className="text-sm opacity-90">Phân tích tính cách chuyên sâu</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transition-all duration-300 hover:bg-white/20 hover:transform hover:-translate-y-1">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="font-bold text-lg mb-2">Đa dạng</h3>
              <p className="text-sm opacity-90">Hàng trăm ngành học và trường ĐH</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 transition-all duration-300 hover:bg-white/20 hover:transform hover:-translate-y-1">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-lg mb-2">Nhanh chóng</h3>
              <p className="text-sm opacity-90">Kết quả ngay lập tức</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default HomePage;
