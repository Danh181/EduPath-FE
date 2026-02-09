import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * University Form Component (for both Create and Edit)
 */
function UniversityForm({ university, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    universityName: '',
    location: '',
    status: true
  });

  useEffect(() => {
    if (university) {
      setFormData({
        universityName: university.universityName || '',
        location: university.location || '',
        status: university.status !== false
      });
    }
  }, [university]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="universityName" className="block text-sm font-semibold text-gray-700 mb-2">
          Tên trường <span className="text-red-500">*</span>
        </label>
        <input
          id="universityName"
          type="text"
          value={formData.universityName}
          onChange={(e) => setFormData({...formData, universityName: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Ví dụ: Đại học FPT"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
          Địa điểm
        </label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Ví dụ: Hà Nội, TP.HCM..."
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
            {formData.status ? '✅ Trường đang hoạt động' : '❌ Trường bị vô hiệu hóa'}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          {isEdit ? 'Lưu thay đổi' : 'Tạo trường'}
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

UniversityForm.propTypes = {
  university: PropTypes.shape({
    universityName: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.bool
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

export default UniversityForm;
