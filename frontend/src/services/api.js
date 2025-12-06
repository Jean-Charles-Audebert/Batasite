const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  // Clients
  getClients: async () => {
    const response = await fetch(`${API_BASE_URL}/clients`);
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },

  getClient: async (identifier) => {
    const response = await fetch(`${API_BASE_URL}/clients/${identifier}`);
    if (!response.ok) throw new Error('Failed to fetch client');
    return response.json();
  },

  createClient: async (clientData) => {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });
    if (!response.ok) throw new Error('Failed to create client');
    return response.json();
  },

  // Content
  getContentByClient: async (clientId) => {
    const response = await fetch(`${API_BASE_URL}/content/client/${clientId}`);
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
  },

  getContent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/content/${id}`);
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
  },

  createContent: async (contentData) => {
    const response = await fetch(`${API_BASE_URL}/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData),
    });
    if (!response.ok) throw new Error('Failed to create content');
    return response.json();
  },
};
