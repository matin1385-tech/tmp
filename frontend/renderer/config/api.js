// Base URL of the fake FastAPI backend (see runner.py).
// Override with NEXT_PUBLIC_API_BASE_URL if the backend runs somewhere else.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:5000';

export const API = {
  // ONE endpoint for input: 4 files + settings (7 tabs / 8 parameter
  // groups) + range, all in one multipart request. See runner.py.
  process: `${API_BASE_URL}/api/process`,
  status: (jobId) => `${API_BASE_URL}/api/status/${jobId}`,
  results: (jobId) => `${API_BASE_URL}/api/results/${jobId}`,
  download: (jobId) => `${API_BASE_URL}/api/download/${jobId}`,
  saveLocal: (jobId) => `${API_BASE_URL}/api/save_local/${jobId}`,
  
  // Settings endpoints - get default settings and save new settings
  settings: `${API_BASE_URL}/api/settings`,
};
