import { useState } from 'react';
import { Link } from 'react-router-dom';

// Dữ liệu câu hỏi mẫu (tạm thời)
const mockQuestions = [
  {
    id: 1,
    question: "Bạn thích làm việc theo cách nào nhất?",
    options: [
      "Làm việc độc lập, tự quyết định",
      "Làm việc nhóm, hợp tác với nhiều người",
      "Kết hợp cả hai tùy tình huống",
      "Làm việc dưới sự hướng dẫn rõ ràng"
    ]
  },
  {
    id: 2,
    question: "Khi gặp vấn đề khó, bạn thường?",
    options: [
      "Phân tích logic và tìm giải pháp hệ thống",
      "Sáng tạo và thử nhiều cách khác nhau",
      "Tìm kiếm lời khuyên từ người khác",
      "Học hỏi từ kinh nghiệm trước đó"
    ]
  },
  {
    id: 3,
    question: "Môn học nào bạn thấy hứng thú nhất?",
    options: [
      "Toán học, Vật lý",
      "Văn học, Nghệ thuật",
      "Sinh học, Hóa học",
      "Lịch sử, Địa lý"
    ]
  },
  {
    id: 4,
    question: "Bạn thích công việc có tính chất?",
    options: [
      "Sáng tạo và nghệ thuật",
      "Nghiên cứu và phân tích",
      "Tương tác với con người",
      "Thực hành và kỹ thuật"
    ]
  },
  {
    id: 5,
    question: "Trong thời gian rảnh, bạn thích?",
    options: [
      "Đọc sách, tìm hiểu kiến thức mới",
      "Hoạt động thể thao, ngoài trời",
      "Sáng tạo nội dung, vẽ, viết",
      "Gặp gỡ bạn bè, hoạt động xã hội"
    ]
  }
];

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    // Tạm thời chỉ alert, sau này sẽ call API
    alert('Chức năng đang được phát triển! Kết quả sẽ được hiển thị sau khi tích hợp API.');
  };

  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;
  const question = mockQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === mockQuestions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-full mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 no-underline"
              aria-label="Quay lại"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">EduPath</span>
            </Link>
          </div>
          <div className="text-sm font-medium text-gray-600">
            Câu {currentQuestion + 1} / {mockQuestions.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Tiến trình hoàn thành</span>
              <span className="text-sm font-bold text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-6">
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                Câu hỏi {currentQuestion + 1}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {question.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(question.id, index)}
                  className={`w-full p-5 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
                    answers[question.id] === index
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      answers[question.id] === index
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === index && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-base md:text-lg ${
                      answers[question.id] === index
                        ? 'text-indigo-700 font-semibold'
                        : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                currentQuestion === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-indigo-500 hover:shadow-lg'
              }`}
            >
              ← Câu trước
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== mockQuestions.length}
                className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                  Object.keys(answers).length !== mockQuestions.length
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl hover:transform hover:-translate-y-0.5'
                }`}
              >
                Hoàn thành ✓
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={answers[question.id] === undefined}
                className={`px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                  answers[question.id] === undefined
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-xl hover:transform hover:-translate-y-0.5'
                }`}
              >
                Câu tiếp →
              </button>
            )}
          </div>

          {/* Helper Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              💡 <strong>Lưu ý:</strong> Hãy chọn câu trả lời phản ánh đúng nhất tính cách của bạn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
