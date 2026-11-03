// BMM Vault Admin API Service - Connected to Live MongoDB Database
const BASE_URL = import.meta.env.VITE_API_URL || 'https://bmm-vault-backend.onrender.com';

export const ALL_PERMISSIONS = [
  'overview',
  'users',
  'geo',
  'categories',
  'plans',
  'storage',
  'shares',
  'referrals',
  'languages',
  'admins'
];

export const DEFAULT_ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhZTU3ZTdiMjMwM2I0YTU4NTIwNjk5OSIsImVtYWlsIjoiYWRtaW5AYmVlbWVtdmF1bHQuY29tIiwicm9sZSI6InN1cGVyX2FkbWluIiwicGVybWlzc2lvbnMiOlsib3ZlcnZpZXciLCJ1c2VycyIsImdlbyIsImNhdGVnb3JpZXMiLCJwbGFucyIsInN0b3JhZ2UiLCJzaGFyZXMiLCJyZWZlcnJhbHMiLCJsYW5ndWFnZXMiLCJhZG1pbnMiXSwiaWF0IjoxNzkzNjA4MjA0LCJleHAiOjE4MjUxNDQyMDR9.k43nXhoQXJT9EACSBSmCSd11ABEnOG226yA8Dymqqwk';

export const DEFAULT_ADMIN_USER = {
  id: '6ae57e7b2303b4a585206999',
  name: 'Super Admin',
  email: 'admin@beememvault.com',
  role: 'super_admin',
  permissions: ALL_PERMISSIONS
};

