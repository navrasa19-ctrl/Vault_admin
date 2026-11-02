# 🛡️ BMM Vault – Senior Executive Admin Portal Documentation & Testing Guide

Welcome to the **BMM Vault Admin Portal** (`Vault_admin`). This administrative command-and-control frontend was architected and engineered using **React 18 + Vite + Tailwind CSS + Lucide Icons**. It eliminates the cookie-cutter "AI template" look in favor of an **obsidian glassmorphism, cyberpunk neon dark theme** crafted specifically for high-security enterprise vault telemetry.

---

## 📑 Table of Contents
1. [Architecture & Design System](#1-architecture--design-system)
2. [Complete 10 Feature Breakdown](#2-complete-10-feature-breakdown)
3. [Live Local Setup & Execution](#3-live-local-setup--execution)
4. [Step-by-Step Feature Testing & Verification Guide](#4-step-by-step-feature-testing--verification-guide)
5. [Backend API Integration & Endpoints Reference](#5-backend-api-integration--endpoints-reference)
6. [Production Deployment Guide](#6-production-deployment-guide)

---

## 1. Architecture & Design System

### 🎨 Visual & UI Philosophy
- **Dark Obsidian Aesthetics**: Canvas background `#07090E` with secondary card elevations at `#0F1523`, accented by subtle borders (`border-slate-800/80` and `border-indigo-500/20`).
- **Glassmorphic Neon Radiance**: Selective Gaussian blurs (`backdrop-blur-xl`) with layered purple/indigo/emerald ambient glows.
- **Inter Typography & Micro-Animations**: Smooth scale transforms on hover (`active:scale-95`), transition fades (`animate-fadeIn`), and live pulse indicators for server and cloud nodes.
- **Dual-State Fault Tolerance**: Connects to the live BMM Vault REST API (`https://bmm-vault-backend.onrender.com` or local `http://localhost:5000`), with an automated fallback intelligence state that keeps the portal interactive even during network drops.

### 📁 Directory Layout (`/Users/store/Vault_admin`)
```bash
Vault_admin/
├── index.html                 # App shell with Inter Google Font & Title
├── vite.config.js             # Vite configuration with React plugin
├── tailwind.config.js         # Custom palette, animations & glow utilities
├── postcss.config.js          # PostCSS Tailwind processor
├── package.json               # React 18, Lucide React, Tailwind, Vite
├── dist/                      # Optimized zero-error production bundle
└── src/
    ├── main.jsx               # React 18 DOM root
    ├── App.jsx                # Master Layout, state router & notification toast
    ├── index.css              # Custom scrollbars, glass gradients & font setup
    ├── services/
    │   └── api.js             # Live REST API client with fallback intelligence
    ├── utils/
    │   └── exportCsv.js       # 1-Click dynamic CSV/Excel export utility
    └── components/
        ├── Header.jsx         # Telemetry bar, live search, admin identity badge
        ├── Sidebar.jsx        # Navigation bar with live counters & tab switching
        ├── OverviewTab.jsx    # System KPIs, state demographics, category donut
        ├── UsersTab.jsx       # User list, doc counts, state filter, plan triggers
        ├── CategoriesTab.jsx  # Category CRUD, subcategories tag manager
        ├── PlansTab.jsx       # Pricing tiers, storage limits, features CRUD
        ├── StorageTab.jsx     # AWS Mumbai S3 usage gauge, top consumers
        ├── SharesTab.jsx      # Password protected links, expiry countdown, revoke
        ├── ReferralsTab.jsx   # Refer & Earn funnel, leaderboard, ledger
        ├── LanguagesTab.jsx   # 10 Indian languages matrix & string dictionary
        ├── PlanAllotmentModal.jsx # Admin custom plan override modal
        ├── AddCategoryModal.jsx   # Category builder with color presets
        ├── AddPlanModal.jsx       # Subscription tier creator
        └── LoginModal.jsx         # Admin token OTP authentication modal
```

---

## 2. Complete 10 Feature Breakdown

### 1) Total Registered Users
- Real-time aggregation of all active vault subscribers.
- Searchable by name, email, phone number, and referral code.
- Filterable by Subscription Tier (`FREE`, `PREMIUM`, `FAMILY`, `BUSINESS`) and Role (`User`, `Admin`).

### 2) User-wise Document Count, Total Documents & State-wise Analytics
- Shows exact document count uploaded per individual user.
- State-wise demographic distribution across India (e.g. Maharashtra, Delhi, Gujarat, Karnataka, Tamil Nadu, Uttar Pradesh, Rajasthan, etc.).
- Percentage share and document storage breakdown per state.

### 3) Category & Sub-category CRUD (Add & Remove)
- Administrators can create custom categories with custom icons, color tags, and descriptions.
- Add and remove nested subcategories on the fly (e.g., *Aadhaar*, *PAN*, *Driving License* inside *Personal Identity*).
- Live counter of active documents enrolled under each taxonomy category.

### 4) Subscription Plan CRUD
- Full management of monetized tiers: Free (₹0), Premium (₹199/mo), Family (₹499/mo), Business (₹999/mo).
- Edit plan names, storage quotas (GB), billing cycles, and feature checklists.
- Toggle plans active/inactive or archive obsolete tiers.

### 5) Multilingual Localization Engine (10 Indian Languages)
- Native support for **10 official Indian languages**:
  1. English (`en`)
  2. Hindi (`hi` - हिन्दी)
  3. Marathi (`mr` - मराठी)
  4. Bengali (`bn` - বাংলা)
  5. Telugu (`te` - తెలుగు)
  6. Tamil (`ta` - தமிழ்)
  7. Gujarati (`gu` - ગુજરાતી)
  8. Kannada (`kn` - ಕನ್ನಡ)
  9. Malayalam (`ml` - മലയാളം)
  10. Punjabi (`pa` - ਪੰਜਾਬੀ)
- Live Translation String Dictionary inspector and locale preview.

### 6) Cloud Storage Utilization Analytics
- Direct telemetry of AWS S3 Mumbai (`ap-south-1`) bucket (`bmm-vault-storage-mumbai`).
- Global Storage Utilization Gauge (Used GB vs Total Provisioned Capacity).
- Storage distribution breakdown by Document Category and MIME type.
- Top Storage Consuming Users audit table with live capacity percentage bars.

### 7) 1-Click Export to CSV / Excel
- Instant download buttons on every administrative table:
  - **User & Plan Registry** (`vault_registered_users.csv`)
  - **State Demographics & Documents** (`vault_state_demographics.csv`)
  - **Cloud Storage Consumption Ledger** (`vault_cloud_storage_audit.csv`)
  - **Password-Protected Shares Report** (`vault_shared_links_audit.csv`)
  - **Refer & Earn Activity Stream** (`vault_refer_and_earn_ledger.csv`)

### 8) Password-Protected Shared Links & Expiry Tracking
- Monitoring table of all public and secure links generated by subscribers.
- Security badge indicating password-protected vs token-only links.
- Real-time countdown timer until link expiration (e.g., "2 days left", "4 hours left", "Expired").
- 1-Click **Instant Revocation** button to neutralize compromised or suspicious links immediately.

### 9) Subscription Plan Allotment by Admin
- Manual administrative override to allot plans to specific users.
- Configure custom validity duration (1 month, 6 months, 12 months, Lifetime).
- Allocate extra bonus cloud storage (+5 GB, +10 GB, +50 GB).
- Audit note logging reason for administrative upgrade.

### 10) Refer & Earn Growth Tracking
- Metrics for Total Referral Invites, Qualified Conversions, and Conversion Velocity (%).
- Total Cloud Storage Credits awarded (+1 GB per qualified invite).
- Top Community Champions Leaderboard (Rank, Code, Invites, Bonus Earned).
- Detailed audit stream tracking every referral link redemption.

---

## 3. Live Local Setup & Execution

### Starting the Dev Server
The project is completely self-contained in `/Users/store/Vault_admin`.
```bash
# Navigate to Vault_admin
cd /Users/store/Vault_admin

# Start Vite Development Server
npm run dev -- --host --port 5173
```
Open **`http://localhost:5173/`** in your browser.

### Building for Production
```bash
npm run build
```
Creates an optimized static bundle in `dist/` ready to host on Vercel, Netlify, Cloudflare Pages, or AWS CloudFront/S3.

---

## 4. Step-by-Step Feature Testing & Verification Guide

| Step | Section | Action to Test | Expected Result |
|---|---|---|---|
| **1** | **Authentication** | Click **"Admin Session"** badge in Header. Enter `admin@beememvault.com` and OTP `123456`. | Modal authenticates and unlocks administrative mutation actions. |
| **2** | **Overview Tab** | Inspect top KPI cards, Indian State Distribution table, and Category distribution. | All metrics reflect live registered users, storage, and state metrics. |
| **3** | **Export CSV** | Click **"Export CSV"** in the State Demographics section. | A clean CSV file `vault_state_demographics.csv` downloads immediately. |
| **4** | **Users & Subscriptions** | Click **"Users & Subscriptions"** tab. Use the search bar to search for "Aarav" or filter by state "Maharashtra". | Table filters instantly. Shows document counts, phone numbers, and plans. |
| **5** | **Plan Allotment** | On any user row, click **"Allot Plan"**. Select `BUSINESS`, choose `12 Months`, add `+25 GB`, and click **"Confirm Plan Allotment"**. | Toast notification confirms allotment; user's plan badge updates immediately. |
| **6** | **Taxonomy & Categories** | Click **"Taxonomy & Categories"** tab. Type a new subcategory name into the inline box (e.g., "Electricity Bill") and hit Enter. | New subcategory tag appears instantly. Click "Add Category" to create a new category. |
| **7** | **Monetization Plans** | Click **"Monetization Plans"** tab. View plan cards (Free, Premium, Family, Business). Click "Create New Plan". | Custom plan modal opens. Pricing in ₹ and storage allocations are rendered cleanly. |
| **8** | **Cloud Storage** | Click **"Cloud Storage"** tab. View the AWS Mumbai S3 gauge and top storage consuming users. | Progress bar visualizes storage footprint; top users capacity bars render proportionally. |
| **9** | **Shared Links** | Click **"Shared Links"** tab. Click **"Copy Link"** on any active link. Click **"Revoke"** on an active link. | Copy link copies the URL to clipboard. Revoke marks the link as Revoked with immediate UI update. |
| **10** | **Refer & Earn** | Click **"Refer & Earn"** tab. Inspect the Conversion Velocity card, Champions Leaderboard, and Activity Stream. | Shows invite codes (e.g. `AARAV100`), conversion stats, and storage bonus allocations. |
| **11** | **Languages** | Click **"Languages"** tab. Click on "हिन्दी", "मराठी", or "বাংলা". | Selected language activates and displays native translated string dictionary preview below. |

---

## 5. Backend API Integration & Endpoints Reference

The admin frontend consumes these REST endpoints on `BMM_Vault_backend`:

- `GET /api/admin/stats` – Global telemetry (users, documents, storage, shares).
- `GET /api/admin/analytics` – State-wise user and category storage breakdowns.
- `GET /api/admin/users` – Paginated list of registered users with document counts.
- `PATCH /api/admin/users/:id/plan` – Admin subscription plan allotment.
- `GET /api/admin/categories` – List all taxonomy categories & subcategories.
- `POST /api/admin/categories` – Create custom category.
- `DELETE /api/admin/categories/:id` – Delete category.
- `POST /api/admin/categories/:id/subcategories` – Add nested subcategory.
- `DELETE /api/admin/categories/:id/subcategories/:subName` – Remove subcategory.
- `GET /api/admin/plans` – Retrieve all pricing tiers.
- `POST /api/admin/plans` – Create custom pricing tier.
- `DELETE /api/admin/plans/:id` – Delete plan.
- `GET /api/admin/shares` – Telemetry on password-protected and shared links.
- `DELETE /api/admin/shares/:id` – Revoke shared link immediately.
- `GET /api/admin/referrals` – Refer & Earn transaction log.
- `GET /api/admin/languages` – Multilingual status and coverage.

---

## 6. GitHub Repository Information
- **Admin Frontend Repository**: [https://github.com/navrasa19-ctrl/Vault_admin.git](https://github.com/navrasa19-ctrl/Vault_admin.git) (Branch `main`)
- **Backend Repository**: [https://github.com/navrasa19-ctrl/BMM_Vault_backend.git](https://github.com/navrasa19-ctrl/BMM_Vault_backend.git) (Branch `main`)
