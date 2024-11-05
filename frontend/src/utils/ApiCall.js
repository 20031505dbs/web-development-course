import axios from "axios";
import nProgress from "nprogress";
import ExceptionHandler from "./ExceptionHandler";
const API_URL = import.meta.env.VITE_APP_API_URL;

// Create an Axios instance with default configuration

const apiInstance = axios.create({
  baseURL: API_URL,
});

// Interceptor for request
apiInstance.interceptors.request.use((config) => {
  nProgress.start();
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
});

// Interceptor for response
apiInstance.interceptors.response.use(
  (response) => {
    nProgress.done();

    return response;
  },
  (error) => {
    nProgress.done();
    ExceptionHandler(error);

    return Promise.reject(error);
  }
);

export async function ApiCall(
  endpoint,
  method = "GET",
  payload = null,
  params = {}
) {
  try {
    const response = await apiInstance({
      url: endpoint,
      method,
      data: payload,
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled by the caller if needed
  }
}
