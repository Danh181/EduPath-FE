import api from './api';

// Get all active roles
export const getAllRoles = async () => {
  try {
    const response = await api.get('/api/roles');
    
    return {
      success: true,
      roles: response.data || []
    };
  } catch (error) {
    console.error('Get all roles error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get roles'
    };
  }
};

// Get role by ID
export const getRoleById = async (roleId) => {
  try {
    const response = await api.get(`/api/roles/${roleId}`);
    
    return {
      success: true,
      role: response.data
    };
  } catch (error) {
    console.error('Get role error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get role'
    };
  }
};

// Create new role
export const createRole = async (roleData) => {
  try {
    const response = await api.post('/api/roles', {
      roleName: roleData.RoleName || roleData.roleName
    });
    
    return {
      success: true,
      message: response.data || 'Role created successfully'
    };
  } catch (error) {
    console.error('Create role error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data || 'Failed to create role'
    };
  }
};

// Update role
export const updateRole = async (roleId, roleData) => {
  try {
    const response = await api.put(`/api/roles/${roleId}`, {
      roleName: roleData.RoleName || roleData.roleName,
      status: roleData.Status !== undefined ? roleData.Status : roleData.status
    });
    
    return {
      success: true,
      message: response.data || 'Role updated successfully'
    };
  } catch (error) {
    console.error('Update role error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data || 'Failed to update role'
    };
  }
};

// Delete role (soft delete)
export const deleteRole = async (roleId) => {
  try {
    const response = await api.delete(`/api/roles/${roleId}`);
    
    return {
      success: true,
      message: response.data || 'Role deleted successfully'
    };
  } catch (error) {
    console.error('Delete role error:', error);
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data || 'Failed to delete role'
    };
  }
};
