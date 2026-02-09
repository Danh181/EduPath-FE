import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * Major Form Component (for both Create and Edit)
 */
function MajorForm({ major, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    majorName: '',
    description: '',
    status: true
  });

  useEffect(() => {
    if (major) {
      setFormData({
        majorName: major.majorName || '',
        description: major.description || '',
        status: major.status !== false
      });
    }
  }, [major]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="majorName" className="block text-sm font-semibold text-gray-700 mb-2">
          Tên ngành <span className="text-red-500">*</span>
        </label>
        <input
          id="majorName"
          type="text"
          value={formData.majorName}
          onChange={(e) => setFormData({...formData, majorName: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Ví dụ: Công nghệ thông tin"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
          Mô tả
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Mô tả ngắn về ngành học..."
          rows="3"
        />
      </div>

      {isEdit && (
        <div className="mb-6">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-200 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            {formData.status ? '✅ Ngành đang hoạt động' : '❌ Ngành bị vô hiệu hóa'}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          {isEdit ? 'Lưu thay đổi' : 'Tạo ngành'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}

MajorForm.propTypes = {
  major: PropTypes.shape({
    majorName: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.bool
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

export default MajorForm;
