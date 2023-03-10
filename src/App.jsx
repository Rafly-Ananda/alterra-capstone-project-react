/** Libs */
import { Routes, Route, Navigate } from "react-router-dom";

/** Components - Admin */
import AdminLayout from "./components/layouts/AdminLayout";

/** Pages - Admin */
import Product from "./pages/admin/Product";
import Home from "./pages/admin/Home";
import Payments from "./pages/admin/Payments";
import Users from "./pages/admin/Users";
import NotFound from "./pages/admin/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="" element={<Home />} />
        <Route path="products" element={<Product />} />
        <Route path="users" element={<Users />} />
        <Route path="payments" element={<Payments />} />
        {/* <Route path="logout" element={<Product />} /> */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
      <Route path="/" element={<>Base Home For client routes</>}></Route>
    </Routes>
  );
}
