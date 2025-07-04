import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Agrega el token en cada petición
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// En tu archivo axiosInstance.js
function decodeTexto(texto) {
  try {
    return typeof texto === 'string' ? decodeURIComponent(escape(texto)) : texto;
  } catch {
    return texto;
  }
}

function decodeObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(decodeObject);
  } else if (obj && typeof obj === 'object') {
    const res = {};
    for (const key in obj) {
      res[key] = decodeObject(obj[key]);
    }
    return res;
  } else {
    return decodeTexto(obj);
  }
}

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = decodeObject(response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;