import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { isAuthenticated, getCurrentUser, logout } from './services/authService';
import { getLatestNews } from './services/newsService';
import NewsCard from './components/News/NewsCard';
import NewsSkeleton from './components/News/NewsSkeleton';

function HomePage() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }

    // Fetch latest news
    const fetchNews = async () => {
      try {
        const data = await getLatestNews(3);
        setLatestNews(data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowDropdown(false);
  };

  // Get first letter of name for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Edu<span className="text-red-600">Path</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8 mx-auto">
            <Link to="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors no-underline">Trang chủ</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-red-600 font-medium transition-colors no-underline">Bảng giá</Link>
            <a href="#about-us" className="text-gray-700 hover:text-red-600 font-medium transition-colors no-underline">Về chúng tôi</a>
          </div>

          {/* User logged in - show profile */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 hover:opacity-80 transition-all duration-300"
              >
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900">{user.fullname || user.email}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg border border-red-200">
                  {getInitials(user.fullname || user.email)}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.fullname || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Thông tin cá nhân</span>
                  </Link>

                  <Link
                    to="/quiz"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>Làm bài trắc nghiệm</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in - show login/register buttons */
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-300 no-underline"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm hover:shadow-md no-underline"
              >
                Đăng ký miễn phí
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* ... Hero Content ... */}
          <div className="md:w-1/2 text-left">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-red-100">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Định hướng nghề nghiệp 4.0
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
              Khám Phá <span className="text-red-600">Tương Lai</span> <br />
              Của Chính Bạn
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              EduPath sử dụng AI để phân tích tính cách và năng lực từ bài kiểm tra trắc nghiệm, giúp bạn tìm ra con đường học vấn và nghề nghiệp phù hợp nhất.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/quiz"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-md text-lg font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 no-underline"
              >
                Làm Trắc Nghiệm Ngay
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-md text-lg font-bold hover:bg-gray-50 transition-all no-underline"
              >
                Tìm hiểu thêm
              </a>
            </div>

            <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden`}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <p>Được tin dùng bởi <span className="font-bold text-gray-900">10,000+</span> học sinh</p>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="relative bg-gradient-to-br from-gray-100 to-white rounded-2xl shadow-2xl p-6 border border-gray-100">
              {/* Abstract UI Representation */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                <div className="flex gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                <div className="h-32 bg-gray-50 rounded mb-2 flex items-center justify-center text-gray-300">
                  AI Analysis Visualization
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-emerald-100 rounded text-emerald-700 text-xs flex items-center justify-center font-bold">Phù hợp 98%</div>
                    <div className="h-8 w-20 bg-blue-100 rounded text-blue-700 text-xs flex items-center justify-center font-bold">CNTT</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Admissions News Section */}
      <section className="py-20 px-6 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-red-600 font-bold uppercase tracking-wider text-xs mb-2">
                <span className="w-8 h-0.5 bg-red-600"></span>
                Tin Tức Mới
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Thông Tin Tuyển Sinh & Hướng Nghiệp</h2>
            </div>
            <Link to="/news" className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1 group no-underline">
              Xem tất cả tin tức <span className="text-xl transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingNews ? (
              // Show skeletons while loading
              Array(3).fill(0).map((_, idx) => <NewsSkeleton key={idx} />)
            ) : (
              // Show dynamic news cards
              latestNews.map(item => (
                <NewsCard key={item.id} news={item} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Quy Trình Hoạt Động Của EduPath</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hệ thống AI phân tích dựa trên dữ liệu hàng nghìn sinh viên để đưa ra gợi ý chính xác nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Trắc nghiệm",
                desc: "Thực hiện bài kiểm tra tính cách & năng lực chuyên sâu.",
                icon: "📝"
              },
              {
                step: "02",
                title: "Phân tích AI",
                desc: "Hệ thống so sánh hồ sơ của bạn với 500+ ngành nghề.",
                icon: "🤖"
              },
              {
                step: "03",
                title: "Gợi ý lộ trình",
                desc: "Nhận danh sách ngành học và trường phù hợp nhất.",
                icon: "🎯"
              },
              {
                step: "04",
                title: "Kế hoạch hành động",
                desc: "Xây dựng các bước cụ thể để đạt được mục tiêu.",
                icon: "🚀"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-gray-300 group-hover:text-red-100 transition-colors">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Showcase */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ngành Nghề Xu Hướng 2026</h2>
              <p className="text-lg text-gray-600">Khám phá các lựa chọn nghề nghiệp có nhu cầu cao.</p>
            </div>
            <Link to="/quiz" className="text-red-600 font-bold hover:text-red-700 flex items-center gap-1 no-underline">
              Xem tất cả ngành nghề <span className="text-xl">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-48 bg-gray-200 relative">
                <img src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Code" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs font-bold text-gray-800 backdrop-blur-sm">CÔNG NGHỆ</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Kỹ sư phần mềm</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Thiết kế và xây dựng các ứng dụng, hệ thống phần mềm giải quyết vấn đề thực tế.</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Lương cao
                  </span>
                  <span className="text-xs text-gray-400">4-5 năm đào tạo</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-48 bg-gray-200 relative">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Data" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs font-bold text-gray-800 backdrop-blur-sm">KINH TẾ</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Phân tích dữ liệu</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Biến dữ liệu thô thành thông tin có giá trị để hỗ trợ ra quyết định kinh doanh.</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    Nhu cầu tăng
                  </span>
                  <span className="text-xs text-gray-400">3.5-4 năm đào tạo</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer">
              <div className="h-48 bg-gray-200 relative">
                <img src="https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Design" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-xs font-bold text-gray-800 backdrop-blur-sm">SÁNG TẠO</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">UX/UI Designer</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">Tạo ra những trải nghiệm số trực quan, dễ sử dụng và đẹp mắt cho người dùng.</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    Linh hoạt
                  </span>
                  <span className="text-xs text-gray-400">Self-taught / Khóa học</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-red-500/50">
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">50k+</div>
              <div className="text-red-100 font-medium text-sm">Người dùng active</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">120+</div>
              <div className="text-red-100 font-medium text-sm">Trường đại học LK</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">95%</div>
              <div className="text-red-100 font-medium text-sm">Độ chính xác AI</div>
            </div>
            <div className="p-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">24/7</div>
              <div className="text-red-100 font-medium text-sm">Hỗ trợ tư vấn</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Câu Chuyện Thành Công</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn A",
                role: "Sinh viên ĐH Bách Khoa",
                content: "Nhờ EduPath, mình đã nhận ra đam mê với Khoa học dữ liệu thay vì Kinh tế như dự định ban đầu. Lộ trình học tập rất rõ ràng!",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              },
              {
                name: "Trần Thị B",
                role: "Fresher Marketing",
                content: "Bài trắc nghiệm tính cách cực kỳ chính xác. Mình đã tìm được môi trường làm việc phù hợp với tính cách hướng ngoại của mình.",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"
              },
              {
                name: "Lê Văn C",
                role: "Học sinh THPT",
                content: "Bố mẹ mình đã yên tâm hơn rất nhiều khi thấy kết quả phân tích chi tiết từ EduPath. Cảm ơn đội ngũ phát triển!",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full bg-gray-100" />
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-4">
                  {'★'.repeat(5)}
                </div>
                <p className="text-gray-600 italic">"{item.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">Câu Hỏi Thường Gặp</h2>

          <div className="space-y-4">
            {[
              {
                q: "Bài trắc nghiệm của EduPath có chính xác không?",
                a: "EduPath sử dụng mô hình AI được huấn luyện trên dữ liệu của hàng nghìn sinh viên và chuyên gia, kết hợp với các lý thuyết tâm lý học uy tín (MBTI, Holland) để đảm bảo độ chính xác cao nhất."
              },
              {
                q: "Tôi có mất phí khi sử dụng không?",
                a: "Bạn có thể làm bài trắc nghiệm và nhận kết quả cơ bản hoàn toàn miễn phí. Gói chuyên sâu với lộ trình chi tiết sẽ có một khoản phí nhỏ để duy trì hệ thống."
              },
              {
                q: "Kết quả có được bảo mật không?",
                a: "Tuyệt đối. EduPath cam kết bảo mật thông tin cá nhân và kết quả trắc nghiệm của bạn theo tiêu chuẩn an toàn dữ liệu quốc tế."
              },
              {
                q: "Tôi có thể làm lại bài trắc nghiệm không?",
                a: "Có, bạn có thể làm lại bài trắc nghiệm bất cứ lúc nào để cập nhật sự thay đổi trong định hướng và sở thích của mình."
              }
            ].map((item, idx) => (
              <details key={idx} className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-gray-900 hover:bg-gray-100 transition-colors">
                  <span>{item.q}</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-gray-600 p-6 pt-0 leading-relaxed border-t border-gray-100/50">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1 w-12 bg-red-600 rounded-full"></span>
                <span className="text-red-600 font-bold uppercase tracking-wider text-sm">Về chúng tôi</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Sứ mệnh đồng hành cùng thế hệ trẻ Việt Nam</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                EduPath được thành lập với niềm tin rằng mỗi cá nhân đều có một tài năng riêng biệt. Nhiệm vụ của chúng tôi là giúp bạn khám phá và phát huy tiềm năng đó thông qua công nghệ và dữ liệu giáo dục.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Đội ngũ của chúng tôi bao gồm các chuyên gia giáo dục, kỹ sư AI và những người đam mê định hướng nghề nghiệp, cùng chung tay xây dựng một nền tảng hữu ích cho cộng đồng.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-4xl font-bold text-gray-900 mb-1">50K+</h4>
                  <p className="text-sm text-gray-500">Người dùng</p>
                </div>
                <div>
                  <h4 className="text-4xl font-bold text-gray-900 mb-1">200+</h4>
                  <p className="text-sm text-gray-500">Đối tác trường học</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-emerald-600 rounded-3xl transform rotate-3 opacity-20"></div>
              <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="About Team" className="relative rounded-3xl shadow-xl w-full object-cover h-96" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Đừng Để Tương Lai Là Một Ẩn Số</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Hơn 50,000 bạn trẻ đã tìm được hướng đi đúng đắn nhờ EduPath. Bạn đã sẵn sàng chưa?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/quiz"
              className="px-10 py-4 bg-red-600 text-white rounded-md text-lg font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/30 no-underline"
            >
              Bắt đầu ngay hôm nay
            </Link>
            <Link
              to="/register"
              className="px-10 py-4 bg-transparent border border-gray-600 text-white rounded-md text-lg font-bold hover:bg-gray-800 transition-all no-underline"
            >
              Tạo tài khoản miễn phí
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            Không yêu cầu thẻ tín dụng. Hủy bất kỳ lúc nào.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 no-underline">
              <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center text-white font-bold">E</div>
              <span className="text-xl font-bold text-gray-900">Edu<span className="text-red-600">Path</span></span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Nền tảng định hướng nghề nghiệp hàng đầu dành cho học sinh, sinh viên Việt Nam.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Khám phá</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-red-600 transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Các khoá học</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Sự kiện</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Cộng đồng</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-red-600 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Diễn đàn</a></li>
              <li><a href="#" className="hover:text-red-600 transition-colors">Đối tác</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>contact@edupath.vn</li>
              <li>+84 123 456 789</li>
              <li>Hà Nội, Việt Nam</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 EduPath Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-900">Điều khoản</a>
            <a href="#" className="hover:text-gray-900">Bảo mật</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
