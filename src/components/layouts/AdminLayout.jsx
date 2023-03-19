import React, { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SideNav from "../global/SideNav";
import TopNav from "../global/TopNav";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin" && !isLoggedIn) navigate("/");
  }, []);

  return user?.user.role === "admin" && isLoggedIn ? (
    <div className="h-screen w-screen flex flex-row">
      <div className="h-full ">
        <SideNav />
      </div>
      <div className="overflow-y-scroll w-full p-2">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to={"/"} state={{ from: location }} replace />
  );
}
