import React from "react";
import { Outlet } from "react-router-dom";

import SideNav from "../global/SideNav";
import TopNav from "../global/TopNav";

export default function AdminLayout() {
  return (
    <div className="h-screen w-screen flex flex-row">
      <div className="h-full ">
        <SideNav />
      </div>
      <div className="overflow-y-scroll w-full p-2">
        <Outlet />
      </div>
    </div>
  );
}
