/** Libs */
import { Routes, Route, Navigate } from "react-router-dom";

/** Components - Admin */
import AdminLayout from "./components/layouts/AdminLayout";

/** Pages - Admin */

// Items
import ProductOutlet from "./pages/admin/products/ProductOutlet";
import ProductHome from "./pages/admin/products/ProductHome";
import ProductCategories from "./pages/admin/products/ProductCategories";

// Users
import UserHome from "./pages/admin/users/UserHome";

// Orders
import OrderHome from "./pages/admin/orders/OrderHome";

// No Domain
import NotFound from "./pages/admin/NotFound";
import LoginForm from "./components/global/LoginForm";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          path=""
          element={<Navigate to="/admin/items/products" replace />}
        />
        <Route path="items" element={<ProductOutlet />}>
          <Route path="products" element={<ProductHome />} />
          <Route path="categories" element={<ProductCategories />} />
        </Route>
        <Route path="users" element={<UserHome />} />
        <Route path="orders" element={<OrderHome />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      <Route path="/" element={<>Base Home For client routes</>}></Route>
      <Route path="/login" element={<LoginForm />}></Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
