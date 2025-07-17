class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

class ApiClient {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      let data = null;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Ignore JSON parse error
      }
      if (!response.ok) {
        throw new ApiError(
          data?.error || `HTTP ${response.status}`,
          response.status,
          data
        );
      }
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, { originalError: error });
    }
  }

  // Prompt API methods
  async getPrompts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/api/prompts${queryString ? `?${queryString}` : ''}`;
    return this.request(endpoint);
  }

  async createPrompt(promptData) {
    return this.request('/api/prompts', {
      method: 'POST',
      body: promptData,
    });
  }

  async updatePrompt(id, promptData) {
    return this.request(`/api/prompts/${id}`, {
      method: 'POST',
      body: promptData,
    });
  }

  async deletePrompt(id) {
    return this.request(`/api/prompts/${id}`, {
      method: 'DELETE',
    });
  }

  async sharePrompt(id) {
    return this.request(`/api/prompts/share/${id}`, {
      method: 'POST',
    });
  }

  async copyPrompt(promptData) {
    return this.request('/api/prompts/copy', {
      method: 'POST',
      body: { promptData },
    });
  }

  // Tags API methods
  async getTags() {
    return this.request('/api/tags');
  }

  async createTag(tagData) {
    return this.request('/api/tags', {
      method: 'POST',
      body: tagData,
    });
  }

  async updateTag(id, tagData) {
    return this.request(`/api/tags?id=${id}`, {
      method: 'PATCH',
      body: tagData,
    });
  }

  async deleteTag(id) {
    return this.request(`/api/tags?id=${id}`, {
      method: 'DELETE',
    });
  }

  // Chat API methods (for streaming responses)
  async chat(messages, options = {}) {
    const url = `${this.baseURL}/api/chat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, ...options }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(
        data.error || `HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return response; // Return the response for streaming
  }

  // Generate API methods (for streaming responses)
  async generate(text) {
    const url = `${this.baseURL}/api/generate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new ApiError(
        data.error || `HTTP ${response.status}`,
        response.status,
        data
      );
    }

    return response; // Return the response for streaming
  }
}

// 创建单例实例
export const apiClient = new ApiClient();
export { ApiError };

// Hook for API operations with React Query style
export function useApiRequest() {
  return {
    apiClient,
    ApiError,
  };
} 