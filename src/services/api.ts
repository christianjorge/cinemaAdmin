import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { toast } from 'react-hot-toast';

export const api = axios.create({
  ...API_CONFIG,
  // Adiciona retry
  retry: 3, //Quantidade de vezes que o retry será executado
  retryDelay: (retryCount) => retryCount * 1000, // espera 1s, 2s, 3s
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinema:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403) {
      toast.error('Acesso negado');
    } else if (error.response?.status === 404) {
      //toast.error('Recurso não encontrado');
    } else if (error.response?.status === 500) {
      toast.error('Erro interno do servidor');
    } else if (!error.response) {
      toast.error('Erro de conexão com o servidor');
    }
    return Promise.reject(error);
  }
);

// Adiciona lógica de retry
api.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) return Promise.reject(err);
  
  config.retryCount = config.retryCount || 0;
  
  if (config.retryCount >= config.retry) {
    return Promise.reject(err);
  }
  
  config.retryCount += 1;
  const delayRetry = new Promise(resolve => {
    setTimeout(resolve, config.retryDelay(config.retryCount));
  });
  
  await delayRetry;
  return api(config);
});