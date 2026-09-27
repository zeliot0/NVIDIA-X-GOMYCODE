import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
});

export const checkHealth = async () => {
  const response = await client.get('/health');
  return response.data;
};

export const analyzeText = async (text) => {
  const response = await client.post('/analysis/text', { text });
  return response.data;
};

export const analyzeUrl = async (url) => {
  const response = await client.post('/analysis/url', { url });
  return response.data;
};

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post('/analysis/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const analyzeVoice = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post('/analysis/voice', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const analyzeDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post('/analysis/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const sendChatMessage = async (message, history = []) => {
  const response = await client.post('/chat', { message, history });
  return response.data;
};

export const getHistory = async () => {
  const response = await client.get('/reports');
  return response.data;
};

export const getReport = async (reportId) => {
  const response = await client.get(`/reports/${reportId}`);
  return response.data;
};

export const deleteReport = async (reportId) => {
  const response = await client.delete(`/reports/${reportId}`);
  return response.data;
};

// Advanced Power Tools
export const auditPassword = async (password) => {
  const response = await client.post('/tools/password-audit', { password });
  return response.data;
};

export const inspectEmailHeader = async (raw_headers) => {
  const response = await client.post('/tools/email-header', { raw_headers });
  return response.data;
};

export const scanQrCode = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post('/tools/qr-scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getThreatRadar = async () => {
  const response = await client.get('/tools/threat-radar');
  return response.data;
};

export default {
  checkHealth,
  analyzeText,
  analyzeUrl,
  analyzeImage,
  analyzeVoice,
  analyzeDocument,
  sendChatMessage,
  getHistory,
  getReport,
  deleteReport,
  auditPassword,
  inspectEmailHeader,
  scanQrCode,
  getThreatRadar,
};
