import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

// Styles
import logo from '../../images/logo.png';
import './Sidebar.scss';

const { Sider } = Layout;

const StaffSidebar = ({ tabs, match }) => {
  return (
    <Sider width="300" theme="light" breakpoint="lg" collapsedWidth="0">
      <div className="sidebar-logo">
        <img src={logo} alt="logo" />
      </div>
      <Menu defaultSelectedKeys={[match.path]} mode="inline">
        {Object.keys(tabs).map(tab => {
          const key =
            match.path.includes(tabs[tab].to) &&
            tabs[tab].to !== '/' &&
            tabs[tab].to !== '/a2hl-management'
              ? match.path
              : tabs[tab].to;

          return (
            <Menu.Item key={key} icon={tabs[tab].icon}>
              <Link to={tabs[tab].to}>{tabs[tab].label}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

export default withRouter(StaffSidebar);
