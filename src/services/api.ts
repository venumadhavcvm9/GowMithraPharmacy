// Basic fetch wrapper for API calls
const API_URL = "http://localhost:5000/api";

export const api = {
  get: async (endpoint: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const userStr = localStorage.getItem('rx_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.shop_id || user.id) {
          headers["X-Shop-Id"] = user.shop_id ? String(user.shop_id) : String(user.id);
        }
      } catch (e) {}
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers,
      credentials: "include",
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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const userStr = localStorage.getItem('rx_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.shop_id || user.id) {
          headers["X-Shop-Id"] = user.shop_id ? String(user.shop_id) : String(user.id);
        }
      } catch (e) {}
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
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
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const userStr = localStorage.getItem('rx_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.shop_id || user.id) {
          headers["X-Shop-Id"] = user.shop_id ? String(user.shop_id) : String(user.id);
        }
      } catch (e) {}
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
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
