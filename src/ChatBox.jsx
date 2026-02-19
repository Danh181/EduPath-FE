import { useState, useRef, useEffect } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

const ChatBox = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('API key không tồn tại.')
      }

      const result = await model.generateContent(input)
      const response = await result.response
      const text = response.text()

      const aiMessage = { role: 'model', content: text }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Lỗi:', error)
      const errorMsg = 'Xin lỗi, tôi đang gặp chút sự cố kết nối. Vui lòng thử lại sau!'
      setMessages(prev => [...prev, { role: 'model', content: errorMsg }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button & Welcome Bubble */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Welcome Bubble (Only show when closed and no messages yet) */}
        {!isOpen && messages.length === 0 && (
          <div className="bg-white px-4 py-2 rounded-2xl rounded-tr-none shadow-xl border border-gray-100 animate-bounce mb-2 max-w-[200px]">
            <p className="text-sm font-medium text-gray-800">👋 Bạn cần tư vấn hướng nghiệp?</p>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen
              ? 'bg-gray-800 rotate-90'
              : 'bg-gradient-to-tr from-red-600 to-emerald-600 hover:rotate-12'
            }`}
        >
          {/* Pulse Effect for Attention */}
          {!isOpen && (
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20 animate-ping"></span>
          )}

          {isOpen ? (
            <svg className="w-8 h-8 text-white transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Custom Robot/Chat Icon
            <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[500px] max-h-[80vh] flex flex-col z-50 animate-fade-in-up">
          {/* Glassmorphism Container */}
          <div className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20"></div>

          {/* Content Wrapper */}
          <div className="relative flex flex-col h-full rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-emerald-600 p-4 flex items-center gap-3 shadow-md">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">EduPath AI</h3>
                <div className="flex items-center gap-1.5 opacity-90">
                  <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></span>
                  <p className="text-xs text-white font-medium">Sẵn sàng hỗ trợ</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scroll-smooth">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-6">
                  <div className="w-20 h-20 bg-gradient-to-tr from-red-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="font-semibold text-gray-800 mb-1">Xin chào!</p>
                  <p className="text-sm">Mình là trợ lý ảo AI. Bạn có thắc mắc gì về định hướng nghề nghiệp không?</p>

                  <div className="mt-6 grid grid-cols-1 gap-2 w-full">
                    <button onClick={() => setInput("Ngành IT đang hot như thế nào?")} className="text-xs bg-white border border-gray-200 p-2 rounded-lg hover:border-red-400 hover:text-red-500 transition-colors text-left">
                      🔥 Ngành IT đang hot như thế nào?
                    </button>
                    <button onClick={() => setInput("Tôi thích vẽ thì nên học gì?")} className="text-xs bg-white border border-gray-200 p-2 rounded-lg hover:border-red-400 hover:text-red-500 transition-colors text-left">
                      🎨 Tôi thích vẽ thì nên học gì?
                    </button>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-emerald-500 flex items-center justify-center mr-2 shadow-sm text-xs text-white font-bold flex-shrink-0 mt-1">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${msg.role === 'user'
                        ? 'bg-gradient-to-r from-red-600 to-emerald-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 mr-2 flex-shrink-0"></div>
                  <div className="bg-white border border-gray-100 text-gray-800 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2 items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập câu hỏi..."
                  className="flex-1 bg-transparent focus:outline-none text-sm text-gray-800 placeholder-gray-400"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-red-200 transform hover:scale-105 active:scale-95 duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-400">EduPath AI có thể mắc lỗi. Hãy kiểm chứng thông tin quan trọng.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBox
