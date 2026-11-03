import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './components/OverviewTab';
import UsersTab from './components/UsersTab';
import StateDemographicsTab from './components/StateDemographicsTab';
import CategoriesTab from './components/CategoriesTab';
import PlansTab from './components/PlansTab';
import StorageTab from './components/StorageTab';
import SharesTab from './components/SharesTab';
import ReferralsTab from './components/ReferralsTab';
import LanguagesTab from './components/LanguagesTab';
import AdminsTab from './components/AdminsTab';
import AccessRestrictedTab from './components/AccessRestrictedTab';
import PlanAllotmentModal from './components/PlanAllotmentModal';
import AddCategoryModal from './components/AddCategoryModal';
import AddPlanModal from './components/AddPlanModal';
import LoginModal from './components/LoginModal';
import { api, DEFAULT_ADMIN_USER } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Core Data State from Real MongoDB
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [shares, setShares] = useState([]);
  const [referrals, setReferrals] = useState({});
  const [languages, setLanguages] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [allotmentUser, setAllotmentUser] = useState(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddPlanModal, setShowAddPlanModal] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        statsData,
        analyticsData,
        usersData,
        catsData,
        plansData,
        sharesData,
        refsData,
        langsData,
        subAdminsData
      ] = await Promise.all([
        api.getStats(),
        api.getAnalytics(),
        api.getUsers(),
        api.getCategories(),
        api.getPlans(),
        api.getShares(),
        api.getReferrals(),
        api.getLanguages(),
        api.getSubAdmins()
      ]);

      setStats(statsData);
      setAnalytics(analyticsData);
      setUsers(Array.isArray(usersData) ? usersData : usersData?.users || []);
      setCategories(Array.isArray(catsData) ? catsData : catsData?.categories || []);
      setPlans(Array.isArray(plansData) ? plansData : plansData?.plans || []);
      setShares(Array.isArray(sharesData) ? sharesData : sharesData?.shares || []);
      setReferrals(refsData);
      setLanguages(Array.isArray(langsData) ? langsData : langsData?.languages || []);
      setSubAdmins(subAdminsData || []);
    } catch (err) {
      console.error('Failed to load real DB data:', err);
      showToast('Error syncing with backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const { user } = await api.login(email, password);
      setCurrentUser(user);
      setShowLoginModal(false);
      showToast(`Logged in as ${user.name} (${user.role})`);
      // If current active tab is restricted, switch to overview
      const isSuper = user.role === 'super_admin';
      const perms = user.permissions || ['overview'];
      if (!isSuper && !perms.includes(activeTab)) {
        setActiveTab('overview');
      }
      loadDashboardData();
    } catch (e) {
      showToast(e.message || 'Login failed', 'error');
      throw e;
    }
  };

  const handleLogout = () => {
    setShowLoginModal(true);
  };

  const handleAllotPlan = async (userId, planData) => {
    try {
      await api.allotUserPlan(userId, planData);
      setUsers(prev => prev.map(u => ((u.id || u._id) === userId ? { ...u, plan: planData.plan } : u)));
      setAllotmentUser(null);
      showToast(`Plan updated to ${planData.plan} successfully`);
      loadDashboardData();
    } catch (err) {
      showToast('Failed to update user plan', 'error');
    }
  };

  const handleAddCategory = async (catData) => {
    try {
      await api.createCategory(catData);
      setShowAddCategoryModal(false);
      showToast('Category created in live database');
      loadDashboardData();
    } catch (err) {
      showToast('Failed to create category', 'error');
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to remove "${catName}"?`)) return;
    try {
      await api.deleteCategory(catId);
      showToast('Category removed from live database');
      loadDashboardData();
    } catch (err) {
      showToast('Failed to delete category', 'error');
    }
  };

  const handleAddSubcategory = async (catId, subName) => {
    try {
      await api.addSubcategory(catId, subName);
      showToast(`Added "${subName}" subcategory to database`);
      loadDashboardData();
    } catch (err) {
      showToast('Failed to add subcategory', 'error');
    }
  };

  const handleDeleteSubcategory = async (catId, subId) => {
    try {
      await api.deleteSubcategory(catId, subId);
      showToast('Removed subcategory from database');
      loadDashboardData();
    } catch (err) {
      showToast('Failed to remove subcategory', 'error');
    }
  };

  const handleAddPlan = async (planData) => {
    try {
      await api.createPlan(planData);
      setShowAddPlanModal(false);
      showToast('Plan created in live database');
      loadDashboardData();
    } catch (err) {
      showToast('Failed to create plan', 'error');
    }
  };

  const handleDeletePlan = async (planId, planName) => {
    if (!window.confirm(`Are you sure you want to deactivate "${planName}"?`)) return;
    try {
      await api.deletePlan(planId);
      showToast('Plan deactivated');
      loadDashboardData();
    } catch (err) {
      showToast('Failed to delete plan', 'error');
    }
  };

  const handleRevokeShare = async (shareId) => {
    if (!window.confirm('Revoke this share link immediately? It will no longer be accessible.')) return;
    try {
      await api.revokeShareLink(shareId);
      showToast('Shared link revoked in live database');
      loadDashboardData();
    } catch (err) {
      showToast('Failed to revoke link', 'error');
    }
  };

  // Sub-Admins Handlers
  const handleCreateSubAdmin = async (adminData) => {
    try {
      await api.createSubAdmin(adminData);
      showToast(`Sub-Admin "${adminData.name}" created successfully`);
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to create sub-admin', 'error');
      throw err;
    }
  };

  const handleUpdateSubAdmin = async (id, adminData) => {
    try {
      await api.updateSubAdmin(id, adminData);
      showToast('Sub-Admin permissions updated');
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to update sub-admin', 'error');
      throw err;
    }
  };

  const handleDeleteSubAdmin = async (id, name) => {
    if (!window.confirm(`Remove Sub-Admin "${name}"? They will lose all access to the admin portal.`)) return;
    try {
      await api.deleteSubAdmin(id);
      showToast(`Sub-Admin "${name}" deleted`);
      loadDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to delete sub-admin', 'error');
    }
  };

  // Check if current user has permission for active tab
  const isSuper = currentUser?.role === 'super_admin';
  const userPerms = currentUser?.permissions || ['overview'];
  const hasAccess = isSuper || (activeTab === 'admins' ? isSuper : userPerms.includes(activeTab));

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-2.5 rounded-2xl border shadow-xl text-xs font-bold flex items-center gap-2 animate-slideDown ${
          toast.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-700'
            : 'bg-indigo-600 text-white shadow-indigo-500/25'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Sidebar with RBAC locks */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        currentUser={currentUser}
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
          {/* Permission Guard: If module is locked for sub-admin */}
          {!hasAccess ? (
            <AccessRestrictedTab
              activeTab={activeTab}
              user={currentUser}
              onSwitchUser={() => setShowLoginModal(true)}
              setActiveTab={setActiveTab}
            />
          ) : (
            <>
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

              {activeTab === 'geo' && (
                <StateDemographicsTab
                  users={users}
                  analytics={analytics}
                  setActiveTab={setActiveTab}
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

              {activeTab === 'admins' && (
                <AdminsTab
                  subAdmins={subAdmins}
                  onCreateSubAdmin={handleCreateSubAdmin}
                  onUpdateSubAdmin={handleUpdateSubAdmin}
                  onDeleteSubAdmin={handleDeleteSubAdmin}
                />
              )}
            </>
          )}
        </main>
      </div>

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
