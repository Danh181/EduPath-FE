import { Link } from "react-router-dom";

function LoginPage() {
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
                placeholder="example@email.com"
                className="w-full px-5 py-4 rounded-xl border border-red-300 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">
                MẬT KHẨU
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full px-5 py-4 rounded-xl border border-red-300 focus:outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  👁
                </span>
              </div>
            </div>

            {/* Button */}
            <button className="w-full py-4 bg-indigo-500 text-white rounded-xl font-semibold shadow-lg">
              Đăng nhập vào EduPath
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
    </>
  );
}

export default LoginPage;
