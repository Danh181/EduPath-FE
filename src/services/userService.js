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
    // BE expects: PUT /api/User/{id} with UpdateUser DTO
    const response = await api.put(`/api/User/${userId}`, {
      fullname: userData.fullname,
      email: userData.email,
      DateOfBirth: userData.DateOfBirth || null,
      password: userData.password || null,
      roleid: userData.roleid || null,
      organizationid: userData.organizationid || null,
      isActive: userData.isActive // BE expects isActive
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
    // BE requires currentUserId from JWT token (sent automatically via Authorization header)
    const response = await api.delete(`/api/user/${userId}`);
    
    return {
      success: true,
      message: response.data.message || 'User deleted successfully'
    };
  } catch (error) {
    console.error('Delete user error:', error);
    
    // Handle specific error messages from BE
    let message = 'Failed to delete user';
    if (error.response?.status === 403) {
      message = error.response.data.message || 'Bạn không có quyền xóa người dùng này';
    }
    
    return {
      success: false,
      message: error.response?.data?.message || message
    };
  }
};

// Create user (admin only)
export const createUser = async (userData) => {
  try {
    const response = await api.post('/api/user', {
      fullname: userData.fullname,
      email: userData.email,
      password: userData.password,
      roleid: userData.roleid,
      DateOfBirth: userData.DateOfBirth || null
      // isactive is set to true by default in BE, no need to send
    });
    
    return {
      success: true,
      message: response.data.message || 'User created successfully',
      user: response.data.data || response.data
    };
  } catch (error) {
    console.error('Create user error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create user'
    };
  }
};

// Search user by name
export const searchUserByName = async (name) => {
  try {
    const response = await api.get(`/api/user/by-name/${name}`);
    
    return {
      success: true,
      user: response.data.data || response.data
    };
  } catch (error) {
    console.error('Search user error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'User not found'
    };
  }
};

// Get users by organization (for Organization role)
export const getUsersByOrganization = async () => {
  try {
    // This endpoint uses JWT token to automatically filter by organizationid
    const response = await api.get('/api/User/users');
    
    return {
      success: true,
      users: response.data.data || response.data
    };
  } catch (error) {
    console.error('Get organization users error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get organization users'
    };
  }
};
