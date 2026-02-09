import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for search and filter functionality
 * @param {Array} data - Original data array
 * @param {Object} options - Configuration options
 * @returns {Object} Filtered data and search methods
 */
export function useSearch(data = [], options = {}) {
  const {
    searchFields = [], // Array of field names to search in
    filterField = null, // Field to filter by (e.g., 'status', 'role')
    initialSearchQuery = '',
    initialFilter = 'all'
  } = options;

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filter, setFilter] = useState(initialFilter);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply filter
    if (filter !== 'all' && filterField) {
      result = result.filter(item => {
        const fieldValue = item[filterField];
        
        // Handle boolean status
        if (typeof fieldValue === 'boolean') {
          if (filter === 'active') return fieldValue === true;
          if (filter === 'inactive') return fieldValue === false;
        }
        
        // Handle string comparison (case-insensitive)
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase() === filter.toLowerCase();
        }
        
        return fieldValue === filter;
      });
    }

    // Apply search
    if (searchQuery.trim() && searchFields.length > 0) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = item[field];
          if (value == null) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }

    return result;
  }, [data, searchQuery, filter, searchFields, filterField]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const resetFilter = useCallback(() => {
    setFilter('all');
  }, []);

  const reset = useCallback(() => {
    clearSearch();
    resetFilter();
  }, [clearSearch, resetFilter]);

  return {
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    filteredData,
    clearSearch,
    resetFilter,
    reset,
    resultCount: filteredData.length,
    totalCount: data.length
  };
}

/**
 * Custom hook for multi-field filtering
 * @param {Array} data - Original data array
 * @param {Object} initialFilters - Initial filter values
 * @returns {Object} Filtered data and filter methods
 */
export function useMultiFilter(data = [], initialFilters = {}) {
  const [filters, setFilters] = useState(initialFilters);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === 'all') return true;
        
        const itemValue = item[key];
        
        // Handle boolean
        if (typeof itemValue === 'boolean') {
          if (value === 'active') return itemValue === true;
          if (value === 'inactive') return itemValue === false;
        }
        
        // Handle string (case-insensitive)
        if (typeof itemValue === 'string' && typeof value === 'string') {
          return itemValue.toLowerCase() === value.toLowerCase();
        }
        
        return itemValue === value;
      });
    });
  }, [data, filters]);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    filteredData,
    resultCount: filteredData.length,
    totalCount: data.length
  };
}
