/** Libs */
import { Routes, Route, Navigate } from "react-router-dom";

/** Components - Admin */
import AdminLayout from "./components/layouts/AdminLayout";

/** Pages - Admin */
import ProductOutlet from "./pages/admin/products/ProductOutlet";
import ProductHome from "./pages/admin/products/ProductHome";
import ProductDetail from "./pages/admin/products/ProductDetail";

import Home from "./pages/admin/Home";
import Payments from "./pages/admin/Payments";
import Users from "./pages/admin/Users";
import NotFound from "./pages/admin/NotFound";

/** Components - Client */
import ClientLayout from "./components/layouts/ClientLayout";
import OrderOutlet from "./pages/client/order/OrderOutlet";
import OrderHome from "./pages/client/order/OrderHome";
import OrderDetail from "./pages/client/order/OrderDetail";
import ExploreHome from "./pages/client/explore/ExploreHome";
import ProductClientDetail from "./pages/client/product/ProductClientDetail";

export default function App() {
    return (
    <Routes>
        <Route path="/admin" element={<AdminLayout />}>
            <Route path="" element={<Home />} />
            <Route path="products" element={<ProductOutlet />}>
                <Route path="" element={<ProductHome />} />
                <Route path=":id" element={<ProductDetail />} />
            </Route>
            <Route path="users" element={<Users />} />
            <Route path="payments" element={<Payments />} />
            {/* <Route path="logout" element={<Product />} /> */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        <Route path="/" element={<ClientLayout />}>
            <Route path="" element={<Home />} />
            <Route path="orders" element={<OrderOutlet />}>
                <Route path="" element={<OrderHome />} />
                <Route path=":id" element={<OrderDetail />} />
            </Route>
            <Route path="/explore" element={<ExploreHome />} />
            <Route path="/products/:id" element={<ProductClientDetail />} />
        </Route>
        {/* <Route path="/" element={<>Base Home For client routes</>}></Route> */}
    </Routes>
  );
}
