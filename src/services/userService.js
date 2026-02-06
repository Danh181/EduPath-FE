import api from './api';

// Get user profile by ID
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/api/user/${userId}`);
    
    return {
      success: true,
      user: response.data.data || response.data
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get user profile'
    };
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.post('/api/user/Update', {
      userid: userId,
      fullname: userData.fullname,
      email: userData.email,
      dateofbirth: userData.dateofbirth,
      // Keep other fields that might be required by API
      isactive: true
    });

    return {
      success: true,
      message: response.data.message || 'Profile updated successfully',
      user: response.data.data || response.data
    };
  } catch (error) {
    console.error('Update user profile error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update profile'
    };
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/api/user');
    
    return {
      success: true,
      users: response.data.data || response.data
    };
  } catch (error) {
    console.error('Get all users error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get users'
    };
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/api/user/${userId}`);
    
    return {
      success: true,
      message: response.data.message || 'User deleted successfully'
    };
  } catch (error) {
    console.error('Delete user error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete user'
    };
  }
};
