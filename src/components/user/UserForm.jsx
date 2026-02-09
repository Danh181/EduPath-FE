import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * User Form Component (for both Create and Edit)
 */
function UserForm({ user, roles = [], onSubmit, onCancel, isEdit = false }) {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    roleid: '',
    DateOfBirth: '',
    isActive: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || '',
        email: user.email || '',
        password: '',
        roleid: user.roleid || (roles.length > 0 ? roles[0].roleid : ''),
        DateOfBirth: user.DateOfBirth ? user.DateOfBirth.split('T')[0] : '',
        isActive: user.isActive !== false
      });
    } else if (!isEdit && roles.length > 0) {
      setFormData(prev => ({
        ...prev,
        roleid: roles[0].roleid
      }));
    }
  }, [user, roles, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="fullname" className="block text-sm font-semibold text-gray-700 mb-2">
          Họ và tên <span className="text-red-500">*</span>
        </label>
        <input
          id="fullname"
          type="text"
          value={formData.fullname}
          onChange={(e) => setFormData({...formData, fullname: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Nhập họ và tên"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="example@email.com"
          required
          disabled={isEdit}
        />
      </div>

      {!isEdit && (
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
            placeholder="Nhập mật khẩu"
            required={!isEdit}
          />
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="roleid" className="block text-sm font-semibold text-gray-700 mb-2">
          Vai trò <span className="text-red-500">*</span>
        </label>
        <select
          id="roleid"
          value={formData.roleid}
          onChange={(e) => setFormData({...formData, roleid: e.target.value})}
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
          required
        >
          {roles.map(role => (
            <option key={role.roleid} value={role.roleid}>
              {role.RoleName || role.rolename}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="DateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
          Ngày sinh
        </label>
        <input
          id="DateOfBirth"
          type="date"
          value={formData.DateOfBirth}
          onChange={(e) => setFormData({...formData, DateOfBirth: e.target.value})}
          max={new Date().toISOString().split('T')[0]}
          min="1900-01-01"
          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500"
        />
      </div>

      {isEdit && (
        <div className="mb-6">
          <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-200 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            {formData.isActive ? '✅ Người dùng đang hoạt động' : '❌ Người dùng bị vô hiệu hóa'}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all"
        >
          {isEdit ? 'Lưu thay đổi' : 'Tạo người dùng'}
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

UserForm.propTypes = {
  user: PropTypes.shape({
    userid: PropTypes.number,
    fullname: PropTypes.string,
    email: PropTypes.string,
    roleid: PropTypes.number,
    DateOfBirth: PropTypes.string,
    isActive: PropTypes.bool
  }),
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      roleid: PropTypes.number,
      RoleName: PropTypes.string,
      rolename: PropTypes.string
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

export default UserForm;
