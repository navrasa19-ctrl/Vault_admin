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
import PlanAllotmentModal from './components/PlanAllotmentModal';
import AddCategoryModal from './components/AddCategoryModal';
import AddPlanModal from './components/AddPlanModal';
import { api, DEFAULT_ADMIN_USER } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(DEFAULT_ADMIN_USER);

  // Core Data State from Real MongoDB
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [plans, setPlans] = useState([]);
  const [shares, setShares] = useState([]);
  const [referrals, setReferrals] = useState({});
  const [languages, setLanguages] = useState([]);
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
      setUsers(Array.isArray(usersData) ? usersData : usersData?.users || []);
      setCategories(Array.isArray(catsData) ? catsData : catsData?.categories || []);
      setPlans(Array.isArray(plansData) ? plansData : plansData?.plans || []);
      setShares(Array.isArray(sharesData) ? sharesData : sharesData?.shares || []);
      setReferrals(refsData);
      setLanguages(Array.isArray(langsData) ? langsData : langsData?.languages || []);
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

  const handleLogout = () => {
    api.logout();
    showToast('Signed out of Admin Console');
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

          {activeTab === 'geo' && (
            <StateDemographicsTab
              users={users}
              analytics={analytics}
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
    </div>
  );
}
