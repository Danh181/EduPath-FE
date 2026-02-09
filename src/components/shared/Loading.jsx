import PropTypes from 'prop-types';

/**
 * Loading Spinner Component
 */
function Loading({ message = 'Đang tải...', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin border-t-indigo-600"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"></div>
        </div>
      </div>
      {message && (
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

Loading.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default Loading;
