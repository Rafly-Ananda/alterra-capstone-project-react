import { Link, useLocation } from "react-router-dom";
import { Menu,Button } from "antd";
import { NavLink } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const NavbarClient = () => {
  const { pathname } = useLocation();
  return (
    <nav className="navbar">
      <Menu mode="horizontal" selectedKeys={[pathname]}>

            <NavLink to="#" style={{ display: 'flex', alignItems: 'center' }}>
                <img src={"/vite.svg"} alt="" />
            </NavLink>

        <Menu.Item key="/" >
            <NavLink to="/">Home</NavLink>
        </Menu.Item>
        <Menu.Item key="/explore"  >
            <NavLink to="/explore">Explore</NavLink>
        </Menu.Item>
        <Menu.Item key="/orders" as={Link} >
            <NavLink to="/orders">Orders</NavLink>
        </Menu.Item>
        <Menu.Item key="/cart" style={{ marginLeft: 'auto' }}>
            <NavLink to="/cart">
                <ShoppingCartOutlined /> cart
            </NavLink>
        </Menu.Item>
        <Menu.Item key="/user">
            <NavLink to="/user">
                <UserOutlined /> User
            </NavLink>
        </Menu.Item>
        <Menu.Item key="/logout" >
            <Button className="bg-red-500 text-white">
                Logout
            </Button>
        </Menu.Item>
      </Menu>
    </nav>
  );
};

export default NavbarClient;
