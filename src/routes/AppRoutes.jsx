import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import NotFound from "../Pages/NotFound";

import ProtectedRoute from "@/components/ProtectedRoute";

import Dashboard2 from "@/modules/dashboard/Dashboard2";
import CompanyManagement from "@/modules/companies/CompanyManagement";
import Inventory from "@/modules/inventory/Inventory";
import InventoryMovements from "@/modules/inventory/InventoryMovements";
import CategoryManagement from "@/modules/categories/CategoryManagement";
import CustomerManagement from "@/modules/customers/CustomerManagement";
import SupplierManagement from "@/modules/suppliers/SupplierManagement";
import PurchasesManagement from "@/modules/purchases/PurchasesManagement";
import SalesManagement from "@/modules/sales/SalesManagement";

import FinanceDashboard from "@/modules/finance/FinanceDashboard";

import CRMDashboard from "@/modules/crm/CRMDashboard";
import LeadManagement from "@/modules/crm/LeadManagement";
import Opportunities from "@/modules/crm/Opportunities";
import FollowUps from "@/modules/crm/FollowUps";

import EmployeeManagement from "@/modules/hr/EmployeeManagement";
import Departments from "@/modules/hr/Departments";
import Positions from "@/modules/hr/Positions";
import Attendance from "@/modules/hr/Attendance";
import Payroll from "@/modules/hr/Payroll";
import SalesAnalytics from "@/modules/analytics/sales/SalesAnalytics";
import PurchaseAnalytics from "@/modules/analytics/purchases/PurchaseAnalytics";
import InventoryAnalytics from "@/modules/analytics/inventory/InventoryAnalytics";
import FinanceAnalytics from "@/modules/analytics/finance/FinanceAnalytics";
import CRMAnalytics from "@/modules/analytics/crm/CRMAnalytics";
import HRAnalytics from "@/modules/analytics/hr/HRAnalytics";
import ReportsCenter from "@/modules/reports/ReportsCenter";
import ExecutiveDashboard from "@/modules/executive/ExecutiveDashboard";
import InventoryDashboard from "@/modules/inventory/InventoryDashboard";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}

        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard2 />
    </ProtectedRoute>
  }
/>

        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <CompanyManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoryManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <SupplierManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <PurchasesManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory-movements"
          element={
            <ProtectedRoute>
              <InventoryMovements />
            </ProtectedRoute>
          }
        />

        <Route
          path="/finance"
          element={
            <ProtectedRoute>
              <FinanceDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm"
          element={
            <ProtectedRoute>
              <CRMDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm/leads"
          element={
            <ProtectedRoute>
              <LeadManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm/opportunities"
          element={
            <ProtectedRoute>
              <Opportunities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/crm/follow-ups"
          element={
            <ProtectedRoute>
              <FollowUps />
            </ProtectedRoute>
          }
        />

        <Route
  path="/hr"
  element={<Navigate to="/hr/employees" replace />}
/>

        <Route
          path="/hr/employees"
          element={
            <ProtectedRoute>
              <EmployeeManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <Departments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/positions"
          element={
            <ProtectedRoute>
              <Positions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payroll"
          element={
            <ProtectedRoute>
              <Payroll />
            </ProtectedRoute>
          }
        />

       <Route
  path="/analytics/sales"
  element={<SalesAnalytics />}
/>

<Route
  path="/analytics/purchases"
  element={
    <ProtectedRoute>
      <PurchaseAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics/inventory"
  element={
    <ProtectedRoute>
      <InventoryAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics/finance"
  element={
    <ProtectedRoute>
      <FinanceAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics/crm"
  element={
    <ProtectedRoute>
      <CRMAnalytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics/hr"
  element={
    <ProtectedRoute>
      <HRAnalytics />
    </ProtectedRoute>
  }
/>

<Route
    path="/reports"
    element={<ReportsCenter />}
/>

<Route
  path="/executive"
  element={
    <ProtectedRoute>
      <ExecutiveDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/inventory-dashboard"
  element={
    <ProtectedRoute>
      <InventoryDashboard />
    </ProtectedRoute>
  }
/>
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;