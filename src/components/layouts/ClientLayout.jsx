import React from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet } from "react-router-dom";

const { Header, Content, Footer } = Layout;

export default function ClientLayout() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    
    return (
        <Layout className="layout min-h-screen">
        <Header className='bg-white drop-shadow-lg'>
            <div className="logo-container" />
            <Menu mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="home" style={{ paddingLeft: '20px' }}>
                    <img src={'/assets/logo.png'} alt="Logo" />
                </Menu.Item>
                <Menu.Item key="1">Home</Menu.Item>
                <Menu.Item key="2">Explore</Menu.Item>
                <Menu.Item key="3">Order</Menu.Item>
            </Menu>
        </Header>
        <Content className='px-4 md:px-20 xl:px-40 2xl:px-60'>
            <Outlet />
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
        </Layout>
    );
}
