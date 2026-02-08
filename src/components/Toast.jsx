import { useState, useEffect } from 'react';

function Toast({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger animation sau khi mount
    setTimeout(() => setIsVisible(true), 10);

    // Shake animation cho error
    if (type === 'error') {
      setTimeout(() => setIsShaking(true), 100);
      setTimeout(() => setIsShaking(false), 600);
    }

    // Progress bar animation
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
    }, 50);

    // Tự động đóng sau duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Đợi animation kết thúc
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onClose, type]);

  const bgColor = type === 'success' 
    ? 'bg-gradient-to-r from-green-500 to-green-600' 
    : type === 'error' 
    ? 'bg-gradient-to-r from-red-500 to-red-600' 
    : 'bg-gradient-to-r from-blue-500 to-blue-600';

  const progressColor = type === 'success'
    ? 'bg-green-300'
    : type === 'error'
    ? 'bg-red-300'
    : 'bg-blue-300';

  const borderColor = type === 'success'
    ? 'border-green-400'
    : type === 'error'
    ? 'border-red-400'
    : 'border-blue-400';

  const icon = type === 'success' 
    ? '✓' 
    : type === 'error' 
    ? '✕' 
    : 'ℹ';

  return (
    <div 
      className={`fixed top-5 right-5 z-[9999] transform transition-all duration-300 ease-out ${
        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      } ${isShaking ? 'animate-shake' : ''}`}
      style={{ maxWidth: '420px' }}
    >
      <div className={`${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-start gap-3 border-2 ${borderColor} backdrop-blur-sm relative overflow-hidden`}>
        {/* Progress bar */}
        <div 
          className={`absolute bottom-0 left-0 h-1 ${progressColor} transition-all duration-100 ease-linear`}
          style={{ width: `${progress}%` }}
        />
        
        <div className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-white/20 font-bold text-xl ${
          type === 'success' ? 'animate-bounce' : type === 'error' ? 'animate-pulse' : ''
        }`}>
          {icon}
        </div>
        <p className="flex-1 text-sm font-medium leading-relaxed pt-1">{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-white hover:text-gray-200 transition-all hover:rotate-90 duration-200 text-2xl font-bold leading-none mt-0.5"
          aria-label="Đóng thông báo"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Toast;
