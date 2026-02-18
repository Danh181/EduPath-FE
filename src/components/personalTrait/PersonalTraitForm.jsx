import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * PersonalTrait Form Component for Edit
 */
function PersonalTraitForm({ trait, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    TraitName: '',
    status: true
  });

  useEffect(() => {
    if (trait) {
      setFormData({
        TraitName: trait.TraitName || '',
        status: trait.status ?? true
      });
    }
  }, [trait]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Mã tính cách
        </label>
        <input
          type="text"
          value={trait?.TraitCode || ''}
          disabled
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">Mã tính cách không thể thay đổi</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tên tính cách <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="TraitName"
          value={formData.TraitName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Nhập tên tính cách"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Trạng thái
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="true"
              checked={formData.status === true}
              onChange={() => setFormData(prev => ({ ...prev, status: true }))}
              className="w-4 h-4 text-indigo-600"
            />
            <span className="text-sm text-gray-700">Hoạt động</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="false"
              checked={formData.status === false}
              onChange={() => setFormData(prev => ({ ...prev, status: false }))}
              className="w-4 h-4 text-indigo-600"
            />
            <span className="text-sm text-gray-700">Không hoạt động</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
        >
          Cập nhật
        </button>
      </div>
    </form>
  );
}

PersonalTraitForm.propTypes = {
  trait: PropTypes.shape({
    TraitCode: PropTypes.string,
    TraitName: PropTypes.string,
    status: PropTypes.bool
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default PersonalTraitForm;
