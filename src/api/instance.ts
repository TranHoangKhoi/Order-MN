import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Alert } from 'react-native';
import { appConfigs } from '~/configs';

const apiConfig = {
  baseUrl: `${appConfigs.API_URL}/api`,
};

const instance = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: { Accept: 'application/json' },
});

export const setToken = (token: string) => {
  instance.defaults.headers.common.Authorization = 'Bearer ' + token;
};

const getUrl = (config: any) => {
  if (config?.baseURL) {
    return config?.url.replace(config?.baseURL, '');
  }
  return config?.url;
};

// Intercept all request
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log(
      `%c ${config?.method?.toUpperCase()} - ${getUrl(config)}:`,
      'color: #0086b3; font-weight: bold',
      config,
    );
    return config;
  },
  (error: any) => {
    console.log(
      `%c ${error?.response?.status}  :`,
      'color: red; font-weight: bold',
      error?.response?.data,
    );
    return Promise.reject(error);
  },
);

// Intercept all responses
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `%c ${response?.status} - ${getUrl(response?.config)}:`,
      'color: #008000; font-weight: bold',
      response,
    );
    if (response?.data?.Code === '101') {
      return Promise.reject(response?.data);
    }

    return response;
  },
  (error: any) => {
    // Error ...
    if (error?.response) {
      console.log('LỖI PHÍA SERVER');

      if (error?.response?.status === 408) {
        // logout()
      }
      if (error?.response?.status === 401) {
        // logout()
      }
    } else if (error?.request) {
      console.log('errrrrrr: ', error);
      if (error.message === 'Network Error') {
        Alert.alert('Lỗi mạng!', 'Vui lòng kiểm tra kết nối mạng')
      }
      console.log('LỖI REQUEST');
    } else {
      console.log('LỖI KHÔNG XÁC ĐỊNH');
    }

    console.error(
      `%c ${error?.response?.status} - ${getUrl(error?.response?.config)}:`,
      'color: #a71d5d; font-weight: bold',
      error?.response,
    );
    return Promise.reject(error?.response?.data || error?.response);
  },
);

export default instance;
