import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Dữ liệu tính cách và gợi ý ngành học
const personalityData = {
  analytical: {
    name: "Tư Duy Phân Tích",
    description: "Bạn là người có tư duy logic, thích phân tích và giải quyết vấn đề. Bạn xuất sắc trong việc làm việc với dữ liệu, công nghệ và nghiên cứu.",
    icon: "🧠",
    color: "from-blue-500 to-cyan-600",
    majors: [
      {
        name: "Khoa học Máy tính",
        description: "Lập trình, phát triển phần mềm, AI, Machine Learning",
        universities: [
          { name: "ĐH Bách Khoa Hà Nội", score: "28.5" },
          { name: "ĐH Công nghệ - ĐHQGHN", score: "27.8" },
          { name: "ĐH FPT", score: "24.0" }
        ]
      },
      {
        name: "Khoa học Dữ liệu",
        description: "Phân tích dữ liệu, Big Data, Business Intelligence",
        universities: [
          { name: "ĐH Kinh tế Quốc dân", score: "27.5" },
          { name: "ĐH Ngoại thương", score: "26.8" },
          { name: "ĐH FPT", score: "23.5" }
        ]
      },
      {
        name: "Kỹ thuật Phần mềm",
        description: "Thiết kế hệ thống, quản lý dự án phần mềm",
        universities: [
          { name: "ĐH Bách Khoa TPHCM", score: "28.0" },
          { name: "ĐH KHTN - ĐHQGHN", score: "27.2" },
          { name: "ĐH Duy Tân", score: "22.5" }
        ]
      }
    ]
  },
  creative: {
    name: "Sáng Tạo",
    description: "Bạn có tư duy sáng tạo, đam mê nghệ thuật và thiết kế. Bạn thích tạo ra những điều mới mẻ và thể hiện cá tính qua công việc.",
    icon: "🎨",
    color: "from-pink-500 to-purple-600",
    majors: [
      {
        name: "Thiết kế Đồ họa",
        description: "Thiết kế UI/UX, Branding, Illustration",
        universities: [
          { name: "ĐH Kiến trúc Hà Nội", score: "26.0" },
          { name: "ĐH Mỹ thuật Công nghiệp", score: "25.5" },
          { name: "ĐH FPT", score: "22.0" }
        ]
      },
      {
        name: "Thiết kế Đa phương tiện",
        description: "Animation, Video, Game Design, Motion Graphics",
        universities: [
          { name: "ĐH Sân khấu Điện ảnh", score: "25.8" },
          { name: "ĐH FPT", score: "23.0" },
          { name: "ĐH RMIT", score: "27.5" }
        ]
      },
      {
        name: "Marketing Sáng tạo",
        description: "Content Creation, Social Media, Digital Marketing",
        universities: [
          { name: "ĐH Ngoại thương", score: "27.0" },
          { name: "ĐH Kinh tế TPHCM", score: "26.5" },
          { name: "ĐH RMIT", score: "28.0" }
        ]
      }
    ]
  },
  social: {
    name: "Xã Hội",
    description: "Bạn là người hướng ngoại, thích giao tiếp và làm việc với con người. Bạn có khả năng lắng nghe và giúp đỡ người khác.",
    icon: "👥",
    color: "from-green-500 to-emerald-600",
    majors: [
      {
        name: "Quản trị Kinh doanh",
        description: "Leadership, Management, Business Strategy",
        universities: [
          { name: "ĐH Ngoại thương", score: "28.0" },
          { name: "ĐH Kinh tế Quốc dân", score: "27.5" },
          { name: "ĐH Kinh tế TPHCM", score: "27.8" }
        ]
      },
      {
        name: "Tâm lý học",
        description: "Tư vấn tâm lý, Nhân sự, Phát triển con người",
        universities: [
          { name: "ĐH Sư phạm Hà Nội", score: "25.5" },
          { name: "ĐH Khoa học Xã hội và Nhân văn", score: "26.0" },
          { name: "ĐH Sư phạm TPHCM", score: "25.8" }
        ]
      },
      {
        name: "Marketing & PR",
        description: "Truyền thông, Quan hệ công chúng, Brand Management",
        universities: [
          { name: "ĐH Ngoại thương", score: "26.8" },
          { name: "ĐH Văn hóa Hà Nội", score: "24.5" },
          { name: "ĐH FPT", score: "23.5" }
        ]
      }
    ]
  },
  practical: {
    name: "Thực Hành",
    description: "Bạn thích làm việc với tay nghề, kỹ thuật và các công việc thực tế. Bạn giỏi trong việc xây dựng, sửa chữa và vận hành.",
    icon: "🔧",
    color: "from-orange-500 to-amber-600",
    majors: [
      {
        name: "Kỹ thuật Cơ khí",
        description: "Thiết kế, chế tạo máy, Tự động hóa",
        universities: [
          { name: "ĐH Bách Khoa Hà Nội", score: "27.5" },
          { name: "ĐH Bách Khoa TPHCM", score: "27.8" },
          { name: "ĐH Giao thông Vận tải", score: "24.5" }
        ]
      },
      {
        name: "Kỹ thuật Điện - Điện tử",
        description: "Hệ thống điện, IoT, Embedded Systems",
        universities: [
          { name: "ĐH Bách Khoa Hà Nội", score: "28.0" },
          { name: "ĐH Bách Khoa TPHCM", score: "28.2" },
          { name: "ĐH Duy Tân", score: "23.0" }
        ]
      },
      {
        name: "Xây dựng Dân dụng",
        description: "Thiết kế công trình, Quản lý thi công",
        universities: [
          { name: "ĐH Kiến trúc Hà Nội", score: "26.5" },
          { name: "ĐH Xây dựng Hà Nội", score: "25.8" },
          { name: "ĐH Bách Khoa TPHCM", score: "27.0" }
        ]
      }
    ]
  }
};

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { personalityType, scores } = location.state || {};

  useEffect(() => {
    // Nếu không có dữ liệu, redirect về trang quiz
    if (!personalityType) {
      navigate('/quiz');
    }
  }, [personalityType, navigate]);

  if (!personalityType) {
    return null;
  }

  const result = personalityData[personalityType];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-full mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">EduPath</span>
          </Link>
          <Link 
            to="/quiz"
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all duration-300 no-underline"
          >
            Làm lại
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hoàn thành!</h1>
            <p className="text-lg text-gray-600">Kết quả trắc nghiệm của bạn đã sẵn sàng</p>
          </div>

          {/* Personality Result */}
          <div className={`bg-gradient-to-r ${result.color} rounded-3xl p-8 md:p-12 text-white mb-8 shadow-2xl`}>
            <div className="text-center">
              <div className="text-7xl mb-4">{result.icon}</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tính cách: {result.name}</h2>
              <p className="text-lg md:text-xl opacity-95 max-w-3xl mx-auto leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* Personality Scores */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(scores).map(([type, score]) => (
                <div key={type} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold mb-1">{score}/10</div>
                  <div className="text-sm opacity-90 capitalize">{personalityData[type].name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Majors Section */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              🎓 Ngành Học Phù Hợp
            </h3>
            
            <div className="space-y-6">
              {result.majors.map((major, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{major.name}</h4>
                      <p className="text-gray-600">{major.description}</p>
                    </div>
                  </div>

                  {/* Universities */}
                  <div className="mt-6">
                    <h5 className="text-sm font-semibold text-gray-500 uppercase mb-3">Trường đại học đề xuất:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {major.universities.map((uni, uniIndex) => (
                        <div key={uniIndex} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                          <div className="font-semibold text-gray-900 mb-2">{uni.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Điểm chuẩn:</span>
                            <span className="text-lg font-bold text-indigo-600">{uni.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              to="/quiz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-indigo-500 text-indigo-600 rounded-xl text-lg font-bold hover:shadow-lg transition-all duration-300 no-underline"
            >
              🔄 Làm lại trắc nghiệm
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-lg font-bold hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-0.5 no-underline"
            >
              🏠 Về trang chủ
            </Link>
          </div>

          {/* Note */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 max-w-2xl">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>💡 Lưu ý:</strong> Kết quả này chỉ mang tính chất tham khảo. 
                Bạn nên tìm hiểu thêm về các ngành học, tham khảo ý kiến từ giáo viên, 
                phụ huynh và những người đang làm trong ngành để có quyết định phù hợp nhất.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
