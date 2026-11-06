// BMM Vault Admin API Service - Connected to Live MongoDB Database
const BASE_URL = import.meta.env.VITE_API_URL || "https://bmm-vault-backend.onrender.com";

export const ALL_PERMISSIONS = [
  "overview",
  "revenue",
  "users",
  "geo",
  "categories",
  "plans",
  "storage",
  "shares",
  "referrals",
  "languages",
  "admins"
];

export function getAuthHeader() {
  const token = localStorage.getItem("vault_admin_token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both Login ID and Password.");
    }

    try {
      const res = await fetch(`${BASE_URL}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.accessToken || data.token;
        const user = data.user;
        if (token && user) {
          localStorage.setItem("vault_admin_token", token);
          localStorage.setItem("vault_admin_user", JSON.stringify(user));
          return { token, user };
        }
      }

      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Invalid Login ID or Password.");
    } catch (e) {
      console.warn("Auth request failed:", e.message);
      throw e;
    }
  },

  logout() {
    localStorage.removeItem("vault_admin_token");
    localStorage.removeItem("vault_admin_user");
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem("vault_admin_user");
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  // Sub-Admins Management (Super Admin Only)
  async getSubAdmins() {
    try {
      const res = await fetch(`${BASE_URL}/admin/sub-admins`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Sub-admins error: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : data.subAdmins || [];
    } catch (err) {
      console.error("getSubAdmins failed:", err);
      return [];
    }
  },

  async createSubAdmin(payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/sub-admins`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Create sub-admin error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("createSubAdmin failed:", err);
      throw err;
    }
  },

  async updateSubAdmin(id, payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/sub-admins/${id}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Update sub-admin error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("updateSubAdmin failed:", err);
      throw err;
    }
  },

  async deleteSubAdmin(id) {
    try {
      const res = await fetch(`${BASE_URL}/admin/sub-admins/${id}`, {
        method: "DELETE",
        headers: getAuthHeader()
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Delete sub-admin error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("deleteSubAdmin failed:", err);
      throw err;
    }
  },

  // Revenue Intelligence & Plan Ledger
  async getRevenue() {
    try {
      const res = await fetch(`${BASE_URL}/admin/revenue`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Revenue error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("getRevenue failed:", err);
      return {
        summary: { totalRevenue: 0, pendingRevenue: 0, grossRevenue: 0, totalTransactions: 0, activeSubscribers: 0, totalUsers: 0, currency: "INR" },
        planWiseRevenue: []
      };
    }
  },

  async getPlanPurchasers(planId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/revenue/plans/${planId}/users`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Plan purchasers error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("getPlanPurchasers failed:", err);
      return { planId, count: 0, purchasers: [] };
    }
  },

  // Existing Portal Methods
  async getStats() {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Stats error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("getStats failed:", err);
      return {};
    }
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${BASE_URL}/admin/analytics`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Analytics error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("getAnalytics failed:", err);
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
      console.error("getUsers failed:", err);
      return [];
    }
  },

  async allotUserPlan(userId, payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}/plan`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Allot plan error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("allotUserPlan failed:", err);
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
      console.error("getCategories failed:", err);
      return [];
    }
  },

  async createCategory(payload) {
    try {
      const cleanPayload = { ...payload };
      if (typeof cleanPayload.name === "string") {
        const n = cleanPayload.name.trim();
        cleanPayload.name = { en: n, hi: "" };
        if (!cleanPayload.id) {
          cleanPayload.id = n.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/^_+|_+$/g, "");
        }
      }
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(cleanPayload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Create category error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("createCategory failed:", err);
      throw err;
    }
  },

  async updateCategory(categoryId, payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${categoryId}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Update category error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("updateCategory failed:", err);
      throw err;
    }
  },

  async deleteCategory(categoryId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${categoryId}`, {
        method: "DELETE",
        headers: getAuthHeader()
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Delete category error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("deleteCategory failed:", err);
      throw err;
    }
  },

  async addSubcategory(categoryId, subName) {
    try {
      const sName = typeof subName === "string" ? subName.trim() : (subName?.name || "");
      const sId = sName.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/^_+|_+$/g, "") || `sub_${Date.now()}`;
      const res = await fetch(`${BASE_URL}/admin/categories/${categoryId}/subcategories`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify({
          id: sId,
          name: { en: sName, hi: "" },
          supportsExpiry: false
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Add subcategory error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("addSubcategory failed:", err);
      throw err;
    }
  },

  async deleteSubcategory(categoryId, subId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${categoryId}/subcategories/${subId}`, {
        method: "DELETE",
        headers: getAuthHeader()
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Delete subcategory error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("deleteSubcategory failed:", err);
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
      console.error("getPlans failed:", err);
      return [];
    }
  },

  async createPlan(payload) {
    try {
      const cleanPayload = { ...payload };
      const planId = String(cleanPayload.planId || cleanPayload.tier || cleanPayload.name || "").trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
      cleanPayload.planId = planId;
      cleanPayload.tier = planId;
      cleanPayload.badge = cleanPayload.badge || planId;

      const price = Number(cleanPayload.price !== undefined ? cleanPayload.price : (cleanPayload.pricing?.monthly || 0));
      cleanPayload.pricing = cleanPayload.pricing || {
        monthly: price,
        quarterly: price * 3,
        semiAnnual: price * 6,
        yearly: price * 10
      };

      const res = await fetch(`${BASE_URL}/admin/plans`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(cleanPayload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Create plan error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("createPlan failed:", err);
      throw err;
    }
  },

  async updatePlan(planId, payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/plans/${planId}`, {
        method: "PATCH",
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Update plan error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("updatePlan failed:", err);
      throw err;
    }
  },

  async deletePlan(planId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/plans/${planId}`, {
        method: "DELETE",
        headers: getAuthHeader()
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Delete plan error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("deletePlan failed:", err);
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
      console.error("getShares failed:", err);
      return [];
    }
  },

  async revokeShareLink(shareId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/shares/${shareId}`, {
        method: "DELETE",
        headers: getAuthHeader()
      });
      if (!res.ok) throw new Error(`Revoke share error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("revokeShareLink failed:", err);
      throw err;
    }
  },

  async getReferrals() {
    try {
      const res = await fetch(`${BASE_URL}/admin/referrals`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Referrals error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("getReferrals failed:", err);
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
      console.error("getLanguages failed:", err);
      return [];
    }
  },

  async getLanguageDetails(code) {
    try {
      const res = await fetch(`${BASE_URL}/admin/languages/${code}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error(`Language details error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("getLanguageDetails failed:", err);
      return null;
    }
  },

  async updateLanguageTranslations(code, payload) {
    try {
      const res = await fetch(`${BASE_URL}/admin/languages/${code}`, {
        method: "PUT",
        headers: getAuthHeader(),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Update language error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error("updateLanguageTranslations failed:", err);
      throw err;
    }
  }
};
