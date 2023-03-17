import React from 'react';
import { Breadcrumb, Layout, Menu, theme, Avatar } from 'antd';
import { Outlet } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import {UserOutlined} from '@ant-design/icons';
import NavbarClient from '../global/NavbarClient';

const { Header, Content, Footer } = Layout;

export default function ClientLayout() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    
    return (
        <Layout className="layout min-h-screen bg-white">
        <Header className='bg-white drop-shadow-lg'>
            <NavbarClient />
        </Header>
        <Content className='px-4 md:px-20 xl:px-40 2xl:px-60'>
            <Outlet />
        </Content>
        </Layout>
    );
}
