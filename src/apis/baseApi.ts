import axios from 'axios';
import env from '@/lib/env';

let refreshingToken = false;

const baseApi = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${env.VITE_AUTHORIZATION_TOKEN}`,
  },
});

baseApi.interceptors.request.use(
  (request) => {
    const accessToken = JSON.parse(localStorage.getItem('currentUser') || '{}').accessToken || '';
    const currentUserId = JSON.parse(localStorage.getItem('currentUser') || '{}').id || '';
    request.headers.accessToken = accessToken;
    request.params = {
      ...request.params,
      currentUserId,
    };
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
  async (error) => {
    if (refreshingToken) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (
      error.response?.status === 401 ||
      error.response?.data?.message === 'Token expired or invalid'
    ) {
      const accessToken = JSON.parse(localStorage.getItem('currentUser') || '{}').accessToken || '';
      if (!accessToken) {
        return Promise.reject(error);
      }

      refreshingToken = true;
      try {
        const { data } = await axios.post(
          env.VITE_API_URL + '/auth/renew-session',
          {},
          {
            headers: {
              Authorization: `Bearer ${env.VITE_AUTHORIZATION_TOKEN}`,
              accessToken: `Bearer ${accessToken}`,
            },
          },
        );
        localStorage.setItem('currentUser', JSON.stringify(data.data.user));
        localStorage.setItem('isAuthenticated', JSON.stringify(true));

        // Update the original request with the new token
        const newAccessToken = data.data.accessToken;
        originalRequest.headers.accessToken = newAccessToken;

        // Retry the original request with the new token
        return baseApi(originalRequest);
      } catch (error) {
        console.log('error', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isAuthenticated');
        window.location.reload();
      } finally {
        refreshingToken = false;
      }
    }

    return Promise.reject(error);
  },
);

export default baseApi;
