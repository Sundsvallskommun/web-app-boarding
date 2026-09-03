import axios from 'axios';
import { apiURL } from '@utils/api-url';

export interface ApiResponse<T> {
  data: T;
  status?: number;
  message: string;
}

let navigate: ((path: string) => void) | null = null;

export const registerNavigator = (fn: (path: string) => void) => {
  navigate = fn;
};

export const handleError = (error: any) => {
  if (typeof window === 'undefined') {
    throw error;
  }
  const currentPath = window.location.pathname;
  if (error?.response?.status === 401 && !currentPath.includes('login')) {
    navigate?.(`/login?path=${encodeURIComponent(currentPath)}&failMessage=${encodeURIComponent(String(error))}`);
  }
  throw error;
};

const defaultOptions = {
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
};

const get = <T>(url: string, options?: { [key: string]: any }) =>
  axios.get<T>(apiURL(url), { ...defaultOptions, ...options }).catch(handleError);

const post = <T>(url: string, data: any, options?: { [key: string]: any }) =>
  axios.post<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);

const remove = <T>(url: string, options?: { [key: string]: any }) =>
  axios.delete<T>(apiURL(url), { ...defaultOptions, ...options }).catch(handleError);

const patch = <T>(url: string, data: any, options?: { [key: string]: any }) =>
  axios.patch<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);

const put = <T>(url: string, data: any, options?: { [key: string]: any }) =>
  axios.put<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);

export const apiService = { get, post, put, patch, delete: remove };
