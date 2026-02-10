import api from './api';

// Decode JWT token manually (không cần install thư viện)
const decodeToken = (token) => {
  try {
    // Validate token format (phải có 3 phần: header.payload.signature)
    if (!token || typeof token !== 'string') {
      console.error('Invalid token format: token must be a string');
      return null;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format: token must have 3 parts');
      return null;
    }

    // Decode phần payload (phần thứ 2)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Thêm padding nếu cần
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    
    // Log để debug (có thể comment sau khi test xong)
    console.log('Decoded token:', decoded);
    
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Login
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });

    const { token } = response.data;
    
    if (!token) {
      return {
        success: false,
        message: 'No token received from server',
      };
    }

    // Decode token để lấy thông tin user
    const userData = decodeToken(token);
    
    if (!userData) {
      return {
        success: false,
        message: 'Failed to decode token',
      };
    }

    // Lưu token vào localStorage
    localStorage.setItem('token', token);
    
    // Lưu user info vào localStorage (chỉ lưu thông tin cần thiết)
    // .NET JWT thường dùng các claim names khác nhau
    
    // Extract fullname with multiple fallbacks
    let fullname = userData.fullName ||  // <- Backend dùng fullName (N viết hoa)
                   userData.fullname || 
                   userData.name || 
                   userData.FullName ||
                   userData.full_name ||
                   userData.given_name ||
                   userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                   userData['unique_name'] ||
                   userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
    
    // Nếu vẫn không có fullname, thử extract từ email
    const emailAddress = userData.email || 
                        userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
                        email;
    
    if (!fullname && emailAddress) {
      // Lấy phần trước @ của email làm tên tạm
      fullname = emailAddress.split('@')[0];
    }
    
    const userInfo = {
      userId: userData.userid ||  // <- Backend dùng userid (chữ thường)
              userData.userId || 
              userData.sub || 
              userData.id || 
              userData.nameid || 
              userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: emailAddress,
      fullname: fullname,
      role: userData.role || 
            userData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      roleId: userData.roleId || userData.roleid,
      exp: userData.exp // expiration time
    };
    
    localStorage.setItem('user', JSON.stringify(userInfo));
    
    console.log('=== LOGIN SUCCESS ===');
    console.log('User info saved:', userInfo);
    console.log('Full decoded token:', userData);
    console.log('All token keys:', Object.keys(userData));
    console.log('====================');

    return {
      success: true,
      token,
      user: userInfo,
    };
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error:', error);
    console.error('Error response:', error.response);
    console.error('===================');
    
    // Xác định message cụ thể dựa vào error
    let message = 'Đăng nhập thất bại. Vui lòng thử lại.';
    
    if (error.response) {
      // Server trả về response với error status
      const status = error.response.status;
      const data = error.response.data;
      
      // Ưu tiên message từ backend trước
      if (data?.message) {
        // Dịch và format message từ backend
        const backendMessage = data.message;
        if (backendMessage === 'Invalid credentials') {
          message = '🔒 Email hoặc mật khẩu không chính xác!';
        } else if (backendMessage.toLowerCase().includes('not found')) {
          message = '❌ Không tìm thấy tài khoản này!';
        } else if (backendMessage.toLowerCase().includes('email') && backendMessage.toLowerCase().includes('exist')) {
          message = '📧 Email đã tồn tại!';
        } else {
          // Dùng message từ backend nếu không match pattern nào
          message = `⚠️ ${backendMessage}`;
        }
      } else if (status === 401) {
        message = '🔒 Email hoặc mật khẩu không đúng!';
      } else if (status === 404) {
        message = '❌ Không tìm thấy tài khoản này!';
      } else if (status >= 500) {
        message = '🔧 Lỗi máy chủ. Vui lòng thử lại sau.';
      }
    } else if (error.request) {
      // Request được gửi nhưng không có response
      message = '🌐 Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng!';
    }
    
    return {
      success: false,
      message: message,
      error: error.response?.data
    };
  }
};

// Register
export const register = async (email, password, fullname, dateofbirth) => {
  try {
    const response = await api.post('/api/auth/register', {
      email,
      password,
      fullname,
      dateofbirth, // Format: "YYYY-MM-DD" hoặc null
    });

    return {
      success: true,
      message: response.data.message || 'Registration successful!',
    };
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed. Please try again.',
    };
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Immediate redirect without delay
  window.location.href = '/login';
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    
    // Kiểm tra token còn hạn không
    if (user.exp) {
      const currentTime = Date.now() / 1000;
      if (user.exp < currentTime) {
        // Token hết hạn, clear localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    }
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Decode token để check expiration
    const decoded = decodeToken(token);
    if (!decoded) return false;

    // Kiểm tra token có exp claim không
    if (!decoded.exp) {
      console.warn('Token does not have expiration claim');
      return true; // Nếu không có exp thì coi như valid (tùy logic BE)
    }

    // Check token expiration
    const currentTime = Date.now() / 1000;
    const isValid = decoded.exp > currentTime;
    
    if (!isValid) {
      console.log('Token expired, clearing localStorage');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    return isValid;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Refresh user info from token (useful sau khi reload page)
export const refreshUserFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const userData = decodeToken(token);
    if (!userData) return null;

    // Extract fullname with multiple fallbacks
    let fullname = userData.fullName ||  // <- Backend dùng fullName (N viết hoa)
                   userData.fullname || 
                   userData.name || 
                   userData.FullName ||
                   userData.full_name ||
                   userData.given_name ||
                   userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
                   userData['unique_name'] ||
                   userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
    
    // Nếu vẫn không có fullname, thử extract từ email
    const emailAddress = userData.email || 
                        userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
    
    if (!fullname && emailAddress) {
      fullname = emailAddress.split('@')[0];
    }

    const userInfo = {
      userId: userData.userid ||  // <- Backend dùng userid (chữ thường)
              userData.userId || 
              userData.sub || 
              userData.id || 
              userData.nameid || 
              userData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
      email: emailAddress,
      fullname: fullname,
      role: userData.role || 
            userData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      roleId: userData.roleId || userData.roleid,
      exp: userData.exp
    };

    localStorage.setItem('user', JSON.stringify(userInfo));
    return userInfo;
  } catch (error) {
    console.error('Error refreshing user from token:', error);
    return null;
  }
};
