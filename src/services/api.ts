// Basic fetch wrapper for API calls
const API_URL = "http://localhost:5000/api";

export const api = {
  get: async (endpoint: string) => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers,
    });
    
    if (!response.ok) {
      let errMsg = response.statusText;
      try {
        const errJson = await response.json();
        if (errJson.message) errMsg = errJson.message;
      } catch (e) {}
      throw new Error(`API Error: ${errMsg}`);
    }
    return response.json();
  },

  post: async (endpoint: string, body: any) => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errMsg = response.statusText;
      try {
        const errJson = await response.json();
        if (errJson.errorDetail) {
          errMsg = errJson.errorDetail;
        } else if (errJson.message) {
          errMsg = errJson.message;
        }
      } catch (e) {}
      throw new Error(errMsg);
    }
    return response.json();
  },

  put: async (endpoint: string, body: any) => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errMsg = response.statusText;
      try {
        const errJson = await response.json();
        if (errJson.message) errMsg = errJson.message;
      } catch (e) {}
      throw new Error(`API Error: ${errMsg}`);
    }
    return response.json();
  }
};
