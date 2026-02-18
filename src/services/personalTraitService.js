import api from './api';

// Get all personal traits
export const getAllPersonalTraits = async () => {
  try {
    const response = await api.get('/api/PersonalTrait');
    
    return {
      success: true,
      traits: response.data || []
    };
  } catch (error) {
    console.error('Get all personal traits error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get personal traits'
    };
  }
};

// Get personal trait by traitCode
export const getPersonalTraitById = async (traitCode) => {
  try {
    const response = await api.get(`/api/PersonalTrait/${traitCode}`);
    
    return {
      success: true,
      trait: response.data || null
    };
  } catch (error) {
    console.error('Get personal trait by id error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to get personal trait'
    };
  }
};

// Update personal trait
export const updatePersonalTrait = async (traitCode, traitData) => {
  try {
    const response = await api.put(`/api/PersonalTrait/${traitCode}`, {
      TraitName: traitData.TraitName,
      status: traitData.status
    });
    
    return {
      success: true,
      message: response.data || 'Personal trait updated successfully'
    };
  } catch (error) {
    console.error('Update personal trait error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update personal trait'
    };
  }
};

// Delete personal trait (soft delete)
export const deletePersonalTrait = async (traitCode) => {
  try {
    const response = await api.delete(`/api/PersonalTrait/${traitCode}`);
    
    return {
      success: true,
      message: response.data || 'Personal trait deleted successfully'
    };
  } catch (error) {
    console.error('Delete personal trait error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete personal trait'
    };
  }
};
