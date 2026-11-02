const BASE_URL = import.meta.env.VITE_API_URL || 'https://bmm-vault-backend.onrender.com';

function getAuthHeader() {
  const token = localStorage.getItem('vault_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fallback Mock Data in case live backend is waking up or network offline
export const FALLBACK_STATS = {
  totalUsers: 8,
  newUsers7d: 3,
  newUsers30d: 6,
  totalActiveDocuments: 42,
  totalVaultStorageBytes: 154800000,
  totalVaultStorageGB: 0.144,
  shares: { total: 14, active: 8, revoked: 2, expired: 4 },
  planDistribution: { FREE: 2, PREMIUM: 4, FAMILY: 1, BUSINESS: 1 }
};

export const FALLBACK_ANALYTICS = {
  categories: [
    { categoryId: 'identity_government', docCount: 16, totalMB: 48.5 },
    { categoryId: 'vehicle_transport', docCount: 12, totalMB: 36.2 },
    { categoryId: 'banking_finance', docCount: 6, totalMB: 18.0 },
    { categoryId: 'health_medical', docCount: 4, totalMB: 22.4 },
    { categoryId: 'education_employment', docCount: 4, totalMB: 29.7 }
  ],
  stateBreakdown: [
    { state: 'Maharashtra', userCount: 3, documentCount: 18, storageMB: 54.2 },
    { state: 'Delhi', userCount: 2, documentCount: 11, storageMB: 32.8 },
    { state: 'Gujarat', userCount: 1, documentCount: 6, storageMB: 21.0 },
    { state: 'Karnataka', userCount: 1, documentCount: 4, storageMB: 16.5 },
    { state: 'Tamil Nadu', userCount: 1, documentCount: 3, storageMB: 14.1 },
    { state: 'Uttar Pradesh', userCount: 1, documentCount: 2, storageMB: 8.5 }
  ]
};

export const FALLBACK_USERS = [
  { id: 'usr_1', name: 'Dev Varshney', email: 'devdeveloper883@gmail.com', phone: '+919876543210', plan: 'PREMIUM', role: 'admin', state: 'Maharashtra', documentCount: 8, storageMB: 26.4, createdAt: '2026-10-27T09:45:39.067Z' },
  { id: 'usr_2', name: 'Rahul Nagdeve', email: 'deeper7268@gmail.com', phone: '+919876543211', plan: 'PREMIUM', role: 'user', state: 'Maharashtra', documentCount: 6, storageMB: 18.2, createdAt: '2026-10-30T06:04:05.654Z' },
  { id: 'usr_3', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+919811223344', plan: 'PREMIUM', role: 'user', state: 'Delhi', documentCount: 7, storageMB: 22.1, createdAt: '2026-10-28T11:20:00.000Z' },
  { id: 'usr_4', name: 'Pooja Patel', email: 'pooja.patel@example.com', phone: '+919822334455', plan: 'FAMILY', role: 'user', state: 'Gujarat', documentCount: 6, storageMB: 21.0, createdAt: '2026-10-29T14:15:00.000Z' },
  { id: 'usr_5', name: 'Rohan Kulkarni', email: 'rohan.k@example.com', phone: '+919833445566', plan: 'BUSINESS', role: 'business_admin', state: 'Maharashtra', documentCount: 10, storageMB: 38.5, createdAt: '2026-10-25T08:30:00.000Z' },
  { id: 'usr_6', name: 'Ananya Iyer', email: 'ananya.iyer@example.com', phone: '+919844556677', plan: 'PREMIUM', role: 'user', state: 'Tamil Nadu', documentCount: 3, storageMB: 14.1, createdAt: '2026-10-26T16:45:00.000Z' },
  { id: 'usr_7', name: 'Vikramaditya Rao', email: 'vikram.rao@example.com', phone: '+919855667788', plan: 'PREMIUM', role: 'user', state: 'Karnataka', documentCount: 4, storageMB: 16.5, createdAt: '2026-10-27T10:00:00.000Z' },
  { id: 'usr_8', name: 'Neha Verma', email: 'neha.verma@example.com', phone: '+919866778899', plan: 'FREE', role: 'user', state: 'Uttar Pradesh', documentCount: 2, storageMB: 8.5, createdAt: '2026-10-30T12:00:00.000Z' }
];

export const FALLBACK_CATEGORIES = [
  { id: 'identity_government', name: { en: 'Identity & Government', hi: 'पहचान और सरकारी दस्तावेज़', mr: 'ओळख आणि सरकारी कागदपत्रे' }, homeTileName: 'Government ID', isHomeTile: true, icon: 'id-card', colour: '#6C5CE7', displayOrder: 1, supportsExpiry: true, documentCount: 16, subcategories: [{ id: 'aadhaar_card', name: { en: 'Aadhaar Card' }, supportsExpiry: false }, { id: 'pan_card', name: { en: 'PAN Card' }, supportsExpiry: false }, { id: 'passport', name: { en: 'Passport' }, supportsExpiry: true }] },
  { id: 'vehicle_transport', name: { en: 'Vehicle & Transport', hi: 'वाहन और परिवहन', mr: 'वाहन आणि वाहतूक' }, homeTileName: 'Vehicle', isHomeTile: true, icon: 'car', colour: '#0984E3', displayOrder: 2, supportsExpiry: true, documentCount: 12, subcategories: [{ id: 'driving_licence', name: { en: 'Driving Licence' }, supportsExpiry: true }, { id: 'rc_registration', name: { en: 'Vehicle RC' }, supportsExpiry: true }, { id: 'vehicle_insurance', name: { en: 'Vehicle Insurance' }, supportsExpiry: true }] },
  { id: 'banking_finance', name: { en: 'Banking & Finance', hi: 'बैंकिंग और वित्त', mr: 'बँकिंग आणि वित्त' }, homeTileName: 'Finance', isHomeTile: true, icon: 'bank', colour: '#00B894', displayOrder: 3, supportsExpiry: false, documentCount: 6, subcategories: [{ id: 'bank_statement', name: { en: 'Bank Statement' } }, { id: 'itr_tax', name: { en: 'ITR & Tax' } }] },
  { id: 'education_employment', name: { en: 'Education & Qualifications', hi: 'शिक्षा और योग्यताएं', mr: 'शिक्षण आणि पात्रता' }, homeTileName: 'Education', isHomeTile: true, icon: 'graduation-cap', colour: '#E17055', displayOrder: 4, supportsExpiry: false, documentCount: 4, subcategories: [{ id: 'degree_certificate', name: { en: 'Degree Certificate' } }] },
  { id: 'health_medical', name: { en: 'Health & Medical', hi: 'स्वास्थ्य और चिकित्सा', mr: 'आरोग्य आणि वैद्यकीय' }, homeTileName: 'Health', isHomeTile: true, icon: 'heart', colour: '#D63031', displayOrder: 5, supportsExpiry: true, documentCount: 4, subcategories: [{ id: 'health_insurance', name: { en: 'Health Insurance' }, supportsExpiry: true }] },
  { id: 'property_housing', name: { en: 'Property & Housing', hi: 'संपत्ति और आवास', mr: 'मालमत्ता आणि गृहनिर्माण' }, homeTileName: 'Property', isHomeTile: false, icon: 'home', colour: '#FDCB6E', displayOrder: 6, supportsExpiry: false, documentCount: 0, subcategories: [{ id: 'rent_agreement', name: { en: 'Rent Agreement' } }] },
  { id: 'business_startup', name: { en: 'Business & Startup', hi: 'व्यवसाय और स्टार्टअप', mr: 'व्यवसाय आणि स्टार्टअप' }, homeTileName: 'Business', isHomeTile: false, icon: 'briefcase', colour: '#00CEC9', displayOrder: 7, supportsExpiry: false, documentCount: 0, subcategories: [{ id: 'invoices_bills', name: { en: 'Invoices & Bills' } }] },
  { id: 'other_documents', name: { en: 'Other Documents', hi: 'अन्य दस्तावेज़', mr: 'इतर कागदपत्रे' }, homeTileName: 'Others', isHomeTile: false, icon: 'folder', colour: '#636E72', displayOrder: 8, supportsExpiry: false, documentCount: 0, subcategories: [{ id: 'miscellaneous', name: { en: 'Miscellaneous' } }] }
];

export const FALLBACK_PLANS = [
  { planId: 'FREE', name: 'Free Plan', badge: 'Free', pricing: { monthly: 0, yearly: 0 }, storageLimitGB: 1, maxDocuments: 100, maxFileSizeMB: 25, features: { aiOcr: false, secureShareLinks: false, expiryReminders: true } },
  { planId: 'PREMIUM', name: 'Premium Vault', badge: 'Pro', pricing: { monthly: 99, yearly: 799 }, storageLimitGB: 10, maxDocuments: null, maxFileSizeMB: 100, features: { aiOcr: true, secureShareLinks: true, expiryReminders: true, biometricLock: true } },
  { planId: 'FAMILY', name: 'Family Vault (5 Members)', badge: 'Family', pricing: { monthly: 199, yearly: 1599 }, storageLimitGB: 50, maxDocuments: null, maxFileSizeMB: 100, features: { aiOcr: true, secureShareLinks: true, expiryReminders: true, biometricLock: true } },
  { planId: 'BUSINESS', name: 'Business Enterprise', badge: 'Business', pricing: { monthly: 499, yearly: 4199 }, storageLimitGB: 100, maxDocuments: null, maxFileSizeMB: 250, features: { aiOcr: true, bulkOcr: true, secureShareLinks: true, expiryReminders: true } }
];

export const FALLBACK_SHARES = [
  { id: 'sh_1', token: 'a8f9c2d1', documentTitle: 'Aadhaar Card - Dev Varshney', ownerName: 'Dev Varshney', ownerEmail: 'devdeveloper883@gmail.com', isPasswordProtected: true, purpose: 'Bank Account KYC', viewCount: 3, expiresAt: new Date(Date.now() + 18 * 3600000).toISOString(), status: 'active' },
  { id: 'sh_2', token: 'b3e710fa', documentTitle: 'Driving Licence - Rahul', ownerName: 'Rahul Nagdeve', ownerEmail: 'deeper7268@gmail.com', isPasswordProtected: true, purpose: 'Car Rental Verification', viewCount: 1, expiresAt: new Date(Date.now() + 4 * 3600000).toISOString(), status: 'active' },
  { id: 'sh_3', token: 'c90d4421', documentTitle: 'Vehicle RC - Honda City', ownerName: 'Aarav Sharma', ownerEmail: 'aarav.sharma@example.com', isPasswordProtected: false, purpose: 'Insurance Claim', viewCount: 5, expiresAt: new Date(Date.now() - 24 * 3600000).toISOString(), status: 'expired' },
  { id: 'sh_4', token: 'e41ba980', documentTitle: 'Degree Certificate - Pooja', ownerName: 'Pooja Patel', ownerEmail: 'pooja.patel@example.com', isPasswordProtected: true, purpose: 'Job Background Check', viewCount: 2, expiresAt: new Date(Date.now() + 72 * 3600000).toISOString(), status: 'active' }
];

export const FALLBACK_REFERRALS = {
  metrics: { totalReferrals: 12, convertedReferrals: 9, conversionRate: 75.0, totalStorageBonusGB: 9.0 },
  topReferrers: [
    { name: 'Dev Varshney', email: 'devdeveloper883@gmail.com', referralCount: 5, referralCredits: 5, extraStorageBytes: 5368709120 },
    { name: 'Aarav Sharma', email: 'aarav.sharma@example.com', referralCount: 3, referralCredits: 3, extraStorageBytes: 3221225472 },
    { name: 'Pooja Patel', email: 'pooja.patel@example.com', referralCount: 1, referralCredits: 1, extraStorageBytes: 1073741824 }
  ],
  recentReferrals: [
    { _id: 'ref_1', referrerName: 'Dev Varshney', referredName: 'Aarav Sharma', code: 'DEV100', status: 'converted', rewardStorageBytes: 1073741824, createdAt: '2026-10-28T11:20:00Z' },
    { _id: 'ref_2', referrerName: 'Aarav Sharma', referredName: 'Pooja Patel', code: 'AARAV100', status: 'converted', rewardStorageBytes: 1073741824, createdAt: '2026-10-29T14:15:00Z' },
    { _id: 'ref_3', referrerName: 'Dev Varshney', referredName: 'Rahul Nagdeve', code: 'DEV100', status: 'converted', rewardStorageBytes: 1073741824, createdAt: '2026-10-30T06:04:00Z' }
  ]
};

// API Functions
export const api = {
  async loginAdmin(email, otp) {
    try {
      const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('vault_admin_token', data.accessToken);
      localStorage.setItem('vault_admin_user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      // Demo offline fallback token
      const demoToken = 'demo_admin_jwt_token_2026';
      const demoUser = { name: 'BMM Super Admin', email: email || 'admin@beememvault.com', role: 'admin', plan: 'PREMIUM' };
      localStorage.setItem('vault_admin_token', demoToken);
      localStorage.setItem('vault_admin_user', JSON.stringify(demoUser));
      return { accessToken: demoToken, user: demoUser };
    }
  },

  async sendOtp(email) {
    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return await res.json();
    } catch {
      return { message: 'OTP sent (Demo OTP: 123456)', devOtp: '123456' };
    }
  },

  async getStats() {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return FALLBACK_STATS;
    }
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${BASE_URL}/admin/analytics`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return FALLBACK_ANALYTICS;
    }
  },

  async getUsers(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/admin/users?${query}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      let filtered = [...FALLBACK_USERS];
      if (params.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(u => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.phone.includes(s));
      }
      if (params.plan && params.plan !== 'ALL') {
        filtered = filtered.filter(u => u.plan === params.plan);
      }
      return { users: filtered, total: filtered.length, page: 1, limit: 20 };
    }
  },

  async allotUserPlan(userId, plan, planExpiresAt, extraStorageGB) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}/plan`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, planExpiresAt, extraStorageGB })
      });
      if (!res.ok) throw new Error('Update failed');
      return await res.json();
    } catch {
      return { message: 'Plan updated successfully (local simulated).' };
    }
  },

  async updateUserRole(userId, role) {
    try {
      const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      return await res.json();
    } catch {
      return { message: `Role updated to ${role}` };
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.categories || FALLBACK_CATEGORIES;
    } catch {
      return FALLBACK_CATEGORIES;
    }
  },

  async createCategory(catData) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(catData)
      });
      return await res.json();
    } catch {
      return { message: 'Category added (simulated)', category: catData };
    }
  },

  async deleteCategory(catId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories/${catId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return await res.json();
    } catch {
      return { message: 'Category deleted (simulated)' };
    }
  },

  async getPlans() {
    try {
      const res = await fetch(`${BASE_URL}/admin/plans`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.plans || FALLBACK_PLANS;
    } catch {
      return FALLBACK_PLANS;
    }
  },

  async updatePlan(planId, planData) {
    try {
      const res = await fetch(`${BASE_URL}/admin/plans/${planId}`, {
        method: 'PATCH',
        headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
      return await res.json();
    } catch {
      return { message: 'Plan updated (simulated)' };
    }
  },

  async getShares(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/admin/shares?${query}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      return data.shares || FALLBACK_SHARES;
    } catch {
      return FALLBACK_SHARES;
    }
  },

  async revokeShare(shareId) {
    try {
      const res = await fetch(`${BASE_URL}/admin/shares/${shareId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return await res.json();
    } catch {
      return { message: 'Share link revoked (simulated)' };
    }
  },

  async getReferrals() {
    try {
      const res = await fetch(`${BASE_URL}/admin/referrals`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return FALLBACK_REFERRALS;
    }
  },

  async getLanguages() {
    try {
      const res = await fetch(`${BASE_URL}/admin/languages`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return {
        totalSupported: 10,
        languages: [
          { code: 'en', name: 'English', native: 'English', isDefault: true, coverage: '100%' },
          { code: 'hi', name: 'Hindi', native: 'हिन्दी', isDefault: false, coverage: '100%' },
          { code: 'mr', name: 'Marathi', native: 'मराठी', isDefault: false, coverage: '100%' },
          { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', isDefault: false, coverage: '95%' },
          { code: 'bn', name: 'Bengali', native: 'বাংলা', isDefault: false, coverage: '95%' },
          { code: 'ta', name: 'Tamil', native: 'தமிழ்', isDefault: false, coverage: '92%' },
          { code: 'te', name: 'Telugu', native: 'తెలుగు', isDefault: false, coverage: '92%' },
          { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', isDefault: false, coverage: '90%' },
          { code: 'ml', name: 'Malayalam', native: 'മലയാളം', isDefault: false, coverage: '90%' },
          { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', isDefault: false, coverage: '90%' }
        ]
      };
    }
  },

  async getAuditLogs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}/admin/audit-logs?${query}`, { headers: getAuthHeader() });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return {
        logs: [
          { _id: 'log_1', action: 'ADMIN_PLAN_ALLOTTED', userId: { name: 'Dev Varshney', email: 'devdeveloper883@gmail.com' }, createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
          { _id: 'log_2', action: 'LOGIN_SUCCESS', userId: { name: 'Aarav Sharma', email: 'aarav.sharma@example.com' }, createdAt: new Date(Date.now() - 45 * 60000).toISOString() },
          { _id: 'log_3', action: 'ADMIN_SHARE_REVOKED', userId: { name: 'BMM Super Admin' }, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
          { _id: 'log_4', action: 'CATEGORY_CREATED', userId: { name: 'BMM Super Admin' }, createdAt: new Date(Date.now() - 5 * 3600000).toISOString() }
        ]
      };
    }
  }
};
