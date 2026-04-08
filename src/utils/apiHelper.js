import axios from 'axios';

const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('adminToken') || localStorage.getItem('akupy_token');

  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': isMultipart 
      ? 'multipart/form-data'
      : 'application/json'
  };
};

export const apiGet = (url) => 
  axios.get(url, { headers: getHeaders() });

export const apiPost = (url, data, isMultipart = false) => 
  axios.post(url, data, { headers: getHeaders(isMultipart) });

export const apiPut = (url, data, isMultipart = false) => 
  axios.put(url, data, { headers: getHeaders(isMultipart) });

export const apiDelete = (url) => 
  axios.delete(url, { headers: getHeaders() });

const apiHelper = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete
};

export default apiHelper;
