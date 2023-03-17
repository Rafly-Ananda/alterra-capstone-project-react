import React, { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import SideNav from "../global/SideNav";
import TopNav from "../global/TopNav";

export default function AdminLayout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    console.log(user);
  }, []);

  return user?.role === "admin" ? (
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
