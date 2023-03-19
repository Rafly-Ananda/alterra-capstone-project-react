import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu,Button,Badge,Avatar } from "antd";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { logoutReducer } from "../../redux/slice/usersSlice";
import { useDispatch } from "react-redux";
import { message } from "antd";


const NavbarClient = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    let navigate = useNavigate();
    const cart = useSelector((state) => state.cart.cart);
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);


    const { user } = useSelector((state) => state.user);
    const { isLoggedIn } = useSelector((state) => state.user);

    useEffect(() => {
        console.log(user);
        console.log(isLoggedIn);
    }, []);
    const handleLogout = () => {
        dispatch(logoutReducer());
        message.success("You have been logged out");
        navigate("/login");
    }

    return (
        <>
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
                    {isLoggedIn && (
                    <Menu.Item key="/orders" as={Link} >
                        <NavLink to="/orders">Orders</NavLink>
                    </Menu.Item>
                    )}
                    <Menu.Item key="/cart" style={{ marginLeft: 'auto' }}>
                        <NavLink to="/cart">
                            <Badge count={totalQuantity}>
                                <Avatar shape="square" className="bg-indigo-500" >
                                    <ShoppingCartOutlined /> 
                                </Avatar>
                            </Badge>
                        </NavLink>
                    </Menu.Item>
                    {isLoggedIn ? (
                        <>
                            <Menu.Item >
                                <NavLink to="#">
                                    <UserOutlined /> {user.user.username}
                                </NavLink>
                            </Menu.Item>
                            <Menu.Item key="/logout" onClick={()=>handleLogout()}>
                                <Button className="bg-red-500 text-white">
                                    Logout
                                </Button>
                            </Menu.Item>
                        </>
                    ):(
                        <>
                            <Menu.Item key="/login" >
                                <Button className="bg-sky-500 text-white">
                                    <NavLink to="/login">Login</NavLink>
                                </Button>
                            </Menu.Item>
                        </>
                    )}
                </Menu>
            </nav>
        </>
    );
};

export default NavbarClient;
