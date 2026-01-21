import axios from 'axios';

const useApi = () => {
  const token = localStorage.getItem('token');

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });

  return api;
};

export default useApi;