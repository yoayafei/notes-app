import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
  return axiosInstance.post('/users/register', userData);
};

export const loginUser = async (userData) => {
  return axiosInstance.post('/users/login', userData);
};

export const getUser = async (userId) => {
  return axiosInstance.get(`/users/${userId}`);
};

export const updateUserInfo = async (userId, userData) => {
  return axiosInstance.put(`/users/${userId}`, userData);
};

export const uploadAvatar = async (userId, formData) => {
  return axiosInstance.post(`/users/${userId}/avatar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const logout = async () => {
  try {
    await axiosInstance.post('/users/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

export default {
  registerUser,
  loginUser,
  getUser,
  updateUserInfo,
  uploadAvatar,
  logout,
};
