import api from './api';

// Get all majors
export const getAllMajors = async () => {
  try {
    const response = await api.get('/api/majors');
    
    return {
      success: true,
      majors: response.data || []
    };
  } catch (error) {
    console.error('Get all majors error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get majors'
    };
  }
};

// Get major by ID
export const getMajorById = async (majorId) => {
  try {
    const response = await api.get(`/api/majors/${majorId}`);
    
    return {
      success: true,
      major: response.data
    };
  } catch (error) {
    console.error('Get major error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get major'
    };
  }
};

// Create new major
export const createMajor = async (majorData) => {
  try {
    const response = await api.post('/api/majors', {
      MajorName: majorData.majorName || majorData.MajorName,
      Description: majorData.description || majorData.Description
    });
    
    return {
      success: true,
      message: response.data || 'Major created successfully'
    };
  } catch (error) {
    console.error('Create major error:', error);
    return {
      success: false,
      message: error.response?.data || 'Failed to create major'
    };
  }
};

// Update major
export const updateMajor = async (majorId, majorData) => {
  try {
    const response = await api.put(`/api/majors/${majorId}`, {
      MajorName: majorData.majorName || majorData.MajorName,
      Description: majorData.description || majorData.Description,
      Status: majorData.status !== undefined ? majorData.status : majorData.Status
    });
    
    return {
      success: true,
      message: response.data || 'Major updated successfully'
    };
  } catch (error) {
    console.error('Update major error:', error);
    return {
      success: false,
      message: error.response?.data || 'Failed to update major'
    };
  }
};

// Delete major (soft delete)
export const deleteMajor = async (majorId) => {
  try {
    const response = await api.delete(`/api/majors/${majorId}`);
    
    return {
      success: true,
      message: response.data || 'Major deleted successfully'
    };
  } catch (error) {
    console.error('Delete major error:', error);
    return {
      success: false,
      message: error.response?.data || 'Failed to delete major'
    };
  }
};
