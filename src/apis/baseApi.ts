import axios from 'axios';
import env from '@/lib/env';

const accessToken = JSON.parse(localStorage.getItem('currentUser') || '{}').accessToken || '';

const baseApi = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${env.VITE_AUTHORIZATION_TOKEN}`,
  },
});

baseApi.interceptors.request.use(
  (request) => {
    request.headers.accessToken = accessToken;
    return request;
  },
  (error) => {
    // request.config
    return Promise.reject(error);
  },
);

baseApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('Token expired or invalid');
    }
    return Promise.reject(error);
  },
);

export default baseApi;
