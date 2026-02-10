import { useState, useCallback } from 'react';

/**
 * Validation rules
 */
const validators = {
  fullname: (value) => {
    if (!value.trim()) {
      return 'Họ tên không được để trống';
    }
    if (value.trim().length < 2) {
      return 'Họ tên phải có ít nhất 2 ký tự';
    }
    if (value.trim().length > 255) {
      return 'Họ tên không được quá 255 ký tự';
    }
    return '';
  },

  email: (value) => {
    if (!value.trim()) {
      return 'Email không được để trống';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email không hợp lệ';
    }
    return '';
  },

  dateOfBirth: (value) => {
    if (!value) return ''; // Optional field
    
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (birthDate > today) {
      return 'Ngày sinh không được là ngày trong tương lai';
    }
    if (age < 13) {
      return 'Bạn phải từ 13 tuổi trở lên';
    }
    if (age > 100) {
      return 'Ngày sinh không hợp lệ';
    }
    return '';
  },

  password: (value) => {
    if (!value) {
      return 'Mật khẩu không được để trống';
    }
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  },

  confirmPassword: (value, formData) => {
    if (!value) {
      return 'Vui lòng xác nhận mật khẩu';
    }
    if (value !== formData.password) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return '';
  }
};

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Array<string>} validationFields - Fields to validate
 * @returns {Object} Form state and handlers
 */
export function useFormValidation(initialValues = {}, validationFields = []) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validate single field
  const validateField = useCallback((name, value) => {
    if (!validationFields.includes(name)) return '';
    
    const validator = validators[name];
    if (!validator) return '';
    
    // Pass formData for fields that need it (like confirmPassword)
    return validator(value, formData);
  }, [formData, validationFields]);

  // Validate all fields
  const validateForm = useCallback(() => {
    const newErrors = {};
    validationFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    return newErrors;
  }, [formData, validationFields, validateField]);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    // Special case: validate confirmPassword when password changes
    if (name === 'password' && touched.confirmPassword && formData.confirmPassword) {
      const confirmError = validators.confirmPassword(formData.confirmPassword, { ...formData, password: value });
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  }, [touched, validateField, formData]);

  // Handle field blur
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Set form data (for pre-filling)
  const setFormValues = useCallback((values) => {
    setFormData(prev => ({ ...prev, ...values }));
  }, []);

  // Mark all fields as touched (for submit)
  const touchAllFields = useCallback(() => {
    const allTouched = validationFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
  }, [validationFields]);

  // Check if form is valid
  const isValid = useCallback(() => {
    const validationErrors = validateForm();
    return Object.keys(validationErrors).length === 0;
  }, [validateForm]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    validateField,
    resetForm,
    setFormValues,
    touchAllFields,
    isValid
  };
}
