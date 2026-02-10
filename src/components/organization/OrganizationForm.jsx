import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * Organization Form Component (for both Create and Edit)
 */
function OrganizationForm({ organization, onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    organizationName: '',
    type: '',
    status: true,
    // For create only
    adminFullName: '',
    adminEmail: '',
    adminPassword: ''
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        organizationName: organization.organizationName || '',
        type: organization.type || '',
        status: organization.status !== false,
        adminFullName: '',
        adminEmail: '',
        adminPassword: ''
      });
    }
  }, [organization]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="organizationName" className="block text-sm font-semibold text-gray-700 mb-2">
          Tên doanh nghiệp <span className="text-red-500">*</span>
        </label>
        <input
          id="organizationName"
          type="text"
          value={formData.organizationName}
          onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Nhập tên doanh nghiệp"
          required
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
          Loại hình
        </label>
        <input
          id="type"
          type="text"
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Ví dụ: Công ty TNHH, Công ty CP..."
        />
      </div>

      {/* Admin info (only for create) */}
      {!isEdit && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Thông tin Admin</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="adminFullName" className="block text-sm font-semibold text-gray-700 mb-2">
                Họ và tên Admin <span className="text-red-500">*</span>
              </label>
              <input
                id="adminFullName"
                type="text"
                value={formData.adminFullName}
                onChange={(e) => setFormData({...formData, adminFullName: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Nhập họ tên"
                required={!isEdit}
              />
            </div>

            <div>
              <label htmlFor="adminEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Admin <span className="text-red-500">*</span>
              </label>
              <input
                id="adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="admin@example.com"
                required={!isEdit}
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Mật khẩu Admin <span className="text-red-500">*</span>
              </label>
              <input
                id="adminPassword"
                type="password"
                value={formData.adminPassword}
                onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Tối thiểu 6 ký tự"
                minLength="6"
                required={!isEdit}
              />
              <p className="text-xs text-gray-500 mt-1">Mật khẩu mặc định cho tài khoản admin của doanh nghiệp</p>
            </div>
          </div>
        </div>
      )}

      {/* Status (only for edit) */}
      {isEdit && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Trạng thái
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.status === true}
                onChange={() => setFormData({...formData, status: true})}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Hoạt động</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.status === false}
                onChange={() => setFormData({...formData, status: false})}
                className="w-4 h-4 text-indigo-600"
              />
              <span className="text-sm text-gray-700">Không hoạt động</span>
            </label>
          </div>
        </div>
      )}

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
          className={`px-6 py-2 text-white rounded-lg font-semibold transition-all shadow-lg ${
            isEdit 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
          }`}
        >
          {isEdit ? 'Cập nhật' : 'Tạo doanh nghiệp'}
        </button>
      </div>
    </form>
  );
}

OrganizationForm.propTypes = {
  organization: PropTypes.shape({
    organizationId: PropTypes.number,
    organizationName: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.bool
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

export default OrganizationForm;
