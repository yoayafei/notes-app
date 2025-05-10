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
  logout,
};
