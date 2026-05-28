export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class APIClient {
  private async request<T>(path: string, options?: RequestInit): Promise<APIResponse<T>> {
    try {
      const response = await fetch(path, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.error || `HTTP request failed with status: ${response.status}`,
        };
      }

      const result = await response.json();
      return result as APIResponse<T>;
    } catch (error) {
      console.error(`API Client Error [${path}]:`, error);
      return {
        success: false,
        error: 'Network connection failed. Please check your internet connectivity.',
      };
    }
  }

  async get<T>(path: string, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, data: any, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(path: string, data: any, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(path: string, options?: RequestInit): Promise<APIResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
export default apiClient;
