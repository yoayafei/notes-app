import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://8.136.110.222:3000/api', // 后端 API 的基础 URL
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // 如果需要跨域请求，确保携带 cookie
});

export default axiosInstance;
