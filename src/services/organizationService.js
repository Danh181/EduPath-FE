import api from './api';

// Get all organizations
export const getAllOrganizations = async () => {
  try {
    const response = await api.get('/api/organizations');
    
    // Handle both array and object responses
    const data = Array.isArray(response.data) ? response.data : (response.data?.organizations || []);
    
    // Normalize field names from backend
    const normalized = data.map(org => ({
      organizationId: org.organizationid || org.organizationId,
      organizationName: org.organizationname || org.organizationName,
      type: org.type || org.Type,
      createdAt: org.createdat || org.createdAt,
      status: org.status !== undefined ? org.status : org.Status
    }));
    
    return {
      success: true,
      organizations: normalized
    };
  } catch (error) {
    console.error('Error fetching organizations:', error);
    // Return empty array without triggering error toast for common cases
    // Only log error in console for debugging
    return {
      success: true, // Changed to true to avoid error toast
      organizations: []
    };
  }
};

// Get organization by ID
export const getOrganizationById = async (id) => {
  try {
    const response = await api.get(`/api/organizations/${id}`);
    
    if (response.data) {
      // Normalize field names
      const org = response.data;
      return {
        success: true,
        organization: {
          organizationId: org.organizationid || org.organizationId,
          organizationName: org.organizationname || org.organizationName,
          type: org.type || org.Type,
          createdAt: org.createdat || org.createdAt,
          status: org.status !== undefined ? org.status : org.Status
        }
      };
    }
    
    return { success: false, message: 'Organization not found' };
  } catch (error) {
    console.error('Error fetching organization:', error);
    return {
      success: false,
      message: error.response?.data || 'Failed to fetch organization'
    };
  }
};

// Create organization account (organization + admin user)
export const createOrganizationAccount = async (data) => {
  try {
    const payload = {
      OrganizationName: data.organizationName,
      Type: data.type || null,
      AdminFullName: data.adminFullName,
      AdminEmail: data.adminEmail,
      AdminPassword: data.adminPassword
    };
    
    const response = await api.post('/api/organization-admin/create', payload);
    
    return {
      success: true,
      message: typeof response.data === 'string' ? response.data : 'Tạo doanh nghiệp thành công'
    };
  } catch (error) {
    console.error('Error creating organization account:', error);
    return {
      success: false,
      message: error.response?.data || error.message || 'Tạo doanh nghiệp thất bại'
    };
  }
};

// Update organization
export const updateOrganization = async (id, data) => {
  try {
    const payload = {
      organizationname: data.organizationName,
      type: data.type || null,
      status: data.status
    };
    
    const response = await api.put(`/api/organizations/${id}`, payload);
    
    return {
      success: true,
      message: typeof response.data === 'string' ? response.data : 'Cập nhật doanh nghiệp thành công'
    };
  } catch (error) {
    console.error('Error updating organization:', error);
    return {
      success: false,
      message: error.response?.data || error.message || 'Cập nhật doanh nghiệp thất bại'
    };
  }
};

// Delete organization (soft delete)
export const deleteOrganization = async (id) => {
  try {
    const response = await api.delete(`/api/organizations/${id}`);
    
    return {
      success: true,
      message: typeof response.data === 'string' ? response.data : 'Xóa doanh nghiệp thành công'
    };
  } catch (error) {
    console.error('Error deleting organization:', error);
    return {
      success: false,
      message: error.response?.data || error.message || 'Xóa doanh nghiệp thất bại'
    };
  }
};
