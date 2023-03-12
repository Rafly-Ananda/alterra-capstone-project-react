import React from "react";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  SettingOutlined,
  DatabaseOutlined,
  LogoutOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Menu, Button } from "antd";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  {
    type: "group",
    children: [
      getItem("Dashboard", "home", <HomeOutlined />),
      getItem("Products", "products", <DatabaseOutlined />),
      getItem("Users", "users", <UserOutlined />, [
        getItem("View All Users", "viewUsers"),
      ]),
      getItem("Order", "order", <ShoppingCartOutlined />, [
        getItem("View All Order", "viewOrder"),
      ]),
      getItem("Settings", "settings", <SettingOutlined />),
    ],
  },

  {
    type: "group",
    children: [
      {
        type: "divider",
      },
      getItem("Logout", "logout", <LogoutOutlined />),
    ],
  },
];

export default function SideNav() {
  const navigate = useNavigate();
  const onClick = (e) => {
    if (e.key === "logout") return;
    e.key === "home" ? navigate("") : navigate(`/admin/${e.key}`);
  };

  return (
    <Menu
      onClick={onClick}
      style={{
        width: 256,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      mode="vertical"
      items={items}
      className="h-full"
    />
  );
}
