'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { useAuthStore } from '@/lib/stores/auth-store';

// Enhanced error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class ApiException extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: any;

  constructor(message: string, code?: string, status?: number, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// Enhanced API client with better error handling
export class ApiClient {
  private client = axios.create({
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor(baseURL: string) {
    this.client.defaults.baseURL = baseURL;
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const { session } = useAuthStore.getState();
        
        if (session.accessToken && !config.url?.includes('/login')) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        
        return config;
      },
      (error) => Promise.reject(this.handleError(error))
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => Promise.reject(this.handleError(error))
    );
  }

  private handleError(error: AxiosError): ApiException {
    const { response } = error;
    
    if (response) {
      const message = (response.data as any)?.message || response.statusText || 'Request failed';
      const code = (response.data as any)?.code || `HTTP_${response.status}`;
      
      return new ApiException(message, code, response.status, response.data);
    }
    
    if (error.code === 'ECONNABORTED') {
      return new ApiException('Request timeout', 'TIMEOUT', 408);
    }
    
    return new ApiException(error.message || 'Network error', 'NETWORK_ERROR');
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Create API clients
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? 'http://localhost:3001';
const FOUNDATION_BASE_URL = process.env.NEXT_PUBLIC_FOUNDATION_BASE_URL ?? 'http://localhost:3010';

export const authApi = new ApiClient(`${AUTH_BASE_URL}/api/v1/auth`);
export const foundationApi = new ApiClient(FOUNDATION_BASE_URL);

// Utility function for handling API errors in components
export function handleApiError(error: unknown): string {
  if (error instanceof ApiException) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
