// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1/pms';

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : '';
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint;
    
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints
export const api = {
  // Patients
  patients: {
    getAll: (params?: any) => apiClient.get('/patients', params),
    getById: (id: string) => apiClient.get(`/patients/${id}`),
    create: (data: any) => apiClient.post('/patients', data),
    update: (id: string, data: any) => apiClient.put(`/patients/${id}`, data),
    delete: (id: string) => apiClient.delete(`/patients/${id}`),
  },

  // Appointments
  appointments: {
    getAll: (params?: any) => apiClient.get('/appointments', params),
    getById: (id: string) => apiClient.get(`/appointments/${id}`),
    create: (data: any) => apiClient.post('/appointments', data),
    update: (id: string, data: any) => apiClient.put(`/appointments/${id}`, data),
    delete: (id: string) => apiClient.delete(`/appointments/${id}`),
  },

  // Claims
  claims: {
    getAll: (params?: any) => apiClient.get('/claims', params),
    getById: (id: string) => apiClient.get(`/claims/${id}`),
    create: (data: any) => apiClient.post('/claims', data),
    update: (id: string, data: any) => apiClient.put(`/claims/${id}`, data),
    delete: (id: string) => apiClient.delete(`/claims/${id}`),
  },

  // Dashboard
  dashboard: {
    getKPIs: () => apiClient.get('/dashboard/kpis'),
    getStats: () => apiClient.get('/dashboard/stats'),
  },

  // Auth
  auth: {
    login: (credentials: any) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    refresh: () => apiClient.post('/auth/refresh'),
    profile: () => apiClient.get('/auth/profile'),
  },
};

// Export the base URL for reference
export { API_BASE_URL };