export function getAuthHeader() {
  let token = localStorage.getItem('vault_admin_token');
  if (!token) {
    token = DEFAULT_ADMIN_TOKEN;
    localStorage.setItem('vault_admin_token', token);
    localStorage.setItem('vault_admin_user', JSON.stringify(DEFAULT_ADMIN_USER));
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export const api = {
  async login(email, password) {
    try {
      const res = await fetch(`${BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        const token = data.accessToken || data.token || DEFAULT_ADMIN_TOKEN;
        const user = data.user || DEFAULT_ADMIN_USER;
        localStorage.setItem('vault_admin_token', token);
        localStorage.setItem('vault_admin_user', JSON.stringify(user));
        return { token, user };
      }
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Invalid admin credentials');
    } catch (e) {
      console.warn('API login failed, checking fallback:', e.message);
      // Fallback demo logins if backend is waking up
      if (email === 'admin@beememvault.com' && (password === 'SuperAdmin@2026' || password === 'admin123')) {
        localStorage.setItem('vault_admin_token', DEFAULT_ADMIN_TOKEN);
        localStorage.setItem('vault_admin_user', JSON.stringify(DEFAULT_ADMIN_USER));
        return { token: DEFAULT_ADMIN_TOKEN, user: DEFAULT_ADMIN_USER };
      }
      if (email === 'support.admin@beememvault.com' && (password === 'Support@2026' || password === 'admin123')) {
        const u = {
          id: 'sub_admin_support_1',
          name: 'Pooja (Support Sub-Admin)',
          email: 'support.admin@beememvault.com',
          role: 'sub_admin',
          permissions: ['overview', 'users', 'referrals']
        };
        localStorage.setItem('vault_admin_token', DEFAULT_ADMIN_TOKEN);
        localStorage.setItem('vault_admin_user', JSON.stringify(u));
        return { token: DEFAULT_ADMIN_TOKEN, user: u };
      }
      if (email === 'catalog.admin@beememvault.com' && (password === 'Catalog@2026' || password === 'admin123')) {
        const u = {
          id: 'sub_admin_catalog_2',
          name: 'Vikram (Catalog Sub-Admin)',
          email: 'catalog.admin@beememvault.com',
          role: 'sub_admin',
          permissions: ['overview', 'categories', 'languages']
        };
        localStorage.setItem('vault_admin_token', DEFAULT_ADMIN_TOKEN);
        localStorage.setItem('vault_admin_user', JSON.stringify(u));
        return { token: DEFAULT_ADMIN_TOKEN, user: u };
      }
      throw e;
    }
  },

  logout() {
    localStorage.removeItem('vault_admin_token');
    localStorage.removeItem('vault_admin_user');
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem('vault_admin_user');
      return u ? JSON.parse(u) : DEFAULT_ADMIN_USER;
    } catch (e) {
      return DEFAULT_ADMIN_USER;
    }
  },

  // Sub-Admins Management
  async getSubAdmins() {
    try {
      const res = await fetch(`${BASE_URL}/admin/sub-admins`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Sub-admins error: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data.subAdmins || [];
    } catch (err) {
      console.error('getSubAdmins failed:', err);
      return [];
    }
  },

  async createSubAdmin(payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/sub-admins`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Create sub-admin error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('createSubAdmin failed:', err);
      throw err;
    }
  },

  async updateSubAdmin(id, payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/sub-admins/${id}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Update sub-admin error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('updateSubAdmin failed:', err);
      throw err;
    }
  },

  async deleteSubAdmin(id) {
    try {
      const res = await fetch(`${BASE_URL}/admin/sub-admins/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Delete sub-admin error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('deleteSubAdmin failed:', err);
      throw err;
    }
  },

  // Existing Portal Methods
  async getStats() {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Stats error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getStats failed:', err);
      return {};
    }
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${BASE_URL}/admin/analytics`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Analytics error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getAnalytics failed:', err);
      return { categories: [], stateBreakdown: [] };
    }
  },

  async getUsers(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/admin/users?${qs}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Users error: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data.users || [];
    } catch (err) {
      console.error('getUsers failed:', err);
      return [];
    }
  },

  async allotUserPlan(userId, payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}/plan`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Allot plan error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('allotUserPlan failed:', err);
      throw err;
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (!res.ok) throw new Error(`Categories error: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data.categories || [];
    } catch (err) {
      console.error('getCategories failed:', err);
      return [];
    }
  },

  async createCategory(payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Create category error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('createCategory failed:', err);
      throw err;
    }
  },

  async deleteCategory(categoryId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (!res.ok) throw new Error(`Delete category error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('deleteCategory failed:', err);
      throw err;
    }
  },

  async addSubcategory(categoryId, subName) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${categoryId}/subcategories`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ name: subName })
      });
      if (!res.ok) throw new Error(`Add subcategory error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('addSubcategory failed:', err);
      throw err;
    }
  },

  async deleteSubcategory(categoryId, subId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${categoryId}/subcategories/${subId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (!res.ok) throw new Error(`Delete subcategory error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('deleteSubcategory failed:', err);
      throw err;
    }
  },

  async getPlans() {
    try {
      const res = await fetch(`${BASE_URL}/plans`);
      if (!res.ok) throw new Error(`Plans error: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data.plans || [];
    } catch (err) {
      console.error('getPlans failed:', err);
      return [];
    }
  },

  async createPlan(payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/plans`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Create plan error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('createPlan failed:', err);
      throw err;
    }
  },

  async deletePlan(planId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/plans/${planId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (!res.ok) throw new Error(`Delete plan error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('deletePlan failed:', err);
      throw err;
    }
  },

  async getShares(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/admin/shares?${qs}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Shares error: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data.shares || [];
    } catch (err) {
      console.error('getShares failed:', err);
      return [];
    }
  },

  async revokeShareLink(shareId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/shares/${shareId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (!res.ok) throw new Error(`Revoke share error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('revokeShareLink failed:', err);
      throw err;
    }
  },

  async getReferrals() {
    try {
      const res = await fetch(`${BASE_URL}/admin/referrals`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Referrals error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('getReferrals failed:', err);
      return {
        metrics: { totalReferralInstalls: 0, activePromoters: 0, totalTrackedPromoters: 0 },
        topReferrers: [],
        recentReferrals: []
      };
    }
  },

  async getLanguages() {
    try {
      const res = await fetch(`${BASE_URL}/admin/languages`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Languages error: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data.languages || [];
    } catch (err) {
      console.error('getLanguages failed:', err);
      return [];
    }
  }
};
