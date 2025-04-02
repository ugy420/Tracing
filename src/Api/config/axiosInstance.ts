import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:3000/api',
  timeout: 1000 * 60 * 5,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default axiosInstance;
