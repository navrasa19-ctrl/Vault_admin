import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import CategoriesTab from './components/CategoriesTab';
import PlansTab from './components/PlansTab';
import StorageTab from './components/StorageTab';
import SharesTab from './components/SharesTab';
import ReferralsTab from './components/ReferralsTab';
import LanguagesTab from './components/LanguagesTab';
import PlanAllotmentModal from './components/PlanAllotmentModal';
import AddCategoryModal from './components/AddCategoryModal';
import AddPlanModal from './components/AddPlanModal';
import LoginModal from './components/LoginModal';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Core Data State
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [shares, setShares] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Controllers
  const [allotmentUser, setAllotmentUser] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial load
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, analyticsData, usersData, catsData, plansData, sharesData, refsData, langsData] = await Promise.all([
        api.getStats(),
        api.getAnalytics(),
        api.getUsers(),
        api.getCategories(),
        api.getPlans(),
        api.getShares(),
        api.getReferrals(),
        api.getLanguages()
      ]);

      setStats(statsData);
      setAnalytics(analyticsData);
      setUsers(usersData);
      setCategories(catsData);
      setPlans(plansData);
      setShares(sharesData);
      setReferrals(refsData);
      setLanguages(langsData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      showToast('Error syncing with backend, loaded fallback state', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check local token
    const token = localStorage.getItem('vault_admin_token');
    if (token) {
      setIsLoggedIn(true);
      setCurrentUser({ name: 'Root Administrator', email: 'admin@beememvault.com', role: 'admin' });
    }
    loadDashboardData();
  }, []);

  // Handlers
  const handleLogin = async (email, otp) => {
    try {
      const res = await api.login(email, otp);
      if (res && res.token) {
        setIsLoggedIn(true);
        setCurrentUser(res.user || { name: 'Admin', email, role: 'admin' });
        setShowLoginModal(false);
        showToast('Authorized as Master Admin');
        loadDashboardData();
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    return false;
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    showToast('Signed out of Admin Console');
  };

  const handleAllotPlan = async (userId, planData) => {
    try {
      await api.allotUserPlan(userId, planData);
      setUsers(prev => prev.map(u => (u.id === userId || u._id === userId ? { ...u, plan: planData.plan } : u)));
      setAllotmentUser(null);
      showToast(`Plan updated to ${planData.plan} successfully`);
      loadDashboardData();
    } catch (err) {
      showToast('Failed to update user plan', 'error');
    }
  };

  const handleAddCategory = async (catData) => {
    try {
      const newCat = await api.createCategory(catData);
      setCategories(prev => [...prev, newCat]);
      setShowAddCategoryModal(false);
      showToast('Category created successfully');
    } catch (err) {
      showToast('Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to remove "${catName}"?`)) return;
    try {
      await api.deleteCategory(catId);
      setCategories(prev => prev.filter(c => (c.id || c._id) !== catId));
      showToast('Category removed');
    } catch (err) {
      showToast('Failed to delete category', 'error');
    }
  };

  const handleAddSubcategory = async (catId, subName) => {
    try {
      await api.addSubcategory(catId, subName);
      setCategories(prev => prev.map(c => {
        if ((c.id || c._id) === catId) {
          return { ...c, subcategories: [...(c.subcategories || []), subName] };
        }
        return c;
      }));
      showToast(`Added "${subName}" subcategory`);
    } catch (err) {
      showToast('Failed to add subcategory', 'error');
    }
  };

  const handleDeleteSubcategory = async (catId, subName) => {
    try {
      await api.deleteSubcategory(catId, subName);
      setCategories(prev => prev.map(c => {
        if ((c.id || c._id) === catId) {
          return { ...c, subcategories: (c.subcategories || []).filter(s => s !== subName) };
        }
        return c;
      }));
      showToast(`Removed subcategory "${subName}"`);
    } catch (err) {
      showToast('Failed to remove subcategory', 'error');
    }
  };

  const handleAddPlan = async (planData) => {
    try {
      const created = await api.createPlan(planData);
      setPlans(prev => [...prev, created]);
      setShowAddPlanModal(false);
      showToast('Plan created successfully');
    } catch (err) {
      showToast('Failed to create plan', 'error');
    }
  };

  const handleDeletePlan = async (planId, planName) => {
    if (!window.confirm(`Are you sure you want to delete the plan "${planName}"?`)) return;
    try {
      await api.deletePlan(planId);
      setPlans(prev => prev.filter(p => (p.id || p._id) !== planId));
      showToast('Plan deleted');
    } catch (err) {
      showToast('Failed to delete plan', 'error');
    }
  };

  const handleRevokeShare = async (shareId) => {
    if (!window.confirm('Revoke this share link immediately? It will no longer be accessible.')) return;
    try {
      await api.revokeShareLink(shareId);
      setShares(prev => prev.map(s => ((s.id || s.shareId) === shareId ? { ...s, isRevoked: true } : s)));
      showToast('Shared link revoked');
    } catch (err) {
      showToast('Failed to revoke link', 'error');
    }
  };

  return (
    <div className="flex h-screen bg-[#07090E] text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl border shadow-2xl text-xs font-semibold flex items-center gap-2 animate-slideDown ${
          toast.type === 'error'
            ? 'bg-rose-950/90 border-rose-500/50 text-rose-300'
            : 'bg-indigo-950/90 border-indigo-500/50 text-indigo-200'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={currentUser}
          onLogout={handleLogout}
          onOpenLogin={() => setShowLoginModal(true)}
          onRefresh={loadDashboardData}
        />

        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              analytics={analytics}
              users={users}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'users' && (
            <UsersTab
              users={users}
              onAllotPlan={(u) => setAllotmentUser(u)}
              onRefresh={loadDashboardData}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab
              categories={categories}
              onAddCategory={() => setShowAddCategoryModal(true)}
              onDeleteCategory={handleDeleteCategory}
              onAddSubcategory={handleAddSubcategory}
              onDeleteSubcategory={handleDeleteSubcategory}
            />
          )}

          {activeTab === 'plans' && (
            <PlansTab
              plans={plans}
              onAddPlan={() => setShowAddPlanModal(true)}
              onDeletePlan={handleDeletePlan}
            />
          )}

          {activeTab === 'storage' && (
            <StorageTab
              stats={stats}
              analytics={analytics}
              users={users}
            />
          )}

          {activeTab === 'shares' && (
            <SharesTab
              shares={shares}
              onRevokeShare={handleRevokeShare}
            />
          )}

          {activeTab === 'referrals' && (
            <ReferralsTab
              referrals={referrals}
              users={users}
            />
          )}

          {activeTab === 'languages' && (
            <LanguagesTab
              languages={languages}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {allotmentUser && (
        <PlanAllotmentModal
          user={allotmentUser}
          plans={plans}
          onClose={() => setAllotmentUser(null)}
          onAllotPlan={handleAllotPlan}
        />
      )}

      {showAddCategoryModal && (
        <AddCategoryModal
          onClose={() => setShowAddCategoryModal(false)}
          onSave={handleAddCategory}
        />
      )}

      {showAddPlanModal && (
        <AddPlanModal
          onClose={() => setShowAddPlanModal(false)}
          onSave={handleAddPlan}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}
