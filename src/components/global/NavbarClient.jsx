import { Link, useLocation } from "react-router-dom";
import { Menu,Button,Badge,Avatar } from "antd";
import { useState,useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const NavbarClient = () => {
  const { pathname } = useLocation();
  const cart = useSelector((state) => state.cart.cart);
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);


  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  useEffect(() => {
    console.log(user);
  }, []);

    // return user?.isLoggedIn ? (
    //     <nav className="navbar">
    //         <Menu mode="horizontal" selectedKeys={[pathname]}>
    //             <NavLink to="#" style={{ display: 'flex', alignItems: 'center' }}>
    //                 <img src={"/vite.svg"} alt="" />
    //             </NavLink>
    //             <Menu.Item key="/" >
    //                 <NavLink to="/">Home</NavLink>
    //             </Menu.Item>
    //             <Menu.Item key="/explore"  >
    //                 <NavLink to="/explore">Explore</NavLink>
    //             </Menu.Item>
    //             <Menu.Item key="/orders" as={Link} >
    //                 <NavLink to="/orders">Orders</NavLink>
    //             </Menu.Item>
    //             <Menu.Item key="/cart" style={{ marginLeft: 'auto' }}>
    //                 <NavLink to="/cart">
    //                     <Badge count={totalQuantity}>
    //                         <Avatar shape="square" className="bg-indigo-500" >
    //                             <ShoppingCartOutlined /> 
    //                         </Avatar>
    //                     </Badge>
    //                 </NavLink>
    //             </Menu.Item>
    //             <Menu.Item key="">
    //                 <NavLink to="#">
    //                     <UserOutlined /> User
    //                 </NavLink>
    //             </Menu.Item>
    //             <Menu.Item key="/logout" >
    //                 <Button className="bg-red-500 text-white">
    //                     Logout
    //                 </Button>
    //             </Menu.Item>
    //         </Menu>
    //     </nav>
    //     ) : (
    //     <nav className="navbar">
    //         <Menu mode="horizontal" selectedKeys={[pathname]}>
    //             <NavLink to="#" style={{ display: 'flex', alignItems: 'center' }}>
    //                 <img src={"/vite.svg"} alt="" />
    //             </NavLink>
    //             <Menu.Item key="/" >
    //                 <NavLink to="/">Home</NavLink>
    //             </Menu.Item>
    //             <Menu.Item key="/explore"  >
    //                 <NavLink to="/explore">Explore</NavLink>
    //             </Menu.Item>
    //             <Menu.Item key="/cart" style={{ marginLeft: 'auto' }}>
    //                 <NavLink to="/cart">
    //                     <Badge count={totalQuantity}>
    //                         <Avatar shape="square" className="bg-indigo-500" >
    //                             <ShoppingCartOutlined /> 
    //                         </Avatar>
    //                     </Badge>
    //                 </NavLink>
    //             </Menu.Item>
    //             {/* <Menu.Item key="">
    //                 <NavLink to="#">
    //                     <UserOutlined /> User
    //                 </NavLink>
    //             </Menu.Item> */}
    //             <Menu.Item key="/login" >
    //                 <Button className="bg-sky-500 text-white">
    //                     Login
    //                 </Button>
    //             </Menu.Item>
    //         </Menu>
    //     </nav>
    // );


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
                    <Badge count={totalQuantity}>
                        <Avatar shape="square" className="bg-indigo-500" >
                            <ShoppingCartOutlined /> 
                        </Avatar>
                    </Badge>
                </NavLink>
            </Menu.Item>
            <Menu.Item key="">
                <NavLink to="#">
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
