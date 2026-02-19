import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, logout } from './services/authService';

const PricingPage = () => {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (isAuthenticated()) {
            const currentUser = getCurrentUser();
            setUser(currentUser);
        }
    }, []);

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

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    const features = {
        individual: [
            "Truy cập không giới hạn bài trắc nghiệm",
            "Báo cáo chi tiết tính cách & năng lực",
            "Gợi ý lộ trình học tập cá nhân hóa",
            "Lưu yêu thích trường & ngành học",
            "Cập nhật tin tức tuyển sinh mới nhất"
        ],
        business: [
            "Tất cả quyền lợi gói Cá nhân",
            "Quản lý hồ sơ nhiều ứng viên/học sinh",
            "Báo cáo phân tích chuyên sâu cho nhóm",
            "Hỗ trợ tư vấn chuyên gia 1-1",
            "API tích hợp hệ thống riêng",
            "Ưu tiên hỗ trợ kỹ thuật 24/7"
        ]
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
                        <Link to="/pricing" className="text-red-600 font-bold transition-colors no-underline">Bảng giá</Link>
                        <Link to="/#how-it-works" className="text-gray-700 hover:text-red-600 font-medium transition-colors no-underline">Cách hoạt động</Link>
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

            {/* Pricing Content */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-red-700 text-sm font-bold mb-4 border border-red-100">
                            Bảng giá linh hoạt
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Lựa chọn gói phù hợp với bạn
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Chúng tôi cung cấp các giải pháp tối ưu cho cả cá nhân muốn định hướng tương lai và doanh nghiệp/tổ chức giáo dục.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Individual Plan */}
                        <div className="relative bg-white rounded-xl p-8 shadow-lg border-2 border-red-600 transform md:-translate-y-2">
                            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                PHỔ BIẾN NHẤT
                            </div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cá Nhân</h3>
                                <p className="text-gray-500">Dành cho học sinh, sinh viên</p>
                            </div>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-extrabold text-gray-900">0đ</span>
                                <span className="text-gray-500 ml-2">/ tháng</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {features.individual.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                                            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="block w-full py-4 px-6 text-center bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200">
                                <Link to="/quiz" className="block w-full h-full">Bắt đầu miễn phí</Link>
                            </button>
                        </div>

                        {/* Business Plan */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 hover:shadow-xl transition-all">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Doanh Nghiệp</h3>
                                <p className="text-gray-500">Dành cho trường học, trung tâm</p>
                            </div>
                            <div className="flex items-baseline mb-8">
                                <span className="text-4xl font-extrabold text-gray-900">Liên hệ</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {features.business.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className="block w-full py-4 px-6 text-center bg-white text-gray-700 rounded-lg font-bold text-lg hover:bg-gray-50 transition-all border border-gray-300">
                                Liên hệ tư vấn
                            </button>
                        </div>
                    </div>
                </div>
            </main>

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
};

export default PricingPage;
