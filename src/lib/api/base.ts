import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError, RequestOptions, ApiResponse } from './types';

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    this.client = axios.create({
      baseURL,
      headers: this.defaultHeaders,
      timeout: 30000, // 30 seconds
      withCredentials: true, // Send cookies with requests
    });

    // Request interceptor
    this.client.interceptors.request.use(
      this.handleRequest,
      this.handleError
    );

    // Response interceptor
    this.client.interceptors.response.use(
      this.handleResponse,
      this.handleError
    );
  }

  private handleRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp
    config.headers['X-Request-Timestamp'] = Date.now().toString();

    return config;
  };

  private handleResponse = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
    // Handle successful responses
    return response.data.data;
  };

  protected handleError = (error: any): Promise<never> => {
    if (axios.isAxiosError(error)) {
      const { response, request, message } = error;
      
      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { status, data } = response;
        const errorMessage = data?.error?.message || message || 'An error occurred';
        return Promise.reject(new ApiError(errorMessage, status, data));
      } else if (request) {
        // The request was made but no response was received
        return Promise.reject(new ApiError('No response from server', 0));
      }
    }
    
    // Something happened in setting up the request that triggered an Error
    return Promise.reject(new ApiError(error.message || 'An unknown error occurred', 0));
  };

  public async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers } = options;
    const response = await this.client.get<T>(url, { params, headers });
    return response as unknown as T; // Type assertion because of interceptor
  }

  public async post<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const { params, headers } = options;
    const response = await this.client.post<T>(url, data, { params, headers });
    return response as unknown as T;
  }

  public async put<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const { params, headers } = options;
    const response = await this.client.put<T>(url, data, { params, headers });
    return response as unknown as T;
  }

  public async patch<T>(url: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const { params, headers } = options;
    const response = await this.client.patch<T>(url, data, { params, headers });
    return response as unknown as T;
  }

  public async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers } = options;
    const response = await this.client.delete<T>(url, { params, headers });
    return response as unknown as T;
  }

  // Helper method to add auth token to requests
  public setAuthToken(token: string | null): void {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }
}

export default ApiClient;
