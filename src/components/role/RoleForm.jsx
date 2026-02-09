import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * Role Form Component (for both Create and Edit)
 */
function RoleForm({ role, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    RoleName: '',
    Status: true
  });

  useEffect(() => {
    if (role) {
      setFormData({
        RoleName: role.RoleName || '',
        Status: role.Status !== false
      });
    }
  }, [role]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="RoleName" className="block text-sm font-semibold text-gray-700 mb-2">
          Tên vai trò <span className="text-red-500">*</span>
        </label>
        <input
          id="RoleName"
          type="text"
          value={formData.RoleName}
          onChange={(e) => setFormData({...formData, RoleName: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Ví dụ: Admin, User, Moderator..."
          required
        />
      </div>

      {isEdit && (
        <div className="mb-6">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.Status}
                onChange={(e) => setFormData({...formData, Status: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-200 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            {formData.Status ? '✅ Vai trò đang hoạt động' : '❌ Vai trò bị vô hiệu hóa'}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          {isEdit ? 'Lưu thay đổi' : 'Tạo vai trò'}
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

RoleForm.propTypes = {
  role: PropTypes.shape({
    RoleName: PropTypes.string,
    Status: PropTypes.bool
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

export default RoleForm;
