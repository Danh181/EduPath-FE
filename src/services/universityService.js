import api from './api';

// Get all universities
export const getAllUniversities = async () => {
  try {
    const response = await api.get('/api/universities');
    
    return {
      success: true,
      universities: response.data || []
    };
  } catch (error) {
    console.error('Get all universities error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get universities'
    };
  }
};

// Get university by ID
export const getUniversityById = async (universityId) => {
  try {
    const response = await api.get(`/api/universities/${universityId}`);
    
    return {
      success: true,
      university: response.data
    };
  } catch (error) {
    console.error('Get university error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get university'
    };
  }
};

// Create new university
export const createUniversity = async (universityData) => {
  try {
    const response = await api.post('/api/universities', {
      UniversityName: universityData.universityName || universityData.UniversityName,
      Location: universityData.location || universityData.Location
    });
    
    return {
      success: true,
      message: response.data || 'University created successfully'
    };
  } catch (error) {
    console.error('Create university error:', error);
    return {
      success: false,
      message: error.response?.data || 'Failed to create university'
    };
  }
};

// Update university
export const updateUniversity = async (universityId, universityData) => {
  try {
    const response = await api.put(`/api/universities/${universityId}`, {
      UniversityName: universityData.universityName || universityData.UniversityName,
      Location: universityData.location || universityData.Location,
      Status: universityData.status !== undefined ? universityData.status : universityData.Status
    });
    
    return {
      success: true,
      message: response.data || 'University updated successfully'
    };
  } catch (error) {
    console.error('Update university error:', error);
    return {
      success: false,
      message: error.response?.data || 'Failed to update university'
    };
  }
};

// Delete university (soft delete)
export const deleteUniversity = async (universityId) => {
  try {
    const response = await api.delete(`/api/universities/${universityId}`);
    
    return {
      success: true,
      message: response.data || 'University deleted successfully'
    };
  } catch (error) {
    console.error('Delete university error:', error);
    return {
      success: false,
      message: error.response?.data || 'Failed to delete university'
    };
  }
};
