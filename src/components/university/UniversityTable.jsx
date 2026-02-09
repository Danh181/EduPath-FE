import PropTypes from 'prop-types';
import { EmptyState } from '../shared';

/**
 * University Table Component
 */
function UniversityTable({ universities, onEdit, onDelete, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-700 font-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Tên trường</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Địa điểm</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Trạng thái</th>
              <th className="px-6 py-4 text-center text-sm font-semibold">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {universities.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12">
                  <EmptyState 
                    title="Không có trường nào"
                    message="Chưa có trường đại học nào trong hệ thống"
                  />
                </td>
              </tr>
            ) : (
              universities.map((university) => (
                <tr key={university.universityId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {university.universityId}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {university.universityName || 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {university.location || 'Chưa cập nhật'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      university.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        university.status ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {university.status ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(university)}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-semibold flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa
                      </button>
                      <button
                        onClick={() => onDelete(university.universityId, university.universityName)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-semibold flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

UniversityTable.propTypes = {
  universities: PropTypes.arrayOf(
    PropTypes.shape({
      universityId: PropTypes.number,
      universityName: PropTypes.string,
      location: PropTypes.string,
      status: PropTypes.bool
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default UniversityTable;
