import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import './Header.scss';

const { Header } = Layout;

const menu = isStaffRoute => {
  return (
    <Menu>
      {!isStaffRoute && <Menu.Item>Cập nhật thông tin</Menu.Item>}
      <Menu.Item>Đăng xuất</Menu.Item>
    </Menu>
  );
};

const HeaderComponent = ({ style, isStaffRoute }) => {
  return (
    <Header className="header" style={style}>
      <h1 className="header__left">A2HL Management</h1>
      <div className="header__right">
        <Dropdown overlay={menu(isStaffRoute)}>
          <span style={{ cursor: 'pointer', fontSize: '18px' }}>
            <UserOutlined />
            <DownOutlined style={{ marginLeft: '4px' }} />
          </span>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderComponent;
