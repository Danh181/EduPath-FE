import { useState, useCallback } from 'react';

/**
 * Custom hook for CRUD operations
 * @param {Object} services - Object containing CRUD service functions
 * @param {Function} services.getAll - Function to fetch all items
 * @param {Function} services.create - Function to create an item
 * @param {Function} services.update - Function to update an item
 * @param {Function} services.delete - Function to delete an item
 * @param {Object} options - Configuration options
 * @returns {Object} CRUD state and methods
 */
export function useCRUD(services = {}, options = {}) {
  const {
    getAll,
    create,
    update,
    delete: deleteService
  } = services;

  const {
    initialData = [],
    onSuccess = null,
    onError = null
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Load all data
  const loadData = useCallback(async () => {
    if (!getAll) {
      console.warn('getAll service is not provided');
      return { success: false, error: 'Service not available' };
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getAll();
      
      if (result.success) {
        // Handle different response structures
        const items = result.data || result.users || result.universities || result.majors || result.roles || result.organizations || result.traits || [];
        setData(items);
        return { success: true, data: items };
      } else {
        const errorMsg = result.message || '❌ Không thể tải dữ liệu';
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || '❌ Lỗi khi tải dữ liệu';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [getAll, onError]);

  // Create item
  const createItem = useCallback(async (itemData) => {
    if (!create) {
      console.warn('create service is not provided');
      return { success: false, error: 'Service not available' };
    }

    try {
      setOperationLoading(true);
      setError(null);
      const result = await create(itemData);
      
      if (result.success) {
        await loadData(); // Reload data
        if (onSuccess) onSuccess('✅ Tạo mới thành công!');
        return { success: true, data: result.data };
      } else {
        const errorMsg = result.message || '❌ Không thể tạo mới';
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || '❌ Lỗi khi tạo mới';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setOperationLoading(false);
    }
  }, [create, loadData, onSuccess, onError]);

  // Update item
  const updateItem = useCallback(async (id, itemData) => {
    if (!update) {
      console.warn('update service is not provided');
      return { success: false, error: 'Service not available' };
    }

    try {
      setOperationLoading(true);
      setError(null);
      const result = await update(id, itemData);
      
      if (result.success) {
        await loadData(); // Reload data
        if (onSuccess) onSuccess('✅ Cập nhật thành công!');
        return { success: true, data: result.data };
      } else {
        const errorMsg = result.message || '❌ Không thể cập nhật';
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || '❌ Lỗi khi cập nhật';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setOperationLoading(false);
    }
  }, [update, loadData, onSuccess, onError]);

  // Delete item
  const deleteItem = useCallback(async (id) => {
    if (!deleteService) {
      console.warn('delete service is not provided');
      return { success: false, error: 'Service not available' };
    }

    try {
      setOperationLoading(true);
      setError(null);
      const result = await deleteService(id);
      
      if (result.success) {
        await loadData(); // Reload data
        if (onSuccess) onSuccess('✅ Xóa thành công!');
        return { success: true };
      } else {
        const errorMsg = result.message || '❌ Không thể xóa';
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.message || '❌ Lỗi khi xóa';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setOperationLoading(false);
    }
  }, [deleteService, loadData, onSuccess, onError]);

  // Refresh data
  const refresh = useCallback(() => {
    return loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    operationLoading,
    loadData,
    createItem,
    updateItem,
    deleteItem,
    refresh,
    setData
  };
}
