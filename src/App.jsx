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

/** Components - Client */
import ClientLayout from "./components/layouts/ClientLayout";
import OrderClientOutlet from "./pages/client/order/OrderClientOutlet";
import OrderClientHome from "./pages/client/order/OrderClientHome";
import OrderClientDetail from "./pages/client/order/OrderClientDetail";
import OrderClientPayment from "./pages/client/order/OrderClientPayment";
import ExploreHome from "./pages/client/explore/ExploreHome";
import ProductClientDetail from "./pages/client/product/ProductClientDetail";
import LoginForm from "./components/global/LoginForm";
import HomeClient from "./pages/client/HomeClient";
import CartHome from "./pages/client/cart/CartHome";
import RegisterForm from "./components/global/RegisterForm";

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
        <Route path="/" element={<ClientLayout />}>
            <Route path="" element={<HomeClient />} />
            <Route path="orders" element={<OrderClientOutlet />}>
                <Route path="" element={<OrderClientHome />} />
                <Route path="confirm-payment/:id" element={<OrderClientPayment />} />
                <Route path=":id" element={<OrderClientDetail />} />
            </Route>
            <Route path="/explore" element={<ExploreHome />} />
            <Route path="/products/:id" element={<ProductClientDetail />} />
            <Route path="/cart" element={<CartHome />} />
        </Route>
        <Route path="/register" element={<RegisterForm />}></Route>
        <Route path="/login" element={<LoginForm />}></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    );
}
