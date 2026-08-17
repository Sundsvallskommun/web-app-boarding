import axios from 'axios';
import Router from 'next/router';
import { apiURL } from '@utils/api-url';

export interface ApiResponse<T> {
  data: T;
  status?: number;
  message: string;
}

export const handleError = (error: any) => {
  if (error?.response?.status === 401 && !Router.pathname.includes('login')) {
    Router.push(
      {
        pathname: `/login?path=${window.location.pathname}`,
        query: {
          path: window.location.pathname,
          failMessage: error,
        },
      },
      `/login?path=${window.location.pathname}`
    );
  }

  throw error;
};

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

const get = <T>(url: string, options?: { [key: string]: any }) =>
  axios.get<T>(apiURL(url), { ...defaultOptions, ...options }).catch(handleError);

const post = <T>(url: string, data: any, options?: { [key: string]: any }) => {
  return axios.post<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

const remove = <T>(url: string, options?: { [key: string]: any }) => {
  return axios.delete<T>(apiURL(url), { ...defaultOptions, ...options }).catch(handleError);
};

const patch = <T>(url: string, data: any, options?: { [key: string]: any }) => {
  return axios.patch<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

const put = <T>(url: string, data: any, options?: { [key: string]: any }) => {
  return axios.put<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

export const apiService = { get, post, put, patch, delete: remove };
