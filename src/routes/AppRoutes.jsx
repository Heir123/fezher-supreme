import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Dashboard from "../Pages/Dashboard";
import NotFound from "../Pages/NotFound";
import Inventory from "../modules/inventory/Inventory";
import CategoryManagement from "@/modules/categories/CategoryManagement";
import SupplierManagement from "@/modules/suppliers/SupplierManagement";
import CustomerManagement from "@/modules/customers/CustomerManagement";
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/categories" element={<CategoryManagement />} />
        <Route
  path="/suppliers"
  element={<SupplierManagement />}
/>
<Route
  path="/customers"
  element={<CustomerManagement />}
/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;